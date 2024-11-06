import { supabase } from "@/lib/supabase";
import { generateNickname } from "@/utils/nicknameGenerator";

interface CommentData {
  userId: string;
  postId: string;
  content: string;
}

export const createComment = async (commentData: CommentData): Promise<{ success: boolean; data?: any; msg?: string }> => {
  try {
    const { userId, postId, content } = commentData;

    if (!postId) {
      throw new Error('Post ID is required');
    }

    if (content.length > 500) {
      throw new Error('Comment content exceeds 500 character limit');
    }

    const nickname = generateNickname(userId, postId);

    console.log('Creating comment with data:', JSON.stringify({ ...commentData, nickname }, null, 2));

    const { data, error } = await supabase
      .from('comments')
      .insert({
        user_id: userId,
        post_id: postId,
        content: content,
        nickname: nickname,
      })
      .select(`
        id,
        user_id,
        post_id,
        content,
        created_at,
        nickname,
        user:users(name, profile_picture)
      `)
      .single();

    if (error) throw error;

    console.log('Comment created successfully:', JSON.stringify(data, null, 2));

    // Update comment count in posts table
    await supabase.rpc('increment_comment_count', { post_id: postId });

    return { success: true, data };
  } catch (error) {
    console.error('Error creating comment:', error);
    return { success: false, msg: (error as Error).message };
  }
};

export const fetchComments = async (postId: string, currentUserId: string): Promise<{ success: boolean; comments?: any[]; isPostAuthor?: boolean; msg?: string }> => {
  try {
    // First, check if the current user is the post author
    const { data: postData, error: postError } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', postId)
      .single();

    if (postError) throw postError;

    const isPostAuthor = postData.user_id === currentUserId;

    // Fetch comments
    const { data, error } = await supabase
      .from('comments')
      .select(`
        id,
        user_id,
        post_id,
        content,
        created_at,
        nickname,
        user:users(name, profile_picture)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Process comments based on privacy rules
    const processedComments = data.map(comment => {
      if (isPostAuthor || comment.user_id === currentUserId) {
        // Post author or comment author sees full details
        return comment;
      } else {
        // Other users see anonymous details
        return {
          ...comment,
          user: {
            name: comment.nickname,
            profile_picture: null
          }
        };
      }
    });

    return { success: true, comments: processedComments, isPostAuthor };
  } catch (error) {
    console.error('Error fetching comments:', error);
    return { success: false, msg: (error as Error).message };
  }
};