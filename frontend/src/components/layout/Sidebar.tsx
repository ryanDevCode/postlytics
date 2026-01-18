import { NavLink, useLocation } from 'react-router-dom';

function Sidebar() {
    const location = useLocation();

    const getLinkClass = ({ isActive }: { isActive: boolean }, isSubFilter = false) => {
        // If it's a sub-filter (like liked/bookmarked), we rely on URL search params, not just path
        if (isSubFilter) return 'text-gray-600 hover:text-indigo-500 hover:bg-gray-50';

        return isActive
            ? 'text-indigo-600 font-bold bg-indigo-50'
            : 'text-gray-600 hover:text-indigo-500 hover:bg-gray-50';
    };

    return (
        <aside className="component-sidebar-left w-56 bg-white border-r border-gray-200 min-h-screen flex flex-col fixed left-0 top-0 z-20">
            <div className="sidebar-header p-6 border-b border-gray-200">
                <h1 className="text-2xl font-extrabold text-indigo-600 text-left">Postlytics</h1>
            </div>

            <nav className="sidebar-nav flex-1 p-4 space-y-2">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 text-left px-4">Menu</div>

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `sidebar-link block px-4 py-3 rounded-lg text-left transition-colors ${getLinkClass({ isActive })}`}
                >
                    Overview
                </NavLink>
                <NavLink
                    to="/posts"
                    end // Exact match for /posts so it doesn't stay active when query params change if we want strict separation, 
                    // BUT typically /posts should be active for /posts?filter=liked. 
                    // However, user requested separation. Let's use 'end' to avoid highlighting when deep linking if desired,
                    // but actually the issue was likely generic matching.
                    // Let's manually handle the query param exclusion for the main 'Posts' link.
                    className={({ isActive }) => {
                        const isMainPosts = isActive && !location.search.includes('filter=');
                        return `sidebar-link block px-4 py-3 rounded-lg text-left transition-colors ${isMainPosts ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-gray-600 hover:text-indigo-500 hover:bg-gray-50'}`;
                    }}
                >
                    Posts
                </NavLink>
                <NavLink
                    to="/posts?filter=liked"
                    className={() => `sidebar-link block px-4 py-3 rounded-lg text-left transition-colors ${location.search.includes('filter=liked') ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-gray-600 hover:text-indigo-500 hover:bg-gray-50'}`}
                >
                    Liked Posts
                </NavLink>
                <NavLink
                    to="/posts?filter=bookmarked"
                    className={() => `sidebar-link block px-4 py-3 rounded-lg text-left transition-colors ${location.search.includes('filter=bookmarked') ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-gray-600 hover:text-indigo-500 hover:bg-gray-50'}`}
                >
                    Bookmarks
                </NavLink>
                <NavLink
                    to="/analytics"
                    className={({ isActive }) => `sidebar-link block px-4 py-3 rounded-lg text-left transition-colors ${getLinkClass({ isActive })}`}
                >
                    Analytics
                </NavLink>
                <NavLink
                    to="/settings"
                    className={({ isActive }) => `sidebar-link block px-4 py-3 rounded-lg text-left transition-colors ${getLinkClass({ isActive })}`}
                >
                    Settings
                </NavLink>
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
