import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user } = useAuth();

    return (
        <header className="h-[72px] bg-white/80 backdrop-blur-md border-b border-brand-light px-6 flex items-center justify-between sticky top-0 z-30">

            {/* Search */}
            <div className="relative w-[360px]">
                <iconify-icon icon="solar:magnifer-linear"
                    class="absolute left-4 top-1/2 -translate-y-1/2 text-brand-primary text-[18px]"></iconify-icon>
                <input
                    type="text"
                    placeholder="Search transactions, recipes, or menu..."
                    className="w-full h-[42px] bg-brand-bg border border-brand-light rounded-xl pl-11 pr-4 py-2.5 text-[13px] font-semibold text-brand-dark placeholder-brand-primary/50 focus:outline-none focus:bg-white focus:ring-4 focus:ring-brand-light/50 focus:border-brand-secondary transition-all shadow-sm"
                />
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">

                {/* Notifications */}
                <Link href="/notifications" className="w-10 h-10 rounded-xl flex items-center justify-center text-brand-primary hover:bg-brand-light/50 hover:text-brand-secondary transition-all relative">
                    <iconify-icon icon="solar:bell-bing-linear" class="text-[22px]"></iconify-icon>
                    <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></span>
                </Link>

                {/* Settings */}
                <a href="#" className="w-10 h-10 rounded-xl flex items-center justify-center text-brand-primary hover:bg-brand-light/50 hover:text-brand-secondary transition-all">
                    <iconify-icon icon="solar:settings-linear" class="text-[22px]"></iconify-icon>
                </a>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-5 border-l border-brand-light ml-1">
                    <div className="text-right">
                        <p className="font-extrabold text-[13px] text-brand-dark">{user?.name}</p>
                        <p className="text-[11px] font-medium text-brand-primary">
                            {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''}
                        </p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-secondary to-brand-primary flex items-center justify-center text-white font-extrabold text-sm shadow-md shadow-brand-primary/20 border border-brand-primary">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                </div>

            </div>
        </header>
    );
}