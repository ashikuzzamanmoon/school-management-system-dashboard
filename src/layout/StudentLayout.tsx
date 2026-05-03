import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import {
    LayoutDashboard,
    Calendar,
    FileText,
    LogOut,
    Menu,
    X,
    User as UserIcon,
    BookOpen,
    CreditCard,
    ClipboardList
} from 'lucide-react';

const StudentLayout = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // Fetch current user
    const { data: userData } = useQuery({
        queryKey: ['me'],
        queryFn: userService.getMe,
        retry: false,
    });

    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [navigate, token]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        queryClient.clear();
        navigate('/login');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/student/routine', label: 'Class Routine', icon: <Calendar size={20} /> },
        { path: '/student/exams', label: 'Exam Schedule', icon: <ClipboardList size={20} /> },
        { path: '/student/results', label: 'Results', icon: <FileText size={20} /> },
        { path: '/student/study-guides', label: 'Daily Study Guide', icon: <BookOpen size={20} /> },
        { path: '/student/fees', label: 'Payments', icon: <CreditCard size={20} /> },
        { path: '/student/leaves', label: 'Leave Request', icon: <ClipboardList size={20} /> },
        { path: '/profile', label: 'My Profile', icon: <UserIcon size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-gray-100 relative">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`bg-indigo-900 text-white transition-all duration-300 ease-in-out z-30 overflow-y-auto fixed h-full
          ${isSidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full w-64 md:translate-x-0 md:w-20'} md:relative flex flex-col`}
            >
                <div className="flex items-center justify-between p-4 h-16 border-b border-indigo-800 bg-indigo-950">
                    {isSidebarOpen ? <span className="font-bold text-xl truncate">Student Portal</span> : <span className="font-bold text-xl truncate md:block hidden">SP</span>}
                    <button onClick={toggleSidebar} className="md:hidden">
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 py-4">
                    <ul className="space-y-1">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center px-4 py-3 hover:bg-indigo-800 transition-colors ${isActive ? 'bg-indigo-800 border-l-4 border-yellow-400 text-white' : 'text-indigo-100'}`
                                    }
                                >
                                    <div className="min-w-[20px]">{item.icon}</div>
                                    {isSidebarOpen && <span className="ml-3">{item.label}</span>}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t border-indigo-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-indigo-100 hover:bg-indigo-800 rounded transition-colors"
                    >
                        <LogOut size={20} />
                        {isSidebarOpen && <span className="ml-3">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
                    <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-semibold text-gray-800">{(userData?.student?.name || userData?.name || 'Student')}</p>
                                <p className="text-xs text-gray-500 capitalize">{userData?.role || 'Student'}</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white border-2 border-indigo-100">
                                <UserIcon size={24} />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;
