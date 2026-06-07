import { Outlet } from 'react-router-dom';
import Sidebar from '@/Components/Sidebar';
import Navbar from '@/Components/Navbar';
import Toast from '@/Components/Toast';

export default function AppLayout() {
    return (
        <div className="h-screen flex overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-y-auto">
                    <Outlet />  {/* ← ganti {children} dengan ini */}
                </main>
            </div>
            <Toast flash={{}} />
        </div>
    );
}