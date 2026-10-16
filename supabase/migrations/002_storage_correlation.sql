alter policy mc_storage_owner_read on storage.objects using(
 bucket_id='mis-cosas-private' and (storage.foldername(name))[1]=(select auth.uid())::text
 and exists(select 1 from public.mc_files f where f.owner_id=(select auth.uid()) and f.path=storage.objects.name and f.status='active')
);
