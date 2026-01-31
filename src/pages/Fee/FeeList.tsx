import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { feeService } from '../../services/utility.service';
import { userService } from '../../services/user.service';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import type { IFee } from '../../types/utility.types';

const FeeList = () => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentFee, setCurrentFee] = useState<IFee | null>(null);

    const queryClient = useQueryClient();
    const { data: fees = [], isLoading } = useQuery({ queryKey: ['fees'], queryFn: () => feeService.getFees() });
    const { data: students = [] } = useQuery({ queryKey: ['students'], queryFn: () => userService.getAllStudents() });

    // Update Mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => feeService.updateFee(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fees'] });
            toast.success('Fee record updated successfully');
            setIsEditModalOpen(false);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update fee record');
        },
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: feeService.deleteFee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['fees'] });
            toast.success('Fee record deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete fee record');
        },
    });

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
    const statusObj = watch('status');

    const handleEdit = (item: IFee) => {
        setCurrentFee(item);
        setValue('student', (item.student as any)?._id);
        setValue('type', item.type);
        setValue('amount', item.amount);
        setValue('month', item.month);
        setValue('year', item.year);
        setValue('status', item.status);
        setValue('transactionId', item.transactionId);
        setIsEditModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this fee record?')) {
            deleteMutation.mutate(id);
        }
    };

    const onEditSubmit = (data: any) => {
        if (currentFee?._id) {
            updateMutation.mutate({ id: currentFee._id, data: { ...data, amount: Number(data.amount) } });
        }
    };

    const columns = [
        {
            header: 'Student Name',
            accessor: (item: IFee) => (item.student as any)?.name || 'N/A'
        },
        {
            header: 'Roll No',
            accessor: (item: IFee) => (item.student as any)?.roll || 'N/A'
        },
        {
            header: 'Class',
            accessor: (item: IFee) => (item.class as any)?.name || 'N/A'
        },
        {
            header: 'Section',
            accessor: (item: IFee) => (item.section as any)?.name || 'N/A'
        },
        {
            header: 'Type',
            accessor: 'type' as keyof IFee
        },
        {
            header: 'Amount',
            accessor: 'amount' as keyof IFee
        },
        {
            header: 'Status',
            accessor: 'status' as keyof IFee,
            render: (item: IFee) => (
                <span className={`px-2 py-1 rounded text-xs font-semibold ${item.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {item.status}
                </span>
            )
        },
        {
            header: 'Month/Year',
            accessor: (item: IFee) => `${item.month} ${item.year}`
        },
        {
            header: 'Actions',
            accessor: (item: IFee) => (
                <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800">
                        <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Fee Records</h1>
                <Link
                    to="/fees/add"
                    className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                >
                    <Plus size={20} className="mr-2" />
                    New Record
                </Link>
            </div>

            <Table
                data={fees}
                columns={columns}
                isLoading={isLoading}
            />

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Fee Record"
            >
                <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Student</label>
                        <select {...register('student', { required: 'Student is required' })} className="w-full border border-gray-300 rounded-md p-2">
                            <option value="">Select Student</option>
                            {students.map((stu: any) => (
                                <option key={stu._id} value={stu._id}>{stu.name} ({stu.roll})</option>
                            ))}
                        </select>
                        {errors.student && <p className="text-red-500 text-xs mt-1">{String(errors.student.message)}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Amount</label>
                            <input {...register('amount', { required: 'Amount is required' })} type="number" className="w-full border border-gray-300 rounded-md p-2" />
                            {errors.amount && <p className="text-red-500 text-xs mt-1">{String(errors.amount.message)}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Type</label>
                            <input {...register('type', { required: 'Type is required' })} type="text" className="w-full border border-gray-300 rounded-md p-2" />
                            {errors.type && <p className="text-red-500 text-xs mt-1">{String(errors.type.message)}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Month</label>
                            <select {...register('month', { required: 'Month is required' })} className="w-full border border-gray-300 rounded-md p-2">
                                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Year</label>
                            <select {...register('year', { required: 'Year is required' })} className="w-full border border-gray-300 rounded-md p-2">
                                {[2024, 2025, 2026].map(y => (
                                    <option key={y} value={y.toString()}>{y}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                            <select {...register('status')} className="w-full border border-gray-300 rounded-md p-2">
                                <option value="Unpaid">Unpaid</option>
                                <option value="Paid">Paid</option>
                            </select>
                        </div>
                        {statusObj === 'Paid' && (
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Transaction ID</label>
                                <input {...register('transactionId')} className="w-full border border-gray-300 rounded-md p-2" />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={() => setIsEditModalOpen(false)} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                        <button type="submit" disabled={updateMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
                            {updateMutation.isPending ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default FeeList;
