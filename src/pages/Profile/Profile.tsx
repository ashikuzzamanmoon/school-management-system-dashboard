import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { User, Lock, Save, Loader2 } from 'lucide-react';
import { userService } from '../../services/user.service';
import { authService } from '../../services/auth.service';

const Profile = () => {
    const [activeTab, setActiveTab] = useState<'profile' | 'password'>('profile');
    const queryClient = useQueryClient();

    // --- Profile Logic ---
    const { data: user, isLoading: isUserLoading } = useQuery({
        queryKey: ['me'],
        queryFn: userService.getMe,
    });

    const { register: registerProfile, handleSubmit: handleSubmitProfile, formState: { errors: profileErrors } } = useForm({
        values: user, // Auto-populate form when user data is available
    });

    const updateProfileMutation = useMutation({
        mutationFn: userService.updateMe,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['me'] });
            toast.success('Profile updated successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    });

    const onProfileSubmit = (data: any) => {
        updateProfileMutation.mutate({
            name: data.name,
            contactNo: data.contactNo,
        });
    };

    // --- Password Logic ---
    const { register: registerPass, handleSubmit: handleSubmitPass, reset: resetPass, watch, formState: { errors: passErrors } } = useForm();

    const changePasswordMutation = useMutation({
        mutationFn: authService.changePassword,
        onSuccess: () => {
            toast.success('Password changed successfully');
            resetPass();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to change password');
        }
    });

    const onPasswordSubmit = (data: any) => {
        changePasswordMutation.mutate({
            oldPassword: data.oldPassword,
            newPassword: data.newPassword,
        });
    };

    const newPassword = watch('newPassword');

    if (isUserLoading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-blue-600" /></div>;
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Account Settings</h1>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar / Tabs */}
                <div className="w-full md:w-64 flex flex-col gap-2">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'profile'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                            }`}
                    >
                        <User size={18} />
                        Edit Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('password')}
                        className={`text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'password'
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                            }`}
                    >
                        <Lock size={18} />
                        Change Password
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    {activeTab === 'profile' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h2>
                            <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input
                                            {...registerProfile('name', { required: 'Name is required' })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                            placeholder="Your Name"
                                        />
                                        {profileErrors.name && <span className="text-xs text-red-500">{String(profileErrors.name.message)}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                                        <input
                                            {...registerProfile('contactNo')}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                            placeholder="Contact Number"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email (Read Only)</label>
                                        <input
                                            value={user?.email || ''}
                                            readOnly
                                            className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role / Designation</label>
                                        <div className="px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 capitalize">
                                            {user?.designation || user?.user?.role || user?.role}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end">
                                    <button
                                        type="submit"
                                        disabled={updateProfileMutation.isPending}
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {updateProfileMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'password' && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Change Password</h2>
                            <form onSubmit={handleSubmitPass(onPasswordSubmit)} className="space-y-5 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        {...registerPass('oldPassword', { required: 'Current password is required' })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        placeholder="Enter current password"
                                    />
                                    {passErrors.oldPassword && <span className="text-xs text-red-500">{String(passErrors.oldPassword.message)}</span>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        {...registerPass('newPassword', {
                                            required: 'New password is required',
                                            minLength: { value: 6, message: 'Password must be at least 6 characters' }
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        placeholder="Enter new password"
                                    />
                                    {passErrors.newPassword && <span className="text-xs text-red-500">{String(passErrors.newPassword.message)}</span>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        {...registerPass('confirmPassword', {
                                            required: 'Please confirm new password',
                                            validate: (val) => val === newPassword || 'Passwords do not match'
                                        })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                        placeholder="Confirm new password"
                                    />
                                    {passErrors.confirmPassword && <span className="text-xs text-red-500">{String(passErrors.confirmPassword.message)}</span>}
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={changePasswordMutation.isPending}
                                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {changePasswordMutation.isPending ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
