import { supabase } from "@/lib/supabase";
import * as FileSystem from 'expo-file-system';

interface UserData {
  id: string;
  email: string;
  name?: string;
  date_of_birth?: string;
  gender?: 'Woman' | 'Man' | 'Nonbinary';
  profile_picture?: string;
  tags?: string[];
  images?: string[];
}

export const getUserData = async (userId: string): Promise<{ success: boolean; msg?: string; data?: UserData }> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, date_of_birth, gender, profile_picture')  // Added profile_picture
      .eq('id', userId)
      .single();
    if (error) {
      return { success: false, msg: error?.message };
    }
    return { success: true, data: data as UserData };
  } catch(error) {
    console.error('Error fetching user data:', error);  // Changed to console.error
    return { success: false, msg: (error as Error).message };
  }     
}

export const updateUserData = async (userId: string, updateData: Partial<UserData>) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();
    if (error) {
      return { success: false, msg: error?.message };
    }
    return { success: true, data };
  } catch(error) {
    console.error('Error updating user data:', error);  // Changed to console.error
    return { success: false, msg: (error as Error).message };
  }
}

export const updateUserProfilePicture = async (
  userId: string, 
  fileUri: string, 
  fileExtension: string, 
  mimeType: string
): Promise<{ success: boolean; url?: string; msg?: string }> => {
  try {
    console.log('Updating profile picture for user:', userId);
    console.log('File extension:', fileExtension);
    console.log('MIME type:', mimeType);

    // Generate a unique file name
    const fileName = `${userId}-${Date.now()}.${fileExtension}`;
    const filePath = `${userId}/${fileName}`;

    console.log('Uploading file:', filePath);

    // Read the file as a base64 string
    const fileContent = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });

    // Upload the file to Supabase storage
    const { error: uploadError, data } = await supabase.storage
      .from('avatars')
      .upload(filePath, fileContent, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    console.log('File uploaded successfully');

    // Get the public URL of the uploaded file
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    // if (urlError) {
    //   console.error('Error getting public URL:', urlError);
    //   throw urlError;
    // }

    if (!urlData) {
      throw new Error('Failed to get public URL');
    }

    console.log('Public URL:', urlData.publicUrl);

    // Update the user's profile_picture field in the users table
    const { error: updateError } = await supabase
      .from('users')
      .update({ profile_picture: urlData.publicUrl })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating user profile:', updateError);
      throw updateError;
    }

    console.log('User profile updated successfully');

    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    console.error('Error updating profile picture:', error);
    return { success: false, msg: (error as Error).message };
  }
}

export const updateUserImages = async (
  userId: string, 
  fileUri: string, 
  fileExtension: string, 
  mimeType: string,
  index: number
): Promise<{ success: boolean; url?: string; msg?: string }> => {
  try {
    console.log(`Updating image ${index + 1} for user:`, userId);
    console.log('File extension:', fileExtension);
    console.log('MIME type:', mimeType);

    // Generate a unique file name
    const fileName = `${userId}-image-${index + 1}-${Date.now()}.${fileExtension}`;
    const filePath = `${userId}/${fileName}`;

    console.log('Uploading file:', filePath);

    // Read the file as a base64 string
    const fileContent = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });

    // Upload the file to Supabase storage
    const { error: uploadError, data } = await supabase.storage
      .from('user-images') // Use the new bucket name here
      .upload(filePath, fileContent, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    console.log('File uploaded successfully');

    // Get the public URL of the uploaded file
    const { data: urlData} = supabase.storage
      .from('user-images') // Use the new bucket name here
      .getPublicUrl(filePath);

    // if (urlError) {
    //   console.error('Error getting public URL:', urlError);
    //   throw urlError;
    // }

    if (!urlData) {
      throw new Error('Failed to get public URL');
    }

    console.log('Public URL:', urlData.publicUrl);

    return { success: true, url: urlData.publicUrl };
  } catch (error) {
    console.error(`Error updating image ${index + 1}:`, error);
    return { success: false, msg: (error as Error).message };
  }
}

export const updateUserTags = async (userId: string, tags: string[]): Promise<{ success: boolean; msg?: string }> => {
  try {
    if (tags.length < 1 || tags.length > 12) {
      throw new Error('Number of tags must be between 1 and 12');
    }

    const uniqueTags = [...new Set(tags)]; // Ensure tags are unique
    if (uniqueTags.length !== tags.length) {
      throw new Error('All tags must be unique');
    }

    const { error } = await supabase
      .from('users')
      .update({ tags: uniqueTags })
      .eq('id', userId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating user tags:', error);
    return { success: false, msg: (error as Error).message };
  }
}

