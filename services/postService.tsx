import { supabase } from "@/lib/supabase";
import * as FileSystem from 'expo-file-system';

interface PostData {
  userId: string;
  content: string;
  images?: string[];
}

export const createPost = async (postData: PostData): Promise<{ success: boolean; data?: any; msg?: string }> => {
  try {
    const { userId, content, images } = postData;

    if (content.length > 500) {
      throw new Error('Post content exceeds 500 character limit');
    }

    if (images && images.length > 5) {
      throw new Error('Maximum of 5 images allowed per post');
    }

    console.log('Creating post with data:', JSON.stringify(postData, null, 2));

    const { data, error } = await supabase
      .from('posts')
      .insert({
        user_id: userId,
        content: content,
        images: images || [],
      })
      .select();

    if (error) throw error;

    console.log('Post created successfully:', JSON.stringify(data, null, 2));

    return { success: true, data };
  } catch (error) {
    console.error('Error creating post:', error);
    return { success: false, msg: (error as Error).message };
  }
};

export const uploadImage = async (uri: string, userId: string): Promise<string> => {
  try {
    const filename = uri.split('/').pop();
    const fileExtension = filename?.split('.').pop();
    const path = `${userId}/${Date.now()}.${fileExtension}`;

    console.log('Uploading image:', path);

    const fileContent = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    const file64: any = base64ToArrayBuffer(fileContent);

    const { error: uploadError } = await supabase.storage
      .from('post-images')
      .upload(path, file64, {
        contentType: `image/${fileExtension}`,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: urlData, error: urlError } = await supabase.storage
      .from('post-images')
      .createSignedUrl(path, 3600);

    if (urlError) throw urlError;

    if (!urlData || !urlData.signedUrl) {
      throw new Error('Failed to get public URL');
    }

    console.log('Image uploaded successfully:', urlData.signedUrl);

    return urlData.signedUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

function base64ToArrayBuffer(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
}

export const fetchUserPosts = async (userId: string): Promise<{ success: boolean; posts?: any[]; msg?: string }> => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return { success: true, posts: data };
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return { success: false, msg: (error as Error).message };
  }
};

export const fetchFriendsPosts = async (userId: string): Promise<{ success: boolean; posts?: any[]; msg?: string }> => {
    try {
      // Fetch the user's accepted friends
      const { data: friends, error: friendsError } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', userId)
        .eq('status', 'accepted');
  
      if (friendsError) {
        console.warn('Error fetching friends:', friendsError.message);
        return { success: false, msg: 'Error fetching friends' };
      }
  
      if (!friends || friends.length === 0) {
        return { success: true, posts: [] };
      }
  
      const friendIds = friends.map(f => f.friend_id);
  
      // Fetch posts from friends only
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          user:users(name, profile_picture)
        `)
        .in('user_id', friendIds)
        .order('created_at', { ascending: false })
        .limit(50);
  
      if (postsError) throw postsError;
  
      return { success: true, posts };
    } catch (error) {
      console.error('Error fetching friends posts:', error);
      return { success: false, msg: (error as Error).message };
    }
  };

export const fetchAllPosts = async (): Promise<{ success: boolean; posts?: any[]; msg?: string }> => {
  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        user:users(name, profile_picture)
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    console.log('Fetched all posts:', posts);

    return { success: true, posts };
  } catch (error) {
    console.error('Error fetching all posts:', error);
    return { success: false, msg: (error as Error).message };
  }
};