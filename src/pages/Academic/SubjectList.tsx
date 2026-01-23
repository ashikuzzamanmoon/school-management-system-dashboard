import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { academicService } from '../../services/academic.service';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ISubject } from '../../types/academic.types';

const SubjectList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentSubject, setCurrentSubject] = useState<ISubject | null>(null);

    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<{ name: string; code: string }>();

    // Fetch Subjects
    const { data: subjects = [], isLoading } = useQuery({
        queryKey: ['subjects'],
        queryFn: academicService.getSubjects,
    });

    // Create Subject Mutation
    const createSubjectMutation = useMutation({
        mutationFn: academicService.createSubject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
            toast.success('Subject created successfully');
            closeModal();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create subject');
        }
    });

    // Update Subject Mutation
    const updateSubjectMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: { name: string; code: string } }) => academicService.updateSubject(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
            toast.success('Subject updated successfully');
            closeModal();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update subject');
        }
    });

    // Delete Subject Mutation
    const deleteSubjectMutation = useMutation({
        mutationFn: academicService.deleteSubject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
            toast.success('Subject deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete subject');
        }
    });

    const onSubmit = (data: { name: string; code: string }) => {
        if (isEditMode && currentSubject) {
            updateSubjectMutation.mutate({ id: currentSubject._id, data });
        } else {
            createSubjectMutation.mutate(data);
        }
    };

    const openCreateModal = () => {
        setIsEditMode(false);
        setCurrentSubject(null);
        reset({ name: '', code: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (item: ISubject) => {
        setIsEditMode(true);
        setCurrentSubject(item);
        setValue('name', item.name);
        setValue('code', item.code);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setCurrentSubject(null);
        reset();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this subject?')) {
            deleteSubjectMutation.mutate(id);
        }
    };

    const columns = [
        { header: 'Subject Name', accessor: 'name' as keyof ISubject },
        { header: 'Subject Code', accessor: 'code' as keyof ISubject },
        {
            header: 'Created At',
            accessor: (item: ISubject) => item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'
        },
        {
            header: 'Actions',
            accessor: (item: ISubject) => (
                <div className="flex gap-2">
                    <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-800">
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
                <h1 className="text-2xl font-bold text-gray-800">Subject Management</h1>
                <button
                    onClick={openCreateModal}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                >
                    <Plus size={20} className="mr-2" />
                    Add Subject
                </button>
            </div>

            <Table
                data={subjects}
                columns={columns}
                isLoading={isLoading}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={isEditMode ? "Edit Subject" : "Create New Subject"}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Subject Name</label>
                        <input
                            {...register('name', { required: 'Subject Name is required' })}
                            type="text"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="e.g. Mathematics"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Subject Code</label>
                        <input
                            {...register('code', { required: 'Subject Code is required' })}
                            type="text"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${errors.code ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="e.g. MATH101"
                        />
                        {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code.message}</p>}
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createSubjectMutation.isPending || updateSubjectMutation.isPending}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
                        >
                            {(createSubjectMutation.isPending || updateSubjectMutation.isPending) ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default SubjectList;
