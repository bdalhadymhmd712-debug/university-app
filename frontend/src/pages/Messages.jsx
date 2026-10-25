import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import axios from 'axios';
import {
  Send, Heart, MessageCircle, Trash2, Sparkles
} from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function Messages() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [category, setCategory] = useState('عام');
  const [commentText, setCommentText] = useState({});
  const [openComments, setOpenComments] = useState({});
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    setLoading(true);
    axios.get(`${API}/api/posts`)
      .then(res => setPosts(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setPosting(true);
    try {
      const res = await axios.post(`${API}/api/posts`, { text, category });
      setPosts([res.data, ...posts]);
      setText('');
      setCategory('عام');
    } catch (err) {
      console.error(err);
    } finally {
      setPosting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await axios.put(`${API}/api/posts/${postId}/like`);
      setPosts(posts.map(p => p._id === postId ? res.data : p));
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (postId) => {
    const t = commentText[postId];
    if (!t || !t.trim()) return;
    try {
      const res = await axios.post(`${API}/api/posts/${postId}/comment`, { text: t });
      setPosts(posts.map(p => p._id === postId ? res.data : p));
      setCommentText({ ...commentText, [postId]: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('هل أنت متأكد من حذف المنشور؟')) return;
    try {
      await axios.delete(`${API}/api/posts/${postId}`);
      setPosts(posts.filter(p => p._id !== postId));
    } catch (err) {
      console.error(err);
    }
  };

  const categoryColor = (c) => {
    if (c === 'دراسي') return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    if (c === 'سؤال') return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    if (c === 'أنشطة') return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    if (c === 'إعلان') return 'bg-red-500/20 text-red-400 border-red-500/30';
    return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  };

  return (
    <Layout title="💬 التواصل" subtitle="شارك أفكارك وتواصل مع زملائك">
      <form onSubmit={handlePost} className="glass rounded-2xl p-5 mb-6 animate-slide-up">
        <div className="flex gap-3 mb-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shrink-0">
            {user?.name?.charAt(0) || '؟'}
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="شارك فكرة أو سؤالاً مع زملائك..."
            rows="3"
            className="flex-1 p-3 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div className="flex gap-2 flex-wrap">
            {['عام', 'دراسي', 'سؤال', 'أنشطة'].map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs transition ${
                  category === c
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-700/40 hover:bg-slate-700/60'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={posting || !text.trim()}
            className="px-6 py-2 rounded-xl bg-gradient-to-l from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-500/30 transition disabled:opacity-50 flex items-center gap-2"
          >
            <Send size={16} />
            {posting ? 'جاري النشر...' : 'نشر'}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center text-xl p-10 animate-pulse">جاري التحميل...</div>
      ) : posts.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <Sparkles size={48} className="mx-auto opacity-30 mb-3" />
          <p className="text-xl mb-2">لا توجد منشورات</p>
          <p className="opacity-60 text-sm">كن أول من ينشر!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {posts.map((post) => {
            const liked = post.likes?.some(id => id === user?.id || id._id === user?.id);
            const isOwner = post.author === user?.id || post.author?._id === user?.id;

            return (
              <div key={post._id} className="glass rounded-2xl p-5 animate-slide-up">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">
                      {post.authorName?.charAt(0) || '؟'}
                    </div>
                    <div>
                      <div className="font-bold">{post.authorName}</div>
                      <div className="text-xs opacity-60">
                        {post.authorLevel} • {new Date(post.createdAt).toLocaleString('ar-EG')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs border ${categoryColor(post.category)}`}>
                      {post.category}
                    </span>
                    {isOwner && (
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <p className="mb-4 leading-relaxed whitespace-pre-wrap">{post.text}</p>

                <div className="flex items-center gap-4 pt-3 border-t border-slate-700/50">
                  <button
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
                      liked ? 'text-red-400 bg-red-500/10' : 'opacity-70 hover:opacity-100 hover:bg-slate-700/40'
                    }`}
                  >
                    <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
                    <span className="text-sm">{post.likes?.length || 0}</span>
                  </button>

                  <button
                    onClick={() => setOpenComments({ ...openComments, [post._id]: !openComments[post._id] })}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg opacity-70 hover:opacity-100 hover:bg-slate-700/40 transition"
                  >
                    <MessageCircle size={18} />
                    <span className="text-sm">{post.comments?.length || 0}</span>
                  </button>
                </div>

                {openComments[post._id] && (
                  <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-3">
                    {post.comments?.map((c, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                          {c.authorName?.charAt(0) || '؟'}
                        </div>
                        <div className="flex-1 bg-slate-800/40 rounded-xl p-3">
                          <div className="text-sm font-bold mb-1">{c.authorName}</div>
                          <div className="text-sm opacity-90">{c.text}</div>
                          <div className="text-xs opacity-50 mt-1">
                            {new Date(c.createdAt).toLocaleString('ar-EG')}
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={commentText[post._id] || ''}
                        onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
                        onKeyPress={(e) => e.key === 'Enter' && handleComment(post._id)}
                        placeholder="اكتب تعليقًا..."
                        className="flex-1 p-2.5 bg-slate-800/50 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-sm"
                      />
                      <button
                        onClick={() => handleComment(post._id)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition"
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}