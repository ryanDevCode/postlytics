import React, { useState, useEffect } from 'react';

interface PostData {
    id: number;
    content: string;
    hashtags: string[];
    created_at: string;
    user: string;
    likes_count: number;
}

interface CommentData {
    id: number;
    content: string;
    post_id: number;
    created_at: string;
    user: string;
}

interface DashboardTablesProps {
    posts: PostData[];
    comments: CommentData[];
    loading?: boolean;
    postsMeta?: { total_pages: number };
    commentsMeta?: { total_pages: number };
}

const DashboardTables: React.FC<DashboardTablesProps> = ({
    posts: initialPosts,
    comments: initialComments,
    loading: initialLoading,
    postsMeta,
    commentsMeta
}) => {
    const [activeTab, setActiveTab] = useState<'posts' | 'comments'>('posts');
    const [isOpen, setIsOpen] = useState(true);

    // Pagination State
    const [posts, setPosts] = useState<PostData[]>([]);
    const [comments, setComments] = useState<CommentData[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Initialize with props
    useEffect(() => {
        setPosts(initialPosts);
        if (activeTab === 'posts' && postsMeta) {
            setTotalPages(postsMeta.total_pages);
        }
    }, [initialPosts, postsMeta, activeTab]);

    useEffect(() => {
        setComments(initialComments);
        if (activeTab === 'comments' && commentsMeta) {
            setTotalPages(commentsMeta.total_pages);
        }
    }, [initialComments, commentsMeta, activeTab]);

    const fetchPage = async (newPage: number) => {
        setLoading(true);
        try {
            const endpoint = activeTab === 'posts' ? '/analytics/posts' : '/analytics/comments';
            // Note: In a real app we'd need to pass current filters (startDate, endDate, hashtag) here too.
            // For now assuming the backend handles basic calls or we need to access context/props.
            // Since DashboardTables component doesn't receive filters as props currently, 
            // we will stick to basic pagination of the *global* or *user* scope based on recent changes.
            // Ideally, we should lift this state up or pass query params.
            // Assuming simple pagination for "Recent Activity" context.

            const response = await import('../../api/axios').then(m => m.default.get(endpoint, {
                params: { page: newPage, per_page: 10 }
            }));

            if (activeTab === 'posts') {
                setPosts(response.data.data);
            } else {
                setComments(response.data.data);
            }

            setTotalPages(response.data.meta.total_pages);
            setPage(newPage);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };



    // Reset page when tab changes
    useEffect(() => {
        setPage(1);
        if (activeTab === 'posts' && postsMeta) {
            setTotalPages(postsMeta.total_pages);
        } else if (activeTab === 'comments' && commentsMeta) {
            setTotalPages(commentsMeta.total_pages);
        } else {
            // Fallback or fetch if needed, but for now just wait for interaction if no meta
            // Actually, if we switched tabs we should probably fetch page 1 to ensure data consistency 
            // IF we assume initialProps are only valid for the *initial* load state.
            // But existing code uses `initialPosts` which might be stale if we don't refetch. 
            // However, to solve the "1 button" issue, using meta is key.

            // If we don't have meta, let's fetch to be safe and get the counts
            fetchPage(1);
        }
    }, [activeTab]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            fetchPage(newPage);
        }
    };

    const renderPagination = () => {
        const pages = [];
        const showEllipsisStart = page > 3;
        const showEllipsisEnd = page < totalPages - 2;

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (showEllipsisStart) pages.push('...');

            let start = Math.max(2, page - 1);
            let end = Math.min(totalPages - 1, page + 1);

            if (page <= 3) {
                end = 4; // Show 1 2 3 4 ... Last
            }
            if (page >= totalPages - 2) {
                start = totalPages - 3; // Show First ... N-3 N-2 N-1 N
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (showEllipsisEnd) pages.push('...');
            pages.push(totalPages);
        }

        return (
            <div className="flex items-center gap-1">
                {pages.map((p, idx) => (
                    typeof p === 'number' ? (
                        <button
                            key={idx}
                            onClick={() => handlePageChange(p)}
                            className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors cursor-pointer ${page === p
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {p}
                        </button>
                    ) : (
                        <span key={idx} className="w-8 h-8 flex items-center justify-center text-gray-400">...</span>
                    )
                ))}
            </div>
        );
    };

    if (initialLoading && page === 1 && posts.length === 0) {
        return <div className="animate-pulse bg-white h-64 rounded-xl border border-gray-100"></div>;
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden w-full transition-all duration-200">
            <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <div className="flex gap-4">
                    <button
                        onClick={() => setActiveTab('posts')}
                        className={`text-sm font-medium pb-1 transition-colors cursor-pointer ${activeTab === 'posts'
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Recent Posts
                    </button>
                    <button
                        onClick={() => setActiveTab('comments')}
                        className={`text-sm font-medium pb-1 transition-colors cursor-pointer ${activeTab === 'comments'
                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                            : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Recent Comments
                    </button>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-gray-400 hover:text-gray-600 focus:outline-none p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                >
                    {isOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                    )}
                </button>
            </div>

            {isOpen && (
                <div className="overflow-x-auto">
                    <div className="relative">
                        {loading && <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center"><div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>}
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-100 text-gray-900 font-medium">
                                <tr>
                                    <th className="px-4 py-3 w-12">ID</th>
                                    <th className="px-4 py-3 w-48">Content</th>
                                    <th className="px-4 py-3">{activeTab === 'posts' ? 'Hashtags' : 'Post ID'}</th>
                                    <th className="px-4 py-3">User</th>
                                    <th className="px-4 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {activeTab === 'posts' ? (
                                    posts.length > 0 ? (
                                        posts.map((post) => (
                                            <tr key={post.id} className="hover:bg-sky-100 transition-colors">
                                                <td className="px-4 py-3 font-mono text-xs w-12">{post.id}</td>
                                                <td className="px-4 py-3 w-48 max-w-[12rem] truncate overflow-hidden text-ellipsis whitespace-nowrap" title={post.content}>{post.content}</td>
                                                <td className="px-6 py-3">
                                                    <div className="flex flex-wrap gap-1">
                                                        {post.hashtags?.map(h => (
                                                            <span key={h} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                #{h}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-500">{post.user}</td>
                                                <td className="px-4 py-3 text-right text-gray-400 whitespace-nowrap">{formatDate(post.created_at)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No posts found.</td>
                                        </tr>
                                    )
                                ) : (
                                    comments.length > 0 ? (
                                        comments.map((comment) => (
                                            <tr key={comment.id} className="hover:bg-sky-100 transition-colors">
                                                <td className="px-4 py-3 font-mono text-xs w-12">{comment.id}</td>
                                                <td className="px-4 py-3 w-48 max-w-[12rem] truncate overflow-hidden text-ellipsis whitespace-nowrap" title={comment.content}>{comment.content}</td>
                                                <td className="px-4 py-3 font-mono text-xs">{comment.post_id}</td>
                                                <td className="px-4 py-3 text-gray-500">{comment.user}</td>
                                                <td className="px-4 py-3 text-right text-gray-400 whitespace-nowrap">{formatDate(comment.created_at)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No comments found.</td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1 || loading}
                            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>

                        {renderPagination()}

                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages || loading}
                            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardTables;
