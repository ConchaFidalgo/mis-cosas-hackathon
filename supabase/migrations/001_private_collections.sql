-- One transactional aggregate per account preserves the existing domain contract.
-- Files remain separate: never store base64 or signed URLs in the collection.
begin;
create table public.mc_collections (
 owner_id uuid primary key references auth.users(id) on delete cascade,
 revision bigint not null default 0 check (revision >= 0),
 state jsonb not null default '{"schemaVersion":1,"items":[],"borrowed":[],"subscriptions":[],"resolutions":[],"emails":[]}'::jsonb,
 updated_at timestamptz not null default now(),
 constraint mc_collection_version check (state->>'schemaVersion'='1'),
 constraint mc_collection_size check (octet_length(state::text)<=5242880)
);
create table public.mc_files (
 owner_id uuid not null references auth.users(id) on delete cascade,
 id text not null,
 path text not null unique,
 kind text not null check (kind in ('photo','document')),
 name text not null,
 mime text not null check (mime in ('image/jpeg','image/png','image/webp','application/pdf')),
 size bigint not null check (size>0 and size<=15728640),
 status text not null default 'staged' check (status in ('staged','active','deleting')),
 created_at timestamptz not null default now(),
 primary key(owner_id,id),
 constraint mc_file_path check (split_part(path,'/',1)=owner_id::text and split_part(path,'/',2)=id),
 constraint mc_photo_limits check (kind<>'photo' or (mime<>'application/pdf' and size<=10485760))
);
create index mc_files_cleanup on public.mc_files(owner_id,status,created_at);
alter table public.mc_collections enable row level security;
alter table public.mc_files enable row level security;
create policy mc_collection_owner_read on public.mc_collections for select to authenticated using(owner_id=(select auth.uid()));
create policy mc_file_owner_read on public.mc_files for select to authenticated using(owner_id=(select auth.uid()) and status='active');
revoke all on public.mc_collections,public.mc_files from anon,authenticated;
grant select on public.mc_collections,public.mc_files to authenticated;
grant all on public.mc_collections,public.mc_files to service_role;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('mis-cosas-private','mis-cosas-private',false,15728640,array['image/jpeg','image/png','image/webp','application/pdf']);
-- Upload/delete is server-only, after signature/size checks. Authenticated owners
-- can request temporary links only for active files in their own collection.
create policy mc_storage_owner_read on storage.objects for select to authenticated using(
 bucket_id='mis-cosas-private' and (storage.foldername(name))[1]=(select auth.uid())::text
 and exists(select 1 from public.mc_files f where f.owner_id=(select auth.uid()) and f.path=storage.objects.name and f.status='active')
);

create function public.mc_save_collection(p_owner uuid,p_revision bigint,p_state jsonb,p_files text[])
returns bigint language plpgsql security invoker set search_path='' as $$
declare current_revision bigint; next_revision bigint; file_id text;
begin
 if p_owner is null or p_revision<0 then raise exception 'Invalid collection'; end if;
 insert into public.mc_collections(owner_id) values(p_owner) on conflict do nothing;
 select revision into current_revision from public.mc_collections where owner_id=p_owner for update;
 if current_revision<>p_revision then raise exception 'MC_CONFLICT' using errcode='40001'; end if;
 if jsonb_typeof(p_state)<>'object' or p_state->>'schemaVersion'<>'1' then raise exception 'Invalid collection'; end if;
 foreach file_id in array p_files loop
  if not exists(select 1 from public.mc_files f where f.owner_id=p_owner and f.id=file_id and f.status in ('active','staged')) then
   raise exception 'Invalid file reference';
  end if;
 end loop;
 update public.mc_files set status='deleting' where owner_id=p_owner and status='active' and not(id=any(p_files));
 update public.mc_files set status='active' where owner_id=p_owner and id=any(p_files) and status='staged';
 update public.mc_collections set state=p_state,revision=current_revision+1,updated_at=now() where owner_id=p_owner returning revision into next_revision;
 return next_revision;
end $$;
-- Only the authenticated Edge Function may validate and commit a mutation.
-- The browser cannot bypass domain validation by calling the RPC directly.
revoke all on function public.mc_save_collection(uuid,bigint,jsonb,text[]) from public,anon,authenticated;
grant execute on function public.mc_save_collection(uuid,bigint,jsonb,text[]) to service_role;
commit;
