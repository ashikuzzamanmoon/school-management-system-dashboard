import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Users, School, Bell, CalendarClock, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { userService } from '../../services/user.service';
import { academicService } from '../../services/academic.service';
import { noticeService } from '../../services/utility.service';
import { leaveService } from '../../services/leave.service';
import type { IStudent } from '../../types/student.types';
import type { IClass } from '../../types/academic.types';
import type { ILeaveApplication } from '../../types/leave.types';

const DashboardHome = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Parallel fetching for stats
    const { data: students = [] } = useQuery({ queryKey: ['students'], queryFn: () => userService.getAllStudents() });
    const { data: classes = [] } = useQuery({ queryKey: ['classes'], queryFn: () => academicService.getClasses() });
    const { data: notices = [] } = useQuery({ queryKey: ['notices'], queryFn: () => noticeService.getNotices() });
    const { data: leaves = [] } = useQuery({ queryKey: ['leaves'], queryFn: () => leaveService.getLeaves() });

    const pendingLeaves = Array.isArray(leaves) ? (leaves as ILeaveApplication[]).filter((l) => l.status === 'Pending').length : 0;

    const chartData = (classes as IClass[]).map((cls) => {
        const count = (students as IStudent[]).filter((std) => {
            const classId = typeof std.class === 'object' && std.class !== null ? std.class._id : std.class;
            return classId === cls._id;
        }).length;
        return {
            name: cls.name,
            students: count
        };
    });

    const stats = [
        { title: 'Total Students', value: students.length, icon: <Users size={24} />, color: 'bg-blue-500', link: '/students' },
        { title: 'Total Classes', value: classes.length, icon: <School size={24} />, color: 'bg-purple-500', link: '/academic/classes' },
        { title: 'Active Notices', value: notices.length, icon: <Bell size={24} />, color: 'bg-yellow-500', link: '/notices' },
        { title: 'Pending Leaves', value: pendingLeaves, icon: <CalendarClock size={24} />, color: 'bg-red-500', link: '/leaves' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <Link to={stat.link} key={index} className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between hover:shadow-lg transition-shadow cursor-pointer group">
                        <div>
                            <p className="text-gray-500 text-sm font-medium uppercase group-hover:text-blue-600 transition-colors">{stat.title}</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1 group-hover:text-blue-700 transition-colors">{stat.value}</p>
                        </div>
                        <div className={`p-4 rounded-full text-white ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                            {stat.icon}
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Students per Class Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md h-96">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Students per Class</h2>
                    <div className="w-full h-80">
                        {isMounted && chartData.length > 0 && (
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="students" fill="#3b82f6" name="Students" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Fee Collection Placeholder (or simple text stats) */}
                <div className="bg-white p-6 rounded-lg shadow-md h-96 flex flex-col items-center justify-center text-center">
                    <div className="bg-green-100 p-4 rounded-full mb-4">
                        <CreditCard size={32} className="text-green-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-700">Fee Management</h2>
                    <p className="text-gray-500 mt-2">Manage student fees and track payments in the Fee module.</p>
                    <p className="text-sm text-gray-400 mt-4">(Analytics coming soon)</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
