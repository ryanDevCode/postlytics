import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { User, Clock } from 'lucide-react';

function RightSidebar() {
    const [recentPosts, setRecentPosts] = useState<any[]>([]);

    useEffect(() => {
        fetchRecentPosts();
    }, []);

    const fetchRecentPosts = async () => {
        try {
            // Just fetching standard posts for now, ideally limit to 5 via query param
            const response = await api.get('/posts');
            // Take top 5
            setRecentPosts(response.data.slice(0, 5));
        } catch (err) {
            console.error('Failed to load recent activity');
        }
    };

    return (
        <aside className="component-sidebar-right w-80 bg-white border-l border-gray-200 fixed right-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto hidden xl:block p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Latest Activity</h2>

            <div className="sidebar-activity-list space-y-4">
                {recentPosts.length === 0 ? (
                    <p className="text-sm text-gray-400">No recent activity.</p>
                ) : (
                    recentPosts.map((post) => (
                        <div key={post.id} className="sidebar-post-item border-b border-gray-100 pb-3 last:border-0 hover:bg-gray-50 p-2 rounded transition-colors cursor-pointer">
                            <div className="flex items-center space-x-2 mb-1">
                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                    <User size={12} />
                                </div>
                                <span className="text-xs font-semibold text-gray-700 truncate max-w-[150px]">
                                    {post.user?.email}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                                {post.content}
                            </p>
                            <div className="flex items-center text-xs text-gray-400">
                                <Clock size={10} className="mr-1" />
                                {new Date(post.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="sidebar-trending mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Trending</h3>
                <div className="flex flex-wrap gap-2">
                    {/* Placeholder trends */}
                    {['#ruby', '#react', '#coding'].map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </aside>
    );
}

export default RightSidebar;
