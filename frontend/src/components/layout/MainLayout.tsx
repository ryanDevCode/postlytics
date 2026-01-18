import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import RightSidebar from './RightSidebar';

interface MainLayoutProps {
    children: ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="layout-container flex min-h-screen bg-gray-50">
            {/* Left Sidebar Fixed */}
            <div className="layout-left-sidebar-wrapper w-64 fixed left-0 h-screen z-30">
                <Sidebar />
            </div>

            {/* TopBar Fixed (Extends to right edge) */}
            <div className="layout-topbar-wrapper fixed top-0 left-64 right-0 z-40">
                <TopBar />
            </div>

            {/* Center Content */}
            {/* Removed xl:mr-80 to allow full width as requested previously */}
            <div className="layout-main-content-wrapper flex-1 flex flex-col ml-64 pt-16 transition-all duration-300">
                <main className="layout-main-content-area flex-1 p-6 relative">
                    {children}
                </main>
            </div>

            {/* Right Sidebar Fixed */}
            <div className="layout-right-sidebar-wrapper w-80 fixed right-0 top-0 h-screen z-20 hidden xl:block">
                <RightSidebar />
            </div>
        </div>
    );
}

export default MainLayout;
