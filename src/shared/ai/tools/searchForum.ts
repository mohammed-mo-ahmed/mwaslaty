import { getSupabase } from '@/shared/supabase/client';

type PostRow = {
  id: number;
  title: string;
  body: string;
  author_name: string;
  created_at: string;
};

type ReplyRow = {
  post_id: number;
  body: string;
  author_name: string;
  created_at: string;
};

export async function searchForum(query: string): Promise<{ text: string }> {
  try {
    const supabase = getSupabase();
    if (!supabase) return { text: 'قاعدة البيانات غير متصلة حالياً.' };

    const searchTerm = `%${query.trim()}%`;

    const { data: posts, error: postsError } = await supabase
      .from('forum_posts')
      .select('id, title, body, author_name, created_at')
      .or(`title.ilike.${searchTerm},body.ilike.${searchTerm}`)
      .order('created_at', { ascending: false })
      .limit(5);

    if (postsError) {
      console.error('[searchForum] posts error:', postsError.message);
      return { text: 'عذراً، حدث خطأ أثناء البحث في المنتدى.' };
    }

    const { data: replies, error: repliesError } = await supabase
      .from('forum_replies')
      .select('post_id, body, author_name, created_at')
      .ilike('body', searchTerm)
      .order('created_at', { ascending: false })
      .limit(5);

    if (repliesError) {
      console.error('[searchForum] replies error:', repliesError.message);
    }

    const results: string[] = [];
    const typedPosts = (posts ?? []) as PostRow[];
    const typedReplies = (replies ?? []) as ReplyRow[];

    if (typedPosts.length) {
      results.push('--- أسئلة ذات صلة في المنتدى ---');
      for (const p of typedPosts) {
        results.push(`❓ سؤال: ${p.title}\n📝 ${p.body.slice(0, 200)}${p.body.length > 200 ? '...' : ''}\n👤 ${p.author_name} | ${new Date(p.created_at).toLocaleDateString('ar-EG')}`);
      }
    }

    if (typedReplies.length) {
      if (typedPosts.length) results.push('');
      results.push('--- إجابات ذات صلة في المنتدى ---');
      for (const r of typedReplies) {
        results.push(`💬 ${r.body.slice(0, 200)}${r.body.length > 200 ? '...' : ''}\n👤 ${r.author_name} | ${new Date(r.created_at).toLocaleDateString('ar-EG')}`);
      }
    }

    if (results.length === 0) {
      return { text: 'ما لقيتش نتائج في المنتدى عن "' + query + '".' };
    }

    results.push('\n(يمكنك مشاركة تجربتك بإضافة سؤال أو رد في قسم "منتدى المجتمع" بالموقع)');
    return { text: results.join('\n\n') };
  } catch (err) {
    console.error('[searchForum] exception:', err);
    return { text: 'عذراً، حدث خطأ أثناء البحث في المنتدى.' };
  }
}
