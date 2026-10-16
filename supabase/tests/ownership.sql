-- Run as postgres in the SQL editor. All rows are temporary and rolled back.
begin;
insert into auth.users(id,email) values
 ('11111111-1111-4111-8111-111111111111','account-a@example.invalid'),
 ('22222222-2222-4222-8222-222222222222','account-b@example.invalid');
insert into public.mc_collections(owner_id) values('11111111-1111-4111-8111-111111111111');
insert into public.mc_files(owner_id,id,path,kind,name,mime,size,status) values
 ('11111111-1111-4111-8111-111111111111','file-a','11111111-1111-4111-8111-111111111111/file-a/photo.jpg','photo','Demo','image/jpeg',20,'active');
insert into storage.objects(bucket_id,name) values('mis-cosas-private','11111111-1111-4111-8111-111111111111/file-a/photo.jpg'),('mis-cosas-private','11111111-1111-4111-8111-111111111111/unregistered/photo.jpg');
set local role authenticated;
select set_config('request.jwt.claims','{"sub":"22222222-2222-4222-8222-222222222222","role":"authenticated"}',true);
do $$ begin
 if exists(select 1 from public.mc_collections) then raise exception 'B can read A'; end if;
 if exists(select 1 from public.mc_files) then raise exception 'B can read file A'; end if;
 if exists(select 1 from storage.objects where bucket_id='mis-cosas-private') then raise exception 'B can read object A'; end if;
 if has_function_privilege('authenticated','public.mc_save_collection(uuid,bigint,jsonb,text[])','execute') then raise exception 'Client can bypass validation'; end if;
 if has_table_privilege('authenticated','public.mc_collections','update') then raise exception 'Client can bypass commands'; end if;
end $$;
select set_config('request.jwt.claims','{"sub":"11111111-1111-4111-8111-111111111111","role":"authenticated"}',true);
do $$ begin
 if (select count(*) from public.mc_collections)<>1 then raise exception 'A cannot read own collection'; end if;
 if (select count(*) from public.mc_files)<>1 then raise exception 'A cannot read own file'; end if;
 if (select count(*) from storage.objects where bucket_id='mis-cosas-private')<>1 then raise exception 'A file policy includes missing or unregistered object'; end if;
end $$;
reset role;
select public.mc_save_collection('11111111-1111-4111-8111-111111111111',0,'{"schemaVersion":1,"items":[],"borrowed":[],"subscriptions":[],"resolutions":[],"emails":[]}',array['file-a']);
do $$ begin
 begin
  perform public.mc_save_collection('11111111-1111-4111-8111-111111111111',0,'{"schemaVersion":1}',array['file-a']);
  raise exception 'Stale write accepted';
 exception when serialization_failure then null;
 end;
 begin
  perform public.mc_save_collection('22222222-2222-4222-8222-222222222222',0,'{"schemaVersion":1}',array['file-a']);
  raise exception 'Foreign file accepted';
 exception when raise_exception then
  if sqlerrm<>'Invalid file reference' then raise; end if;
 end;
end $$;
rollback;
select 'PASS: owner isolation, no direct mutation, no foreign file, stale writes rejected; test rows rolled back' as result;
