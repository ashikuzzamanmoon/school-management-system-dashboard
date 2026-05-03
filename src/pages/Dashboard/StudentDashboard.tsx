import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/user.service';
import { Calendar, BookOpen, FileText, CreditCard, Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
    const { data: userData } = useQuery({ queryKey: ['me'], queryFn: userService.getMe });

    const studentName = userData?.student?.name || userData?.name || 'Student';

    const quickStats = [
        { title: "Today's Classes", value: "4", icon: <Calendar className="text-blue-600" />, bg: "bg-blue-100", link: "/student/routine" },
        { title: "Upcoming Exams", value: "2", icon: <FileText className="text-purple-600" />, bg: "bg-purple-100", link: "/student/exams" },
        { title: "Due Payments", value: "1", icon: <CreditCard className="text-red-600" />, bg: "bg-red-100", link: "/student/fees" },
        { title: "New Study Guides", value: "3", icon: <BookOpen className="text-green-600" />, bg: "bg-green-100", link: "/student/study-guides" },
    ];

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-500 rounded-2xl p-8 text-white shadow-lg">
                <h1 className="text-3xl font-bold">Welcome back, {studentName}! 👋</h1>
                <p className="mt-2 text-indigo-100 opacity-90">Keep track of your academic progress and stay updated with school activities.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickStats.map((stat, idx) => (
                    <Link to={stat.link} key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                            </div>
                            <div className={`${stat.bg} p-3 rounded-lg`}>
                                {stat.icon}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Notices */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center">
                            <Bell size={20} className="mr-2 text-yellow-500" />
                            Latest Notices
                        </h2>
                        <Link to="/notices" className="text-sm text-indigo-600 hover:underline">View all</Link>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50">
                            <div className="bg-white p-2 rounded shadow-sm text-center min-w-[50px]">
                                <span className="block text-xs font-bold text-indigo-600 uppercase">May</span>
                                <span className="block text-xl font-bold text-gray-800">15</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Summer Vacation Announcement</h3>
                                <p className="text-sm text-gray-500 mt-1">School will remain closed from May 20th to June 5th for summer break.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4 p-4 rounded-lg bg-gray-50">
                            <div className="bg-white p-2 rounded shadow-sm text-center min-w-[50px]">
                                <span className="block text-xs font-bold text-indigo-600 uppercase">May</span>
                                <span className="block text-xl font-bold text-gray-800">10</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-800">Annual Sports Day 2026</h3>
                                <p className="text-sm text-gray-500 mt-1">Join us for the annual sports competition starting from next Monday.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link to="/student/leaves" className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                            <span className="text-sm font-medium text-gray-700">Apply for Leave</span>
                            <Calendar size={16} className="text-gray-400" />
                        </Link>
                        <Link to="/student/fees" className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                            <span className="text-sm font-medium text-gray-700">Pay Monthly Fees</span>
                            <CreditCard size={16} className="text-gray-400" />
                        </Link>
                        <Link to="/profile" className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                            <span className="text-sm font-medium text-gray-700">Update Profile</span>
                            <User size={16} className="text-gray-400" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
