import { useQuery } from '@tanstack/react-query';
import { Users, School, Bell, CalendarClock, CreditCard } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { userService } from '../../services/user.service';
import { academicService } from '../../services/academic.service';
import { noticeService } from '../../services/utility.service';
import { leaveService } from '../../services/leave.service';

const DashboardHome = () => {
    // Parallel fetching for stats
    const { data: students = [] } = useQuery({ queryKey: ['students'], queryFn: () => userService.getAllStudents() });
    const { data: classes = [] } = useQuery({ queryKey: ['classes'], queryFn: academicService.getClasses });
    const { data: notices = [] } = useQuery({ queryKey: ['notices'], queryFn: noticeService.getNotices });
    const { data: leaves = [] } = useQuery({ queryKey: ['leaves'], queryFn: leaveService.getLeaves });

    const pendingLeaves = Array.isArray(leaves) ? leaves.filter((l: any) => l.status === 'Pending').length : 0;

    // Prepare chart data: Students per Class
    const chartData = classes.map((cls: any) => {
        const count = students.filter((std: any) => (std.class?._id === cls._id || std.class === cls._id)).length;
        return {
            name: cls.className,
            students: count
        };
    });

    const stats = [
        { title: 'Total Students', value: students.length, icon: <Users size={24} />, color: 'bg-blue-500' },
        { title: 'Total Classes', value: classes.length, icon: <School size={24} />, color: 'bg-purple-500' },
        { title: 'Active Notices', value: notices.length, icon: <Bell size={24} />, color: 'bg-yellow-500' },
        { title: 'Pending Leaves', value: pendingLeaves, icon: <CalendarClock size={24} />, color: 'bg-red-500' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium uppercase">{stat.title}</p>
                            <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                        </div>
                        <div className={`p-4 rounded-full text-white ${stat.color}`}>
                            {stat.icon}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Students per Class Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md h-96">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Students per Class</h2>
                    <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="students" fill="#3b82f6" name="Students" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
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
