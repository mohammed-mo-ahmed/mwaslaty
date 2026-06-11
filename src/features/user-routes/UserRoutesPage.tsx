'use client';

import Link from 'next/link';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {MessageSquare, Pencil, Plus, Search, Send, Trash2, User, X} from 'lucide-react';
import {useTranslations} from 'next-intl';
import {useAuth} from '@/shared/auth/AuthProvider';
import {useRequireAuth} from '@/shared/auth/useRequireAuth';

type ForumPost = {
  id: number;
  user_id: string;
  title: string;
  body: string;
  author_name: string;
  created_at: string;
  replyCount: number;
};

type ForumReply = {
  id: number;
  user_id: string;
  post_id: number;
  body: string;
  author_name: string;
  created_at: string;
};

function timeAgo(dateStr: string, locale: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (locale === 'ar') {
    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    return new Date(dateStr).toLocaleDateString('ar-EG');
  }

  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export function UserRoutesPage() {
  const t = useTranslations('userRoutes');
  const common = useTranslations('common');
  const {isAuthenticated, user} = useAuth();
  const {requireAuth} = useRequireAuth();
  const locale = (typeof window !== 'undefined' && window.location.pathname.startsWith('/ar')) ? 'ar' : 'en';

  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAskForm, setShowAskForm] = useState(false);
  const [newPost, setNewPost] = useState({title: '', body: ''});
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingPost, setEditingPost] = useState<{title: string; body: string} | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<number | null>(null);
  const [editReplyText, setEditReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(
      post =>
        post.title.toLowerCase().includes(q) ||
        post.body.toLowerCase().includes(q)
    );
  }, [posts, searchQuery]);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/forum/posts');
      const data = await res.json();
      if (data.posts) setPosts(data.posts);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) fetchPosts();
    else setLoading(false);
  }, [fetchPosts, isAuthenticated]);

  const openPost = async (post: ForumPost) => {
    setSelectedPost(post);
    setReplies([]);
    setEditingPost(null);
    setEditingReplyId(null);
    try {
      const res = await fetch(`/api/forum/posts/${post.id}`);
      const data = await res.json();
      if (data.replies) setReplies(data.replies);
    } catch {}
  };

  const closePost = () => {
    setSelectedPost(null);
    setReplies([]);
    setEditingPost(null);
    setEditingReplyId(null);
  };

  const handleCreatePost = async () => {
    if (!user) {
      requireAuth(() => {});
      return;
    }
    if (submitting || !newPost.title.trim() || !newPost.body.trim()) return;
    setSubmitting(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPost),
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(prev => [data.post, ...prev]);
        setNewPost({title: '', body: ''});
        setShowAskForm(false);
      }
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditPost = async () => {
    if (!user) {
      requireAuth(() => {});
      return;
    }
    if (!selectedPost || !editingPost || submitting) return;
    setSubmitting(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/forum/posts/${selectedPost.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingPost),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedPost(prev => prev ? {...prev, ...data.post} : null);
        setPosts(prev => prev.map(p => p.id === selectedPost.id ? {...p, ...data.post} : p));
        setEditingPost(null);
      }
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePost = async () => {
    if (!user) {
      requireAuth(() => {});
      return;
    }
    if (!selectedPost || submitting) return;
    if (!confirm(locale === 'ar' ? 'هل أنت متأكد من حذف هذا السؤال؟' : 'Are you sure you want to delete this question?')) return;
    setSubmitting(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/forum/posts/${selectedPost.id}`, {
        method: 'DELETE',
        headers: {Authorization: `Bearer ${token}`},
      });
      if (res.ok) {
        setPosts(prev => prev.filter(p => p.id !== selectedPost.id));
        closePost();
      }
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async () => {
    if (!user) {
      requireAuth(() => {});
      return;
    }
    if (!selectedPost || submitting || !replyText.trim()) return;
    setSubmitting(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/forum/posts/${selectedPost.id}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({body: replyText}),
      });
      if (res.ok) {
        const data = await res.json();
        setReplies(prev => [...prev, data.reply]);
        setPosts(prev =>
          prev.map(p => (p.id === selectedPost.id ? {...p, replyCount: p.replyCount + 1} : p))
        );
        setReplyText('');
      }
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const startEditReply = (reply: ForumReply) => {
    setEditingReplyId(reply.id);
    setEditReplyText(reply.body);
  };

  const handleEditReply = async () => {
    if (!user) {
      requireAuth(() => {});
      return;
    }
    if (editingReplyId === null || submitting || !editReplyText.trim()) return;
    setSubmitting(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/forum/replies/${editingReplyId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({body: editReplyText}),
      });
      if (res.ok) {
        const data = await res.json();
        setReplies(prev => prev.map(r => r.id === editingReplyId ? {...r, ...data.reply} : r));
        setEditingReplyId(null);
        setEditReplyText('');
      }
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReply = async (replyId: number) => {
    if (!user) {
      requireAuth(() => {});
      return;
    }
    if (submitting) return;
    if (!confirm(locale === 'ar' ? 'هل أنت متأكد من حذف هذا الرد؟' : 'Are you sure you want to delete this reply?')) return;
    setSubmitting(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch(`/api/forum/replies/${replyId}`, {
        method: 'DELETE',
        headers: {Authorization: `Bearer ${token}`},
      });
      if (res.ok) {
        setReplies(prev => prev.filter(r => r.id !== replyId));
        setPosts(prev =>
          prev.map(p => (p.id === selectedPost?.id ? {...p, replyCount: Math.max(0, p.replyCount - 1)} : p))
        );
      }
    } catch {
    } finally {
      setSubmitting(false);
    }
  };

  if (selectedPost) {
    const isOwner = user && selectedPost.user_id === user.uid;

    return (
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={closePost}
          className="mb-4 text-sm text-amber-700 hover:text-amber-800"
        >
          ← {t('backToForum')}
        </button>

        <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-100">
          {editingPost ? (
            <div className="space-y-3">
              <input
                value={editingPost.title}
                onChange={(e) => setEditingPost({...editingPost, title: e.target.value})}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-xl font-bold outline-none focus:border-amber-400"
              />
              <textarea
                rows={5}
                value={editingPost.body}
                onChange={(e) => setEditingPost({...editingPost, body: e.target.value})}
                className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-amber-400"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleEditPost}
                  disabled={submitting || !editingPost.title.trim() || !editingPost.body.trim()}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? t('saving') : common('submit')}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  {common('cancel')}
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-950">{selectedPost.title}</h1>
              <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5" />
                  {selectedPost.author_name}
                </span>
                <span>{timeAgo(selectedPost.created_at, locale)}</span>
                {isOwner && (
                  <span className="ml-auto flex gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingPost({title: selectedPost.title, body: selectedPost.body})}
                      className="flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-100 hover:text-amber-700"
                    >
                      <Pencil className="h-3 w-3" />
                      {t('edit')}
                    </button>
                    <button
                      type="button"
                      onClick={handleDeletePost}
                      disabled={submitting}
                      className="flex items-center gap-1 rounded px-2 py-1 text-xs text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                      {t('delete')}
                    </button>
                  </span>
                )}
              </div>
              <p className="mt-4 whitespace-pre-wrap text-gray-800 leading-relaxed">{selectedPost.body}</p>
            </>
          )}
        </div>

        <div className="mt-6">
          <h2 className="mb-4 text-lg font-bold text-gray-950">
            {t('replies')} ({replies.length})
          </h2>

          {replies.length === 0 ? (
            <p className="text-sm text-gray-500">{t('noReplies')}</p>
          ) : (
            <div className="space-y-3">
              {replies.map((reply) => {
                const isReplyOwner = user && reply.user_id === user.uid;
                const isEditing = editingReplyId === reply.id;

                return (
                  <div key={reply.id} className="rounded-lg bg-gray-50 p-4 ring-1 ring-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="h-3.5 w-3.5" />
                      <span className="font-medium text-gray-700">{reply.author_name}</span>
                      <span>{timeAgo(reply.created_at, locale)}</span>
                      {isReplyOwner && !isEditing && (
                        <span className="ml-auto flex gap-2">
                          <button
                            type="button"
                            onClick={() => startEditReply(reply)}
                            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-gray-500 hover:bg-gray-200 hover:text-amber-700"
                          >
                            <Pencil className="h-3 w-3" />
                            {t('edit')}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteReply(reply.id)}
                            disabled={submitting}
                            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-red-500 hover:bg-red-100"
                          >
                            <Trash2 className="h-3 w-3" />
                            {t('delete')}
                          </button>
                        </span>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="mt-2 space-y-2">
                        <textarea
                          rows={3}
                          value={editReplyText}
                          onChange={(e) => setEditReplyText(e.target.value)}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:border-amber-400"
                        />
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleEditReply}
                            disabled={submitting || !editReplyText.trim()}
                            className="rounded-md bg-blue-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                          >
                            {submitting ? t('saving') : common('submit')}
                          </button>
                          <button
                            type="button"
                            onClick={() => { setEditingReplyId(null); setEditReplyText(''); }}
                            className="rounded-md border border-gray-300 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            {common('cancel')}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 whitespace-pre-wrap text-gray-800">{reply.body}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

            <div className="mt-6">
              <textarea
                rows={3}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={t('replyPlaceholder')}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleReply}
                disabled={submitting || !replyText.trim()}
                className="mt-3 inline-flex items-center gap-2 rounded-md bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {common('submit')}
              </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-950">{t('title')}</h1>
        <p className="mt-2 text-gray-600">{t('subtitle')}</p>
      </div>

      {isAuthenticated ? (
        <>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full rounded-md border border-gray-300 py-3 pe-4 ps-10 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowAskForm(true)}
              className="inline-flex shrink-0 items-center justify-center rounded-md bg-amber-600 px-5 py-3 font-semibold text-white hover:bg-amber-700"
            >
              <Plus className="me-2 h-5 w-5" />
              {t('askQuestion')}
            </button>
          </div>

          {showAskForm ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-950">{t('askQuestion')}</h2>
                  <button
                    type="button"
                    onClick={() => setShowAskForm(false)}
                    className="rounded-md p-2 hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    {t('questionTitle')}
                    <input
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      placeholder={t('titlePlaceholder')}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-amber-400"
                    />
                  </label>
                  <label className="block text-sm font-medium text-gray-700">
                    {t('questionBody')}
                    <textarea
                      rows={5}
                      value={newPost.body}
                      onChange={(e) => setNewPost({...newPost, body: e.target.value})}
                      placeholder={t('bodyPlaceholder')}
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-amber-400"
                    />
                  </label>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAskForm(false)}
                      className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      {common('cancel')}
                    </button>
                    <button
                      type="button"
                      onClick={handleCreatePost}
                      disabled={submitting || !newPost.title.trim() || !newPost.body.trim()}
                      className="flex-1 rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {submitting ? t('posting') : common('submit')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-200 border-t-amber-600" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="rounded-lg bg-white p-12 text-center shadow-sm ring-1 ring-gray-100">
              <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <h3 className="text-lg font-semibold text-gray-950">
                {posts.length === 0 ? t('emptyTitle') : t('noSearchResults')}
              </h3>
              <p className="mt-2 text-gray-600">
                {posts.length === 0 ? t('emptyText') : t('noSearchResultsText')}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPosts.map((post) => (
                <button
                  type="button"
                  key={post.id}
                  onClick={() => openPost(post)}
                  className="w-full rounded-lg bg-white p-5 text-start shadow-sm ring-1 ring-gray-100 transition hover:ring-2 hover:ring-amber-300"
                >
                  <h3 className="text-lg font-semibold text-gray-950">{post.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                    {post.body}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author_name}
                    </span>
                    <span>{timeAgo(post.created_at, locale)}</span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {post.replyCount} {post.replyCount === 1 ? t('reply') : t('replies')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="rounded-lg bg-amber-600 p-8 text-center text-white">
          <h2 className="text-2xl font-bold">{t('loginRequired')}</h2>
          <p className="mt-2">{t('loginRequiredText')}</p>
          <Link
            href={`/${locale}/signup`}
            className="mt-5 inline-flex items-center rounded-md bg-white px-5 py-3 font-semibold text-amber-700 hover:bg-gray-100"
          >
            {t('signupNow')}
          </Link>
        </div>
      )}
    </div>
  );
}
