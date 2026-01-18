import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, LogIn, ChevronDown } from 'lucide-react';

function TopBar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = async () => {
        await logout();
        setIsOpen(false);
        navigate('/login');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    return (
        <header className="component-topbar h-16 bg-white border-b border-gray-200 sticky top-0 z-10 flex items-center justify-between px-6 shadow-sm">
            <div className="topbar-title text-lg font-semibold text-gray-800">
                {/* Breadcrumb or Page Title could go here */}
                Dashboard
            </div>

            <div className="topbar-user-menu relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="topbar-user-btn flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none"
                >
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                        <User size={18} />
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                        {isAuthenticated ? (user?.email || 'Account') : 'Guest'}
                    </span>
                    <ChevronDown size={14} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="topbar-dropdown absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-100 py-1 animate-in fade-in zoom-in-95 duration-100">
                        {isAuthenticated ? (
                            <>
                                <div className="px-4 py-2 border-b border-gray-100 text-xs text-gray-500 truncate">
                                    Signed in as<br />
                                    <span className="font-medium text-gray-900">{user?.email}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <LogOut size={14} />
                                    Log out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                    <LogIn size={14} />
                                    Log in
                                </Link>
                                <Link
                                    to="/signup"
                                    onClick={() => setIsOpen(false)}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                >
                                    <User size={14} />
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}

export default TopBar;
