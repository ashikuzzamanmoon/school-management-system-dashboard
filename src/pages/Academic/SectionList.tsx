import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { academicService } from '../../services/academic.service';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ISection } from '../../types/academic.types';

const SectionList = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentSection, setCurrentSection] = useState<ISection | null>(null);

    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<{ name: string; class: string }>();

    // Fetch Classes
    const { data: classes = [] } = useQuery({
        queryKey: ['classes'],
        queryFn: () => academicService.getClasses(),
    });

    // Fetch Sections
    const { data: sections = [], isLoading } = useQuery({
        queryKey: ['sections'],
        queryFn: () => academicService.getSections(),
    });

    // Create Section Mutation
    const createSectionMutation = useMutation({
        mutationFn: academicService.createSection,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sections'] });
            toast.success('Section created successfully');
            closeModal();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to create section');
        }
    });

    // Update Section Mutation
    const updateSectionMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: { name: string; class: string } }) => academicService.updateSection(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sections'] });
            toast.success('Section updated successfully');
            closeModal();
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update section');
        }
    });

    // Delete Section Mutation
    const deleteSectionMutation = useMutation({
        mutationFn: academicService.deleteSection,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['sections'] });
            toast.success('Section deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete section');
        }
    });

    const onSubmit = (data: { name: string; class: string }) => {
        if (isEditMode && currentSection) {
            updateSectionMutation.mutate({ id: currentSection._id, data });
        } else {
            createSectionMutation.mutate(data);
        }
    };

    const openCreateModal = () => {
        setIsEditMode(false);
        setCurrentSection(null);
        reset({ name: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (item: ISection) => {
        setIsEditMode(true);
        setCurrentSection(item);
        setValue('name', item.name);
        setValue('class', (item.class as any)?._id || item.class);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setCurrentSection(null);
        reset();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this section?')) {
            deleteSectionMutation.mutate(id);
        }
    };

    const columns = [
        { header: 'Section Name', accessor: 'name' as keyof ISection },
        {
            header: 'Class',
            accessor: (item: ISection) => (item.class as any)?.name || 'N/A'
        },
        {
            header: 'Created At',
            accessor: (item: ISection) => item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'
        },
        {
            header: 'Actions',
            accessor: (item: ISection) => (
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
                <h1 className="text-2xl font-bold text-gray-800">Section Management</h1>
                <button
                    onClick={openCreateModal}
                    className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                >
                    <Plus size={20} className="mr-2" />
                    Add Section
                </button>
            </div>

            <Table
                data={sections}
                columns={columns}
                isLoading={isLoading}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={isEditMode ? "Edit Section" : "Create New Section"}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Class</label>
                        <select
                            {...register('class', { required: 'Class is required' })}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white ${errors.class ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">Select Class</option>
                            {classes.map((cls: any) => (
                                <option key={cls._id} value={cls._id}>{cls.name}</option>
                            ))}
                        </select>
                        {errors.class && <p className="text-red-500 text-xs mt-1">{errors.class.message}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Section Name</label>
                        <input
                            {...register('name', { required: 'Section Name is required' })}
                            type="text"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="e.g. Section A"
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
                            disabled={createSectionMutation.isPending || updateSectionMutation.isPending}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
                        >
                            {(createSectionMutation.isPending || updateSectionMutation.isPending) ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default SectionList;
