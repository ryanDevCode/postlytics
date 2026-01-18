import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import CreatePostForm from '../components/CreatePostForm';
import PostItem from '../components/PostItem';
import HashtagSearch from '../components/HashtagSearch';

function PostsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [availableHashtags, setAvailableHashtags] = useState<string[]>([]);

    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const selectedHashtag = searchParams.get('hashtag');
    const filter = searchParams.get('filter');

    const fetchTags = async () => {
        try {
            const res = await api.get('/analytics');
            const tags = res.data.top_hashtags.map((t: any) => t.name);
            setAvailableHashtags(tags);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchPosts = async (pageNum: number, isNewFilter = false) => {
        try {
            if (pageNum === 1) setLoading(true);
            else setIsFetchingMore(true);

            const params: any = { page: pageNum, per_page: 15 };
            if (selectedHashtag) params.hashtag = selectedHashtag;
            if (filter) params.filter = filter;

            const response = await api.get('/posts', { params });
            const newPosts = response.data;

            if (isNewFilter) {
                setPosts(newPosts);
            } else {
                setPosts(prev => [...prev, ...newPosts]);
            }

            setHasMore(newPosts.length === 15);
        } catch (err) {
            console.error('Failed to fetch posts:', err);
            setError('Failed to load posts.');
        } finally {
            setLoading(false);
            setIsFetchingMore(false);
        }
    };

    // Reset when filters change
    useEffect(() => {
        setPage(1);
        setPosts([]);
        setHasMore(true);
        fetchPosts(1, true);
        fetchTags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // Infinite scroll listener
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 100 >=
                document.documentElement.offsetHeight &&
                !loading &&
                !isFetchingMore &&
                hasMore
            ) {
                setPage(prev => {
                    const nextPage = prev + 1;
                    fetchPosts(nextPage);
                    return nextPage;
                });
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, isFetchingMore, hasMore]);

    const handlePostCreated = (newPost: any) => {
        setPosts([newPost, ...posts]);
    };

    const handleSearch = (tag: string) => {
        setSearchParams({ hashtag: tag });
    };

    const clearFilter = () => {
        setSearchParams({});
    };

    const getPageTitle = () => {
        if (filter === 'liked') return 'Liked Posts';
        if (filter === 'bookmarked') return 'My Bookmarks';
        return 'Posts';
    };

    return (
        <div className="page-posts w-full">
            <div className="posts-header flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="page-title text-3xl font-bold text-gray-900">{getPageTitle()}</h1>
                <HashtagSearch onSearch={handleSearch} availableHashtags={availableHashtags} />
            </div>

            {selectedHashtag && (
                <div className="posts-filter-info mb-6 flex items-center gap-2">
                    <span className="text-gray-600">Filtering by: <span className="font-bold">#{selectedHashtag}</span></span>
                    <button onClick={clearFilter} className="text-sm text-indigo-600 hover:text-indigo-800 underline">Clear filter</button>
                </div>
            )}

            <div className="posts-layout-grid grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="posts-feed lg:col-span-2 space-y-6">
                    <CreatePostForm onPostCreated={handlePostCreated} />

                    {loading ? (
                        <div className="loading-state text-center py-4">Loading...</div>
                    ) : error ? (
                        <div className="error-state text-center text-red-500 py-4">{error}</div>
                    ) : (
                        <div className="posts-list space-y-4">
                            {posts.length === 0 ? (
                                <div className="empty-state text-center text-gray-500 py-8">No posts found.</div>
                            ) : (
                                <>
                                    {posts.map((post) => (
                                        <PostItem key={post.id} post={post} />
                                    ))}
                                    {isFetchingMore && (
                                        <div className="text-center py-4 text-gray-500 text-sm">
                                            Loading more posts...
                                        </div>
                                    )}
                                    {!hasMore && posts.length > 0 && (
                                        <div className="text-center py-4 text-gray-400 text-xs">
                                            You've reached the end of the feed.
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="posts-sidebar hidden lg:block">
                    <div className="widget-info bg-white p-4 rounded shadow">
                        <h3 className="font-semibold text-gray-700 mb-2">Did you know?</h3>
                        <p className="text-sm text-gray-500">You can use markdown in your posts!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostsPage;
