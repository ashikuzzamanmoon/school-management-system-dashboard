import { useState } from 'react';
import { AxiosError } from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { leaveService } from '../../services/leave.service';
import { userService } from '../../services/user.service';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import type { ILeaveApplication, ICreateLeavePayload } from '../../types/leave.types';

const LeaveList = () => {
    const queryClient = useQueryClient();
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const [formData, setFormData] = useState<ICreateLeavePayload>({
        subject: '',
        description: '',
        startDate: '',
        endDate: ''
    });

    const { data: userData } = useQuery({ queryKey: ['me'], queryFn: userService.getMe });
    const userRole = (userData?.user?.role || userData?.role || '').toLowerCase();
    const isAdmin = userRole === 'admin' || userRole === 'superadmin';

    const { data: leaves = [], isLoading } = useQuery({
        queryKey: ['leaves', userRole],
        queryFn: () => isAdmin ? leaveService.getLeaves() : leaveService.getMyLeaves(),
        enabled: !!userRole
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: 'Approved' | 'Rejected' }) =>
            leaveService.updateStatus(id, { status }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leaves'] });
            toast.success('Leave status updated successfully');
            setActionLoading(null);
        },
        onError: () => {
            toast.error('Failed to update leave status');
            setActionLoading(null);
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => leaveService.deleteLeave(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leaves'] });
            toast.success('Leave application deleted successfully');
            setActionLoading(null);
        },
        onError: () => {
            toast.error('Failed to delete leave application');
            setActionLoading(null);
        }
    });

    const createMutation = useMutation({
        mutationFn: (data: ICreateLeavePayload) => leaveService.createLeave(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leaves'] });
            toast.success('Leave application submitted successfully');
            setIsRequestModalOpen(false);
            setFormData({ subject: '', description: '', startDate: '', endDate: '' });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            toast.error(error?.response?.data?.message || 'Failed to submit leave application');
        }
    });

    const handleAction = (id: string, status: 'Approved' | 'Rejected') => {
        if (confirm(`Are you sure you want to ${status} this application?`)) {
            setActionLoading(id);
            updateStatusMutation.mutate({ id, status });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this application?')) {
            setActionLoading(id);
            deleteMutation.mutate(id);
        }
    };

    const columns = [
        {
            header: 'Applicant',
            accessor: (item: ILeaveApplication) => (item.student as { name?: string })?.name || 'N/A'
        },
        {
            header: 'Type',
            accessor: 'subject' as keyof ILeaveApplication
        },
        {
            header: 'Reason',
            accessor: 'description' as keyof ILeaveApplication,
            className: 'max-w-xs truncate'
        },
        {
            header: 'Dates',
            accessor: (item: ILeaveApplication) => {
                const start = item.startDate ? new Date(item.startDate).toLocaleDateString() : 'N/A';
                const end = item.endDate ? new Date(item.endDate).toLocaleDateString() : 'N/A';
                return (
                    <div className="text-sm">
                        {start} - {end}
                    </div>
                );
            }
        },
        {
            header: 'Status',
            accessor: 'status' as keyof ILeaveApplication,
            render: (item: ILeaveApplication) => {
                let colorClass = 'bg-gray-100 text-gray-800';
                if (item.status === 'Approved') colorClass = 'bg-green-100 text-green-800';
                if (item.status === 'Rejected') colorClass = 'bg-red-100 text-red-800';
                if (item.status === 'Pending') colorClass = 'bg-yellow-100 text-yellow-800';

                return (
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${colorClass}`}>
                        {item.status}
                    </span>
                );
            }
        },
        // Only show actions for admins
        ...(isAdmin ? [{
            header: 'Actions',
            accessor: (item: ILeaveApplication) => (
                <div className="flex space-x-2">
                    {item.status === 'Pending' && (
                        <>
                            <button
                                onClick={() => handleAction(item._id, 'Approved')}
                                disabled={actionLoading === item._id}
                                className="p-1 bg-green-50 text-green-600 rounded hover:bg-green-100 disabled:opacity-50"
                                title="Approve"
                            >
                                <Check size={18} />
                            </button>
                            <button
                                onClick={() => handleAction(item._id, 'Rejected')}
                                disabled={actionLoading === item._id}
                                className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100 disabled:opacity-50"
                                title="Reject"
                            >
                                <X size={18} />
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => handleDelete(item._id)}
                        disabled={actionLoading === item._id}
                        className="p-1 bg-red-50 text-red-600 rounded hover:bg-red-100 disabled:opacity-50"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }] : [])
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createMutation.mutate(formData);
    };

    return (
        <div>
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Leave Applications</h1>
                {!isAdmin && (
                    <button
                        onClick={() => setIsRequestModalOpen(true)}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                    >
                        Request Leave
                    </button>
                )}
            </div>

            <Table
                data={leaves}
                columns={columns}
                isLoading={isLoading}
            />

            {/* Request Leave Modal */}
            <Modal
                isOpen={isRequestModalOpen}
                onClose={() => setIsRequestModalOpen(false)}
                title="Submit Leave Application"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Leave Type / Subject
                        </label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="e.g. Sick Leave, Personal"
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                            </label>
                            <input
                                type="date"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                            </label>
                            <input
                                type="date"
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                value={formData.endDate}
                                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reason / Description
                        </label>
                        <textarea
                            required
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Explain the reason for leave..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setIsRequestModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors disabled:opacity-50"
                        >
                            {createMutation.isPending ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default LeaveList;
