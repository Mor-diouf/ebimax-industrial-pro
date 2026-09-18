CREATE POLICY "Anyone can read product photos" ON storage.objects FOR SELECT USING (bucket_id = 'product-photos');
CREATE POLICY "Anyone can upload product photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-photos');
CREATE POLICY "Anyone can update product photos" ON storage.objects FOR UPDATE USING (bucket_id = 'product-photos') WITH CHECK (bucket_id = 'product-photos');
CREATE POLICY "Anyone can delete product photos" ON storage.objects FOR DELETE USING (bucket_id = 'product-photos');