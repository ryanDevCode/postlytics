import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, Heart, Bookmark, BarChart2, Settings } from 'lucide-react';

function Sidebar() {
    const location = useLocation();

    const linkBase = 'flex items-center gap-3 px-4 py-2.5 rounded-lg text-left transition-all text-sm font-medium';
    const linkActive = 'text-indigo-600 bg-indigo-50 font-semibold';
    const linkInactive = 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50';

    return (
        <aside className="component-sidebar-left w-56 bg-white border-r border-gray-200 min-h-screen flex flex-col fixed left-0 top-0 z-20">
            <div className="sidebar-header p-6 border-b border-gray-100">
                <h1 className="text-2xl font-extrabold text-indigo-600 tracking-tight">Postlytics</h1>
            </div>

            <nav className="sidebar-nav flex-1 p-4 space-y-1">
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3 px-4">Menu</div>

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
                >
                    <LayoutDashboard size={18} />
                    Overview
                </NavLink>
                <NavLink
                    to="/posts"
                    className={() => {
                        const isMainPosts = location.pathname === '/posts' && !location.search.includes('filter=');
                        return `${linkBase} ${isMainPosts ? linkActive : linkInactive}`;
                    }}
                >
                    <FileText size={18} />
                    Posts
                </NavLink>
                <NavLink
                    to="/posts?filter=liked"
                    className={() => `${linkBase} ${location.search.includes('filter=liked') ? linkActive : linkInactive}`}
                >
                    <Heart size={18} />
                    Liked Posts
                </NavLink>
                <NavLink
                    to="/posts?filter=bookmarked"
                    className={() => `${linkBase} ${location.search.includes('filter=bookmarked') ? linkActive : linkInactive}`}
                >
                    <Bookmark size={18} />
                    Bookmarks
                </NavLink>

                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-3 px-4">Insights</div>

                <NavLink
                    to="/analytics"
                    className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
                >
                    <BarChart2 size={18} />
                    Analytics
                </NavLink>
                <NavLink
                    to="/settings"
                    className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}
                >
                    <Settings size={18} />
                    Settings
                </NavLink>
            </nav>

            <div className="sidebar-footer p-4 border-t border-gray-100">
                <div className="text-xs text-center text-gray-400">
                    &copy; 2025 Postlytics
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;
