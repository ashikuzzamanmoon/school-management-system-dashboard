import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { leaveService } from '../../services/leave.service';
import Table from '../../components/common/Table';
import type { ILeaveApplication } from '../../types/leave.types';

const LeaveList = () => {
    const queryClient = useQueryClient();
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const { data: leaves = [], isLoading } = useQuery({
        queryKey: ['leaves'],
        queryFn: leaveService.getLeaves,
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
            accessor: (item: ILeaveApplication) => (item.student as any)?.name || 'N/A'
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
        {
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
        }
    ];

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Leave Applications</h1>
            </div>

            <Table
                data={leaves}
                columns={columns}
                isLoading={isLoading}
            />
        </div>
    );
};

export default LeaveList;
