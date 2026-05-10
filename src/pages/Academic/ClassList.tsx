import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { academicService } from '../../services/academic.service';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { IClass } from '../../types/academic.types';

const ClassList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentClass, setCurrentClass] = useState<IClass | null>(null);

    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<{ name: string }>();

    // Fetch Classes
    const { data: classesData = [], isLoading } = useQuery({
        queryKey: ['classes'],
        queryFn: () => academicService.getClasses(),
    });

    const classes = [...(classesData as IClass[])].sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' }));

    // Create Class Mutation
    const createClassMutation = useMutation({
        mutationFn: academicService.createClass,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] });
            toast.success('Class created successfully');
            closeModal();
        },
        onError: (error: Error & { response?: { data?: { message?: string } } }) => {
            toast.error(error.response?.data?.message || 'Failed to create class');
        }
    });

    // Update Class Mutation
    const updateClassMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: { name: string } }) => academicService.updateClass(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] });
            toast.success('Class updated successfully');
            closeModal();
        },
        onError: (error: Error & { response?: { data?: { message?: string } } }) => {
            toast.error(error.response?.data?.message || 'Failed to update class');
        }
    });

    // Delete Class Mutation
    const deleteClassMutation = useMutation({
        mutationFn: academicService.deleteClass,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['classes'] });
            toast.success('Class deleted successfully');
        },
        onError: (error: Error & { response?: { data?: { message?: string } } }) => {
            toast.error(error.response?.data?.message || 'Failed to delete class');
        }
    });

    const onSubmit = (data: { name: string }) => {
        if (isEditMode && currentClass) {
            updateClassMutation.mutate({ id: currentClass._id, data });
        } else {
            createClassMutation.mutate(data);
        }
    };

    const openCreateModal = () => {
        setIsEditMode(false);
        setCurrentClass(null);
        reset({ name: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (item: IClass) => {
        setIsEditMode(true);
        setCurrentClass(item);
        setValue('name', item.name);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setCurrentClass(null);
        reset();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this class?')) {
            deleteClassMutation.mutate(id);
        }
    };

    const columns = [
        { header: 'Class Name', accessor: 'name' as keyof IClass },
        {
            header: 'Created At',
            accessor: (item: IClass) => item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'
        },
        {
            header: 'Actions',
            accessor: (item: IClass) => (
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
                <h1 className="text-2xl font-bold text-gray-800">Class Management</h1>
                <button
                    onClick={openCreateModal}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                >
                    <Plus size={20} className="mr-2" />
                    Add Class
                </button>
            </div>

            <Table
                data={classes}
                columns={columns}
                isLoading={isLoading}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={isEditMode ? "Edit Class" : "Create New Class"}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Class Name</label>
                        <input
                            {...register('name', { required: 'Class Name is required' })}
                            type="text"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="e.g. Class 10"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
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
                            disabled={createClassMutation.isPending || updateClassMutation.isPending}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
                        >
                            {(createClassMutation.isPending || updateClassMutation.isPending) ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ClassList;
