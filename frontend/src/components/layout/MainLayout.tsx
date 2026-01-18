import { useState, type ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import RightSidebar from './RightSidebar';

interface MainLayoutProps {
    children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

    return (
        <div className="layout-container flex min-h-screen w-full bg-gray-50">
            {/* Left Sidebar Fixed */}
            <div className="layout-left-sidebar-wrapper w-56 fixed left-0 h-screen z-30">
                <Sidebar />
            </div>

            {/* TopBar Fixed (Extends to right edge) */}
            <div className="layout-topbar-wrapper fixed top-0 left-56 right-0 z-40">
                <TopBar />
            </div>

            {/* Center Content */}
            <div className={`layout-main-content-wrapper flex-1 flex flex-col ml-56 pt-16 min-w-0 transition-all duration-300 ${isRightSidebarOpen ? 'xl:pr-64' : ''}`}>
                <main className="layout-main-content-area flex-1 relative w-full">
                    {children}
                </main>
            </div>

            {/* Right Sidebar Fixed */}
            {isRightSidebarOpen && (
                <div className="layout-right-sidebar-wrapper w-64 fixed right-0 top-0 h-screen z-20 hidden xl:block">
                    <RightSidebar onClose={() => setIsRightSidebarOpen(false)} />
                </div>
            )}
        </div>
    );
}

export default MainLayout;
