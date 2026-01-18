import { useState, useEffect, useRef } from 'react';
import { User, MessageCircle, Heart, Bookmark, ChevronDown, ChevronUp, ArrowDown } from 'lucide-react';
import api from '../api/axios';
import cable from '../api/cable';
import { useAuth } from '../context/AuthContext';

function PostItem({ post }: { post: any }) {
    const { user } = useAuth();
    const [showComments, setShowComments] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes_count || 0);
    const [isLiked, setIsLiked] = useState(post.liked_by_current_user || false);
    const [isBookmarked, setIsBookmarked] = useState(post.bookmarked_by_current_user || false);

    // Real-time comments state
    const [comments, setComments] = useState<any[]>(post.comments || []);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasNewComments, setHasNewComments] = useState(false);

    const channelRef = useRef<any>(null);
    const commentsEndRef = useRef<HTMLDivElement>(null);
    const commentsContainerRef = useRef<HTMLDivElement>(null);
    const isUserScrolling = useRef(false);

    // Helper to detect if user is near bottom
    const isNearBottom = () => {
        if (!commentsContainerRef.current) return true;
        const { scrollTop, scrollHeight, clientHeight } = commentsContainerRef.current;
        // Allow a small buffer (e.g., 50px)
        return scrollHeight - scrollTop - clientHeight < 50;
    };

    useEffect(() => {
        // Subscribe to the channel for this post
        channelRef.current = cable.subscriptions.create(
            { channel: 'CommentsChannel', post_id: post.id },
            {
                received: (data: any) => {
                    setComments((prev) => {
                        // Dedup
                        if (prev.some(c => c.id === data.id)) return prev;
                        return [...prev, data];
                    });
                }
            }
        );

        return () => {
            if (channelRef.current) channelRef.current.unsubscribe();
        };
    }, [post.id]);

    // Smart Scrolling Effect
    useEffect(() => {
        if (!showComments) return;

        const userAtBottom = isNearBottom();
        const lastComment = comments.length > 0 ? comments[comments.length - 1] : null;
        const isMyComment = lastComment?.user?.id === user?.id;

        if (userAtBottom || isMyComment) {
            // Auto-scroll immediately
            requestAnimationFrame(() => {
                if (commentsContainerRef.current) {
                    commentsContainerRef.current.scrollTo({
                        top: commentsContainerRef.current.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            });
            setHasNewComments(false);
        } else {
            // User is scrolling up, don't force scroll, but notify
            setHasNewComments(true);
        }
    }, [comments, showComments, user?.id]);

    // Handle manual scroll to clear "New Comments" badge
    const handleScroll = () => {
        if (isNearBottom()) {
            setHasNewComments(false);
            isUserScrolling.current = false;
        } else {
            isUserScrolling.current = true;
        }
    };

    // existing handlers...
    const handleLike = async () => {
        const previousLiked = isLiked;
        const previousCount = likesCount;
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
        try {
            if (previousLiked) await api.delete(`/posts/${post.id}/likes/0`);
            else await api.post(`/posts/${post.id}/likes`);
        } catch (err) { setIsLiked(previousLiked); setLikesCount(previousCount); }
    };

    const handleBookmark = async () => {
        const previousBookmarked = isBookmarked;
        setIsBookmarked(!isBookmarked);
        try {
            if (previousBookmarked) await api.delete(`/posts/${post.id}/bookmarks/0`);
            else await api.post(`/posts/${post.id}/bookmarks`);
        } catch (err) { setIsBookmarked(previousBookmarked); }
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;
        setIsSubmitting(true);
        try {
            await api.post(`/posts/${post.id}/comments`, { comment: { content: newComment } });
            setNewComment('');
            // Force scroll to bottom on own comment
            setTimeout(() => {
                if (commentsContainerRef.current) {
                    commentsContainerRef.current.scrollTo({
                        top: commentsContainerRef.current.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        } catch (err) { console.error(err); }
        finally { setIsSubmitting(false); }
    };

    return (
        <div className={`bg-white rounded-lg shadow-sm border p-6 transition-all ${isBookmarked ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200'}`}>

            {/* Bookmarked Badge */}
            {isBookmarked && (
                <div className="flex items-center text-yellow-600 text-xs font-bold uppercase tracking-wider mb-2">
                    <Bookmark size={12} className="mr-1 fill-yellow-600" />
                    Bookmarked
                </div>
            )}

            {/* Post Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                        {post.user?.email?.[0].toUpperCase() || <User size={20} />}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{post.user?.email || 'Anonymous'}</h3>
                        <p className="text-sm text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                    </div>
                </div>

                <button
                    onClick={handleBookmark}
                    className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${isBookmarked ? 'text-yellow-600' : 'text-gray-400'}`}
                    title="Bookmark"
                >
                    <Bookmark size={20} className={isBookmarked ? 'fill-yellow-600' : ''} />
                </button>
            </div>

            <p className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</p>

            {post.hashtags && post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.hashtags.map((tag: any) => (
                        <span key={tag.id} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium cursor-pointer">#{tag.name}</span>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-6">
                    <button onClick={handleLike} className={`flex items-center space-x-2 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
                        <Heart size={20} className={isLiked ? 'fill-red-500' : ''} />
                        <span>{likesCount}</span>
                    </button>

                    <button onClick={() => setShowComments(!showComments)} className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition-colors">
                        <MessageCircle size={20} />
                        <span>{comments.length || 0}</span>
                        {showComments ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
            </div>

            {showComments && (
                <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200 relative">

                    {/* New Comments Badge */}
                    {hasNewComments && (
                        <div
                            onClick={() => {
                                if (commentsContainerRef.current) {
                                    commentsContainerRef.current.scrollTo({
                                        top: commentsContainerRef.current.scrollHeight,
                                        behavior: 'smooth'
                                    });
                                }
                            }}
                            className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white text-xs px-3 py-1 rounded-full shadow-lg cursor-pointer flex items-center gap-1 z-10 animate-bounce"
                        >
                            <ArrowDown size={12} /> New comments
                        </div>
                    )}

                    {comments.length > 0 ? (
                        <div
                            ref={commentsContainerRef}
                            onScroll={handleScroll}
                            className="space-y-4 max-h-60 overflow-y-auto mb-4 custom-scrollbar pr-2"
                        >
                            {comments.map((comment: any) => (
                                <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-semibold text-sm text-gray-900">{comment.user?.email}</span>
                                        <span className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-700 text-sm">{comment.content}</p>
                                </div>
                            ))}
                            <div ref={commentsEndRef} />
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm italic mb-4">No comments yet. Be the first to verify!</p>
                    )}

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleCommentSubmit(); }}
                            placeholder="Write a comment..."
                            disabled={isSubmitting}
                            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 disabled:bg-gray-100"
                        />
                        <button
                            onClick={handleCommentSubmit}
                            disabled={isSubmitting}
                            className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700 disabled:bg-indigo-400"
                        >
                            {isSubmitting ? '...' : 'Send'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PostItem;
