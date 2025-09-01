import { supabase } from './customSupabaseClient';

// This file contains helper functions to set up Supabase storage
// Run these functions once to set up your storage buckets

export const setupStorageBuckets = async () => {
  try {
    // Create car-images bucket if it doesn't exist
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return;
    }

    const carImagesBucketExists = buckets.some(bucket => bucket.name === 'car-images');
    
    if (!carImagesBucketExists) {
      const { error: createError } = await supabase.storage.createBucket('car-images', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (createError) {
        console.error('Error creating car-images bucket:', createError);
      } else {
        console.log('✅ car-images bucket created successfully');
      }
    } else {
      console.log('✅ car-images bucket already exists');
    }

    // Set up RLS policies for the car-images bucket
    const { error: policyError } = await supabase.rpc('create_storage_policies');
    
    if (policyError) {
      console.log('Note: Storage policies may need to be set up manually in Supabase dashboard');
    } else {
      console.log('✅ Storage policies created successfully');
    }

  } catch (error) {
    console.error('Error setting up storage:', error);
  }
};

// Function to get public URL for uploaded images
export const getImageUrl = (filePath) => {
  const { data: { publicUrl } } = supabase.storage
    .from('car-images')
    .getPublicUrl(filePath);
  
  return publicUrl;
};

// Function to delete an image from storage
export const deleteImage = async (filePath) => {
  try {
    const { error } = await supabase.storage
      .from('car-images')
      .remove([filePath]);
    
    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};

// Function to list all images in the bucket
export const listImages = async () => {
  try {
    const { data, error } = await supabase.storage
      .from('car-images')
      .list();
    
    if (error) {
      console.error('Error listing images:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error listing images:', error);
    return [];
  }
};

// Usage instructions:
// 1. Run setupStorageBuckets() once to create the storage bucket
// 2. Use the upload functions in AdminCars.jsx or other admin components
// 3. Make sure to set up proper RLS policies in Supabase dashboard
