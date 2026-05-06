import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service';
import {
    LayoutDashboard,
    GraduationCap,
    Users,
    Calendar,
    FileText,
    LogOut,
    ChevronDown,
    Menu,
    X,
    User as UserIcon,
    Shield
} from 'lucide-react';

const MainLayout = ({ children }: { children?: React.ReactNode }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isAcademicOpen, setIsAcademicOpen] = useState(false);
    const [isRoutineOpen, setIsRoutineOpen] = useState(false);
    const [isResultsOpen, setIsResultsOpen] = useState(false);
    const [isUtilitiesOpen, setIsUtilitiesOpen] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);

    // Fetch current user
    const { data: userData, isLoading } = useQuery({
        queryKey: ['me'],
        queryFn: userService.getMe,
        retry: false,
    });



    // Decode token role synchronously to avoid setState in useEffect
    const token = localStorage.getItem('accessToken');
    let tokenRole = '';
    if (token) {
        try {
            const payloadBase64 = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(payloadBase64));
            if (decodedPayload.role) {
                tokenRole = decodedPayload.role;
            }
        } catch (error) {
            console.error("Error decoding token:", error);
        }
    }

    // Check for auth token
    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [navigate, location, token]);

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        queryClient.clear(); // Clear all cache
        navigate('/login');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };



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
                className={`bg-slate-900 text-white transition-all duration-300 ease-in-out z-30 overflow-y-auto fixed h-full
          ${isSidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full w-64 md:translate-x-0 md:w-20'} md:relative flex flex-col`}
            >
                <div className="flex items-center justify-between p-4 h-16 border-b border-slate-700 bg-slate-950">
                    {isSidebarOpen ? <span className="font-bold text-xl truncate">School Admin</span> : <span className="font-bold text-xl truncate md:block hidden">SA</span>}
                    <button onClick={toggleSidebar} className="md:hidden">
                        <X size={24} />
                    </button>
                    {/* Desktop Toggle (only when open?) - simpler to keep standard */}
                </div>

                <nav className="flex-1 py-4">
                    <ul className="space-y-1">
                        {/* Dashboard */}
                        <li>
                            <NavLink to="/dashboard" className={({ isActive }) => `flex items-center px-4 py-3 hover:bg-slate-800 transition-colors ${isActive ? 'bg-slate-800 border-l-4 border-blue-500' : ''}`}>
                                <LayoutDashboard size={20} className="min-w-[20px]" />
                                {isSidebarOpen && <span className="ml-3">Dashboard</span>}
                            </NavLink>
                        </li>

                        {/* Academic Group */}
                        <li>
                            <button
                                onClick={() => setIsAcademicOpen(!isAcademicOpen)}
                                className={`w-full flex items-center px-4 py-3 hover:bg-slate-800 transition-colors text-left focus:outline-none justify-between`}
                            >
                                <div className="flex items-center">
                                    <GraduationCap size={20} className="min-w-[20px]" />
                                    {isSidebarOpen && <span className="ml-3">Academic</span>}
                                </div>
                                {isSidebarOpen && <ChevronDown size={16} className={`transition-transform ${isAcademicOpen ? 'rotate-180' : ''}`} />}
                            </button>

                            {(isAcademicOpen || !isSidebarOpen) && (
                                <ul className={`${isSidebarOpen ? 'bg-slate-950 pl-4' : ''} ${!isSidebarOpen && 'hidden group-hover:block absolute left-20 bg-slate-900 p-2 rounded w-48 shadow-lg'}`}>
                                    {isSidebarOpen && (
                                        <>
                                            <li>
                                                <NavLink to="/academic/classes" className={({ isActive }) => `flex items-center px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 ${isActive ? 'text-white' : ''}`}>
                                                    <span className="ml-8">Classes</span>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/academic/sections" className={({ isActive }) => `flex items-center px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 ${isActive ? 'text-white' : ''}`}>
                                                    <span className="ml-8">Sections</span>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/academic/subjects" className={({ isActive }) => `flex items-center px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 ${isActive ? 'text-white' : ''}`}>
                                                    <span className="ml-8">Subjects</span>
                                                </NavLink>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            )}
                        </li>

                        {/* Admins */}
                        <li>
                            <button
                                onClick={() => setIsAdminOpen(!isAdminOpen)}
                                className={`w-full flex items-center px-4 py-3 hover:bg-slate-800 transition-colors text-left focus:outline-none justify-between`}
                            >
                                <div className="flex items-center">
                                    <Shield size={20} className="min-w-[20px]" />
                                    {isSidebarOpen && <span className="ml-3">Admins</span>}
                                </div>
                                {isSidebarOpen && <ChevronDown size={16} className={`transition-transform ${isAdminOpen ? 'rotate-180' : ''}`} />}
                            </button>

                            {(isAdminOpen || !isSidebarOpen) && (
                                <ul className={`${isSidebarOpen ? 'bg-slate-950 pl-4' : ''} ${!isSidebarOpen && 'hidden group-hover:block absolute left-20 bg-slate-900 p-2 rounded w-48 shadow-lg'}`}>
                                    {isSidebarOpen && (
                                        <>
                                            <li>
                                                <NavLink to="/create-admin" className={({ isActive }) => `flex items-center px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 ${isActive ? 'text-white' : ''}`}>
                                                    <span className="ml-8">Create Admin</span>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/admin-list" className={({ isActive }) => `flex items-center px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 ${isActive ? 'text-white' : ''}`}>
                                                    <span className="ml-8">Admins List</span>
                                                </NavLink>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            )}
                        </li>

                        {/* Students */}
                        <li>
                            <NavLink to="/students" className={({ isActive }) => `flex items-center px-4 py-3 hover:bg-slate-800 transition-colors ${isActive ? 'bg-slate-800 border-l-4 border-blue-500' : ''}`}>
                                <Users size={20} className="min-w-[20px]" />
                                {isSidebarOpen && <span className="ml-3">Students</span>}
                            </NavLink>
                        </li>
                        {/* Routine Group */}
                        <li>
                            <button
                                onClick={() => setIsRoutineOpen(!isRoutineOpen)}
                                className={`w-full flex items-center px-4 py-3 hover:bg-slate-800 transition-colors text-left focus:outline-none justify-between`}
                            >
                                <div className="flex items-center">
                                    <Calendar size={20} className="min-w-[20px]" />
                                    {isSidebarOpen && <span className="ml-3">Routine</span>}
                                </div>
                                {isSidebarOpen && <ChevronDown size={16} className={`transition-transform ${isRoutineOpen ? 'rotate-180' : ''}`} />}
                            </button>

                            {(isRoutineOpen || !isSidebarOpen) && (
                                <ul className={`${isSidebarOpen ? 'bg-slate-950 pl-4' : ''} ${!isSidebarOpen && 'hidden group-hover:block absolute left-20 bg-slate-900 p-2 rounded w-48 shadow-lg'}`}>
                                    {isSidebarOpen && (
                                        <>
                                            <li>
                                                <NavLink to="/routine" end className={({ isActive }) => `flex items-center px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 ${isActive ? 'text-white' : ''}`}>
                                                    <span className="ml-8">View Routine</span>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/routine/add" className={({ isActive }) => `flex items-center px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 ${isActive ? 'text-white' : ''}`}>
                                                    <span className="ml-8">Add Routine</span>
                                                </NavLink>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            )}
                        </li>
                        {/* Exams */}
                        <li>
                            <NavLink to="/exams" className={({ isActive }) => `flex items-center px-4 py-3 hover:bg-slate-800 transition-colors ${isActive ? 'bg-slate-800 border-l-4 border-blue-500' : ''}`}>
                                <FileText size={20} className="min-w-[20px]" />
                                {isSidebarOpen && <span className="ml-3">Exams</span>}
                            </NavLink>
                        </li>

                        {/* Results */}
                        <li>
                            <button
                                onClick={() => setIsResultsOpen(!isResultsOpen)}
                                className={`w-full flex items-center px-4 py-3 hover:bg-slate-800 transition-colors text-left focus:outline-none justify-between`}
                            >
                                <div className="flex items-center">
                                    <GraduationCap size={20} className="min-w-[20px]" />
                                    {isSidebarOpen && <span className="ml-3">Results</span>}
                                </div>
                                {isSidebarOpen && <ChevronDown size={16} className={`transition-transform ${isResultsOpen ? 'rotate-180' : ''}`} />}
                            </button>
                            {(isResultsOpen || !isSidebarOpen) && (
                                <ul className={`${isSidebarOpen ? 'bg-slate-950 pl-4' : ''} ${!isSidebarOpen && 'hidden group-hover:block absolute left-20 bg-slate-900 p-2 rounded w-48 shadow-lg'}`}>
                                    {isSidebarOpen && (
                                        <>
                                            <li>
                                                <NavLink to="/results" end className={({ isActive }) => `flex items-center px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 ${isActive ? 'text-white' : ''}`}>
                                                    <span className="ml-8">View Result</span>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/results/add" className={({ isActive }) => `flex items-center px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 ${isActive ? 'text-white' : ''}`}>
                                                    <span className="ml-8">Add Result</span>
                                                </NavLink>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            )}
                        </li>
                        {/* Utilities Group */}
                        <li>
                            <button
                                onClick={() => setIsUtilitiesOpen(!isUtilitiesOpen)}
                                className={`w-full flex items-center px-4 py-3 hover:bg-slate-800 transition-colors text-left focus:outline-none justify-between`}
                            >
                                <div className="flex items-center">
                                    <FileText size={20} className="min-w-[20px]" />
                                    {isSidebarOpen && <span className="ml-3">Utilities</span>}
                                </div>
                                {isSidebarOpen && <ChevronDown size={16} className={`transition-transform ${isUtilitiesOpen ? 'rotate-180' : ''}`} />}
                            </button>
                            {(isUtilitiesOpen || !isSidebarOpen) && (
                                <ul className={`${isSidebarOpen ? 'bg-slate-950 pl-4' : ''} ${!isSidebarOpen && 'hidden group-hover:block absolute left-20 bg-slate-900 p-2 rounded w-48 shadow-lg'}`}>
                                    {isSidebarOpen && (
                                        <>
                                            <li>
                                                <NavLink to="/notices" className={({ isActive }) => `flex items-center px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 ${isActive ? 'text-white' : ''}`}>
                                                    <span className="ml-8">Notice Board</span>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/study-guides" className={({ isActive }) => `flex items-center px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 ${isActive ? 'text-white' : ''}`}>
                                                    <span className="ml-8">Study Guide</span>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/fees" className={({ isActive }) => `flex items-center px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 ${isActive ? 'text-white' : ''}`}>
                                                    <span className="ml-8">Fee Management</span>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/leaves" className={({ isActive }) => `flex items-center px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 ${isActive ? 'text-white' : ''}`}>
                                                    <span className="ml-8">Leave Applications</span>
                                                </NavLink>
                                            </li>
                                        </>
                                    )}
                                </ul>
                            )}
                        </li>

                        {/* Profile */}
                        <li>
                            <NavLink to="/profile" className={({ isActive }) => `flex items-center px-4 py-3 hover:bg-slate-800 transition-colors ${isActive ? 'bg-slate-800 border-l-4 border-blue-500' : ''}`}>
                                <UserIcon size={20} className="min-w-[20px]" />
                                {isSidebarOpen && <span className="ml-3">Profile</span>}
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content Info */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
                    <div className="flex items-center">
                        <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                            <Menu size={24} />
                        </button>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                <UserIcon size={20} />
                            </div>
                            <div className="hidden sm:flex flex-col items-end">

                                <span className="text-gray-700 font-medium text-sm leading-none">
                                    {isLoading ? '...' : (userData?.role || tokenRole || 'USER').toUpperCase()}
                                </span>
                                {/* <span className="text-xs text-gray-500">ID: {userData?.id}</span> */}
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center text-red-500 hover:text-red-700 transition-colors ml-4"
                            title="Logout"
                        >
                            <LogOut size={20} className="mr-1" />
                            <span className="hidden sm:inline font-medium">Logout</span>
                        </button>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {children || <Outlet />}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
