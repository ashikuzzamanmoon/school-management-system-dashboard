import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { userService } from '../../services/user.service';
import { createAdminSchema, type CreateAdminResult } from '../../schemas/admin.schema';
import { Save, Mail, Phone, MapPin, Briefcase, Lock, UserCog } from 'lucide-react';

const CreateAdmin = () => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateAdminResult>({
        resolver: zodResolver(createAdminSchema),
        defaultValues: {
            admin: {
                name: '',
                email: '',
                contactNo: '',
                designation: '',
                gender: 'male',
                dateOfBirth: '',
                bloodGroup: 'A+',
                presentAddress: '',
                permanentAddress: '',
                profileImg: '',
            },
            password: 'admin123', // Default password
        },
    });

    const createAdminMutation = useMutation({
        mutationFn: userService.createAdmin,
        onSuccess: (data: any) => {
            setSuccessMessage(data.message || 'Admin created successfully!');
            setErrorMessage(null);
            reset();
            window.scrollTo(0, 0);
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (error: any) => {
            setErrorMessage(error.response?.data?.message || 'Failed to create admin');
            setSuccessMessage(null);
            window.scrollTo(0, 0);
        },
    });

    const onSubmit = (data: CreateAdminResult) => {
        createAdminMutation.mutate(data);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Admin</h1>

            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Admin Details Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-700 border-b pb-2">
                        <UserCog className="mr-2 text-blue-600" size={24} /> Admin Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                            <input
                                {...register('admin.name')}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${errors.admin?.name ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter Full Name"
                            />
                            {errors.admin?.name && <p className="text-red-500 text-xs mt-1">{errors.admin.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <Mail size={18} />
                                </span>
                                <input
                                    {...register('admin.email')}
                                    className={`w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${errors.admin?.email ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="admin@example.com"
                                />
                            </div>
                            {errors.admin?.email && <p className="text-red-500 text-xs mt-1">{errors.admin.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Designation</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <Briefcase size={18} />
                                </span>
                                <input
                                    {...register('admin.designation')}
                                    className={`w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${errors.admin?.designation ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="e.g. Principal, Manager"
                                />
                            </div>
                            {errors.admin?.designation && <p className="text-red-500 text-xs mt-1">{errors.admin.designation.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Gender</label>
                            <select
                                {...register('admin.gender')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Date of Birth</label>
                            <input
                                {...register('admin.dateOfBirth')}
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Blood Group</label>
                            <select
                                {...register('admin.bloodGroup')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                            >
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                                    <option key={bg} value={bg}>{bg}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Password (Optional)</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <Lock size={18} />
                                </span>
                                <input
                                    {...register('password')}
                                    type="password"
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    placeholder="Defaults to 'admin123'"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Information Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-700 border-b pb-2">
                        <MapPin className="mr-2 text-green-600" size={24} /> Contact Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Contact Number</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <Phone size={18} />
                                </span>
                                <input
                                    {...register('admin.contactNo')}
                                    className={`w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${errors.admin?.contactNo ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Contact Number"
                                />
                            </div>
                            {errors.admin?.contactNo && <p className="text-red-500 text-xs mt-1">{errors.admin.contactNo.message}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Present Address</label>
                            <textarea
                                {...register('admin.presentAddress')}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${errors.admin?.presentAddress ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter Present Address"
                                rows={2}
                            />
                            {errors.admin?.presentAddress && <p className="text-red-500 text-xs mt-1">{errors.admin.presentAddress.message}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Permanent Address</label>
                            <textarea
                                {...register('admin.permanentAddress')}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${errors.admin?.permanentAddress ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter Permanent Address"
                                rows={2}
                            />
                            {errors.admin?.permanentAddress && <p className="text-red-500 text-xs mt-1">{errors.admin.permanentAddress.message}</p>}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={createAdminMutation.isPending}
                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50"
                    >
                        <Save size={20} className="mr-2" />
                        {createAdminMutation.isPending ? 'Creating Admin...' : 'Create Admin'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateAdmin;
