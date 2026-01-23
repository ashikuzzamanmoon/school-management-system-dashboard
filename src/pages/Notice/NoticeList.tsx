import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Edit, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { noticeService } from '../../services/utility.service';
import Modal from '../../components/common/Modal';
import { toast } from 'sonner';
import type { INotice } from '../../types/utility.types';

const NoticeList = () => {
    const queryClient = useQueryClient();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentNotice, setCurrentNotice] = useState<INotice | null>(null);
    const { register, handleSubmit, reset, setValue } = useForm();

    const { data: notices = [], isLoading } = useQuery({
        queryKey: ['notices'],
        queryFn: noticeService.getNotices,
    });

    // Delete Notice Mutation
    const deleteNoticeMutation = useMutation({
        mutationFn: noticeService.deleteNotice,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notices'] });
            toast.success('Notice deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete notice');
        },
    });

    // Update Notice Mutation
    const updateNoticeMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => noticeService.updateNotice(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notices'] });
            toast.success('Notice updated successfully');
            closeModal();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update notice');
        }
    });

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this notice?')) {
            deleteNoticeMutation.mutate(id);
        }
    };

    const handleEdit = (notice: INotice) => {
        setCurrentNotice(notice);
        setValue('title', notice.title);
        setValue('description', notice.description);
        setValue('startDate', notice.startDate.split('T')[0]); // Format for date input
        setValue('endDate', notice.endDate.split('T')[0]);
        setIsEditModalOpen(true);
    };

    const closeModal = () => {
        setIsEditModalOpen(false);
        setCurrentNotice(null);
        reset();
    };

    const onEditSubmit = (data: any) => {
        if (currentNotice?._id) {
            updateNoticeMutation.mutate({ id: currentNotice._id, data });
        }
    };

    if (isLoading) return <div className="text-center py-10">Loading notices...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Notice Board</h1>
                <Link
                    to="/notices/add"
                    className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                >
                    <Plus size={20} className="mr-2" />
                    New Notice
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notices.length === 0 ? (
                    <div className="col-span-full text-center py-10 bg-white rounded-lg shadow text-gray-500">
                        No notices found.
                    </div>
                ) : (
                    notices.map((notice: INotice) => (
                        <div key={notice._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative group">
                            {/* Action Buttons Overlay */}
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 p-1 rounded-md shadow-sm">
                                <button
                                    onClick={() => handleEdit(notice)}
                                    className="text-blue-600 hover:text-blue-800 p-1"
                                    title="Edit"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDelete(notice._id)}
                                    className="text-red-600 hover:text-red-800 p-1"
                                    title="Delete"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-800 rounded-full">Notice</span>
                                    <span className="text-xs text-gray-500 flex items-center">
                                        <Calendar size={12} className="mr-1" />
                                        {new Date(notice.startDate).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-2 truncate" title={notice.title}>{notice.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {notice.description}
                                </p>
                                <div className="text-xs text-gray-400">
                                    Valid until: {new Date(notice.endDate).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={closeModal}
                title="Edit Notice"
            >
                <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                        <input
                            {...register('title', { required: true })}
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                        <textarea
                            {...register('description', { required: true })}
                            className="w-full border border-gray-300 rounded-md p-2"
                            rows={4}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Start Date</label>
                            <input
                                type="date"
                                {...register('startDate', { required: true })}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">End Date</label>
                            <input
                                type="date"
                                {...register('endDate', { required: true })}
                                className="w-full border border-gray-300 rounded-md p-2"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={closeModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                        <button type="submit" disabled={updateNoticeMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
                            {updateNoticeMutation.isPending ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default NoticeList;
