import { supabase } from "@/lib/supabase";

export const getUserData = async (userId: string) => { // Specify userId type
    try{
        const { data, error } = await supabase
        .from('users')
        .select()
        .eq('id', userId)
        .single();
        if (error) {
            return {success: false, msg: error?.message};
        }
        return {success: true, data};

    } catch(error) {
        console.log('got error:', error as Error);
        return {success: false, msg: (error as Error).message};
    }
}