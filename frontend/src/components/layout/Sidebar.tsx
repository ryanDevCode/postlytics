import { Link, useLocation } from 'react-router-dom';

function Sidebar() {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-gray-600 hover:text-indigo-500 hover:bg-gray-50';
    };

    return (
        <aside className="component-sidebar-left w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col fixed left-0 top-0 z-20">
            <div className="sidebar-header p-6 border-b border-gray-200">
                <h1 className="text-2xl font-extrabold text-indigo-600 text-left">Postlytics</h1>
            </div>

            <nav className="sidebar-nav flex-1 p-4 space-y-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 text-left px-4">Menu</div>

                <Link
                    to="/dashboard"
                    className={`sidebar-link block px-4 py-3 rounded-lg text-left transition-colors ${isActive('/dashboard')}`}
                >
                    Overview
                </Link>
                <Link
                    to="/posts"
                    className={`sidebar-link block px-4 py-3 rounded-lg text-left transition-colors ${isActive('/posts') && !location.search.includes('filter=') ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-gray-600 hover:text-indigo-500 hover:bg-gray-50'}`}
                >
                    Posts
                </Link>
                <Link
                    to="/posts?filter=liked"
                    className={`sidebar-link block px-4 py-3 rounded-lg text-left transition-colors ${location.search.includes('filter=liked') ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-gray-600 hover:text-indigo-500 hover:bg-gray-50'}`}
                >
                    Liked Posts
                </Link>
                <Link
                    to="/posts?filter=bookmarked"
                    className={`sidebar-link block px-4 py-3 rounded-lg text-left transition-colors ${location.search.includes('filter=bookmarked') ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-gray-600 hover:text-indigo-500 hover:bg-gray-50'}`}
                >
                    Bookmarks
                </Link>
                <Link
                    to="/analytics"
                    className={`sidebar-link block px-4 py-3 rounded-lg text-left transition-colors ${isActive('/analytics')}`}
                    onClick={(e) => e.preventDefault()}
                >
                    Analytics (Work in Progress)
                </Link>
                <Link
                    to="/settings"
                    className={`sidebar-link block px-4 py-3 rounded-lg text-left transition-colors ${isActive('/settings')}`}
                    onClick={(e) => e.preventDefault()}
                >
                    Settings
                </Link>
            </nav>

            <div className="sidebar-footer p-4 border-t border-gray-200">
                <div className="text-xs text-center text-gray-400">
                    © 2025 Postlytics
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
