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
  facts?: string[];
  highlightBio?: string;
  looking_for?: string;
  likes?: string;
  dislikes?: string;
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
  } catch (error) {
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
  } catch (error) {
    console.error('Error updating user data:', error);  // Changed to console.error
    return { success: false, msg: (error as Error).message };
  }
}

function base64ToArrayBuffer(base64: any) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
}

export const fetchUserProfile = async (userId: string): Promise<{ success: boolean; data?: Partial<UserData>; msg?: string }> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('name, profile_picture, highlight_bio, looking_for, likes, dislikes')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { success: false, msg: (error as Error).message };
  }
};

//dont need this for now
export const fetchThreads = async (): Promise<{ success: boolean; data?: any[]; msg?: string }> => {
  try {
    const { data, error } = await supabase
      .from('threads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching threads:', error);
    return { success: false, msg: (error as Error).message };
  }
};

//profile pic 
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

    console.log('Uploading file:', fileName);

    // Read the file as a base64 string
    const fileContent = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
    const file64: any = base64ToArrayBuffer(fileContent);


    // Upload the file to Supabase storage
    const { error: uploadError, data } = await supabase.storage
      .from('avatars')
      .upload(filePath, file64, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }

    console.log('File uploaded successfully',);

    // Get the public URL of the uploaded file
    const { data: urlData } = await supabase.storage
      .from('avatars')
      .createSignedUrl(filePath, 3600);

    // if (urlError) {
    //   console.error('Error getting public URL:', urlError);
    //   throw urlError;
    // }

    if (!urlData) {
      throw new Error('Failed to get public URL');
    }

    console.log('Public URL:', urlData);

    // Update the user's profile_picture field in the users table
    const { error: updateError } = await supabase
      .from('users')
      .update({ profile_picture: urlData.signedUrl })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating user profile:', updateError);
      throw updateError;
    }

    console.log('User profile updated successfully');

    return { success: true, url: urlData.signedUrl };
  } catch (error) {
    console.error('Error updating profile picture:', error);
    return { success: false, msg: (error as Error).message };
  }
}

//multiple image
export const updateUserImages = async (
  userId: string,
  images: { uri: string; fileExtension: string; mimeType: string }[]
): Promise<{ success: boolean; urls?: string[]; msg?: string }> => {
  try {
    console.log('Updating images for user:', userId);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const { uri, fileExtension, mimeType } = images[i];
      console.log(`Processing image ${i + 1}:`);
      console.log('File extension:', fileExtension);
      console.log('MIME type:', mimeType);

      // Generate a unique file name
      const fileName = `${userId}-image-${i + 1}-${Date.now()}.${fileExtension}`;
      const filePath = `${userId}/${fileName}`;

      console.log('Uploading file:', fileName);

      // Read the file as a base64 string
      const fileContent = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      const file64: any = base64ToArrayBuffer(fileContent);

      // Upload the file to Supabase storage
      const { error: uploadError, data } = await supabase.storage
        .from('user-images')
        .upload(filePath, file64, {
          contentType: mimeType,
          upsert: true,
        });

      if (uploadError) {
        console.error(`Upload error for image ${i + 1}:`, uploadError);
        continue;
      }

      console.log(`File ${i + 1} uploaded successfully`);

      // Get the public URL of the uploaded file
      const { data: urlData } = await supabase.storage
        .from('user-images')
        .createSignedUrl(filePath, 3600);

      if (!urlData) {
        console.error(`Failed to get public URL for image ${i + 1}`);
        continue;
      }

      console.log(`Public URL for image ${i + 1}:`, urlData.signedUrl);
      uploadedUrls.push(urlData.signedUrl);
    }

    if (uploadedUrls.length > 0) {
      // Update the user's images field in the users table
      const { error: updateError } = await supabase
        .from('users')
        .update({ images: uploadedUrls })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating user images:', updateError);
        throw updateError;
      }

      console.log('User images updated successfully');
    } else {
      console.log('No images were successfully uploaded');
    }

    return { success: true, urls: uploadedUrls };
  } catch (error) {
    console.error('Error updating user images:', error);
    return { success: false, msg: (error as Error).message };
  }
};


export const fetchUserImages = async (userId: string): Promise<{ success: boolean; urls?: string[]; msg?: string }> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('images')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return { success: true, urls: data?.images || [] };
  } catch (error) {
    console.error('Error fetching user images:', error);
    return { success: false, msg: (error as Error).message };
  }
};

//tags
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

export const fetchUserTags = async (userId: string): Promise<{ success: boolean; tags?: string[]; msg?: string }> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('tags')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return { success: true, tags: data?.tags || [] };
  } catch (error) {
    console.error('Error fetching user tags:', error);
    return { success: false, msg: (error as Error).message };
  }
};

//facts
export const fetchUserFacts = async (userId: string): Promise<{ success: boolean; facts?: string[]; msg?: string }> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('facts')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return { success: true, facts: data?.facts || [] };
  } catch (error) {
    console.error('Error fetching user facts:', error);
    return { success: false, msg: (error as Error).message };
  }
};

//facts
export const updateUserFacts = async (userId: string, facts: string[]): Promise<{ success: boolean; msg?: string }> => {
  try {
    if (facts.length > 3) {
      throw new Error('Maximum of 3 facts allowed');
    }

    if (facts.some(fact => fact.length > 100)) {
      throw new Error('Each fact must be 100 characters or less');
    }

    const { error } = await supabase
      .from('users')
      .update({ facts })
      .eq('id', userId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating user facts:', error);
    return { success: false, msg: (error as Error).message };
  }
};

//bio
export const fetchUserHighlightBio = async (userId: string): Promise<{ success: boolean; highlightBio?: string; msg?: string }> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('highlight_bio')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    return { success: true, highlightBio: data?.highlight_bio || '' };
  } catch (error) {
    console.error('Error fetching user highlight bio:', error);
    return { success: false, msg: (error as Error).message };
  }
};

//bio
export const updateUserHighlightBio = async (userId: string, highlightBio: string): Promise<{ success: boolean; msg?: string }> => {
  try {
    const trimmedBio = highlightBio.trim();

    if (!trimmedBio) {
      throw new Error('Highlight bio cannot be empty');
    }

    if (trimmedBio.length > 50) {
      throw new Error('Highlight bio must be 50 characters or less');
    }

    const { error } = await supabase
      .from('users')
      .update({ highlight_bio: trimmedBio })
      .eq('id', userId);

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating user highlight bio:', error);
    return { success: false, msg: (error as Error).message };
  }
};
