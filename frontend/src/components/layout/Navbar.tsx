import React from 'react';
import { Menu, Plus, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Link, useNavigate } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar: () => void;
  onOpenNewTransaction: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onOpenNewTransaction }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="hidden sm:inline text-xs font-medium text-slate-500">
          Welcome back, <strong className="text-slate-800">{user?.fullName || 'User'}</strong>
        </span>
      </div>

      <div className="flex items-center gap-2.5 sm:gap-3">
        <Button
          size="sm"
          onClick={onOpenNewTransaction}
          leftIcon={<Plus className="w-4 h-4" />}
          className="font-semibold shadow-sm"
        >
          <span className="hidden sm:inline">Add Transaction</span>
          <span className="sm:hidden">Add</span>
        </Button>

        <div className="h-5 w-px bg-slate-200 mx-1" />

        <Link
          to="/profile"
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          title="My Profile"
        >
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-xs border border-brand-200">
            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
          </div>
        </Link>

        <button
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          title="Log Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
