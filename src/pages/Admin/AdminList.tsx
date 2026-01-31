
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../../services/user.service';
import { Trash2, Search, UserCog } from 'lucide-react';

const AdminList = () => {
    const queryClient = useQueryClient();

    const { data: admins = [], isLoading, isError } = useQuery({
        queryKey: ['admins'],
        queryFn: () => userService.getAllAdmins(),
    });

    const deleteAdminMutation = useMutation({
        mutationFn: userService.deleteAdmin,
        onSuccess: () => {
            toast.success('Admin deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['admins'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete admin');
        },
    });

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this Admin? This action cannot be undone.')) {
            deleteAdminMutation.mutate(id);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading admins...</div>;
    }

    if (isError) {
        return <div className="p-8 text-center text-red-500">Error loading admins.</div>;
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                    <UserCog className="mr-3 text-blue-600" size={32} /> Admins List
                </h1>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search admins..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-64"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name / ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Info</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {admins.map((admin: any) => (
                            <tr key={admin._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 flex-shrink-0">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                                                {admin.name?.charAt(0) || 'A'}
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                                            <div className="text-sm text-gray-500">{admin.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{admin.email}</div>
                                    <div className="text-sm text-gray-500">{admin.contactNo}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        {admin.designation || 'N/A'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalized">
                                    {admin.gender}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

                                    <button
                                        onClick={() => handleDelete(admin.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {admins.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No admins found.</div>
                )}
            </div>
        </div>
    );
};

export default AdminList;
