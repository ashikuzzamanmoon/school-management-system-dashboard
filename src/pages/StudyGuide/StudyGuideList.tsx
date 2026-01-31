import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { studyGuideService } from '../../services/utility.service';
import { academicService } from '../../services/academic.service';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import type { IStudyGuide } from '../../types/utility.types';

const StudyGuideList = () => {
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [filterParams, setFilterParams] = useState<{ class?: string; section?: string; date?: string }>({ date: new Date().toISOString().split('T')[0] });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentStudyGuide, setCurrentStudyGuide] = useState<IStudyGuide | null>(null);

    const queryClient = useQueryClient();

    const { data: classes = [] } = useQuery({ queryKey: ['classes'], queryFn: () => academicService.getClasses() });
    const { data: filterSections = [], isLoading: isLoadingSections } = useQuery({
        queryKey: ['filterSections', selectedClass],
        queryFn: () => academicService.getSections({ class: selectedClass }),
        enabled: !!selectedClass
    });
    const { data: subjects = [] } = useQuery({ queryKey: ['subjects'], queryFn: () => academicService.getSubjects() });

    const { data: guides = [], isLoading } = useQuery({
        queryKey: ['studyGuides', filterParams],
        queryFn: () => studyGuideService.getStudyGuides(filterParams),
    });

    // Update Mutation
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => studyGuideService.updateStudyGuide(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['studyGuides'] });
            toast.success('Study Guide updated successfully');
            setIsEditModalOpen(false);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update study guide');
        },
    });

    // Delete Mutation
    const deleteMutation = useMutation({
        mutationFn: studyGuideService.deleteStudyGuide,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['studyGuides'] });
            toast.success('Study Guide deleted successfully');
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete study guide');
        },
    });

    // Form for Edit
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();

    // Fetch sections for edit form based on watched class
    const editClassId = watch('class');
    const { data: editSections = [] } = useQuery({
        queryKey: ['editSections', editClassId],
        queryFn: () => academicService.getSections({ class: editClassId }),
        enabled: !!editClassId
    });

    const handleFilter = () => {
        setFilterParams({
            class: selectedClass || undefined,
            section: selectedSection || undefined,
            date: selectedDate || undefined
        });
    };

    const handleEdit = (item: IStudyGuide) => {
        setCurrentStudyGuide(item);
        setValue('class', (item.class as any)?._id);
        setValue('section', (item.section as any)?._id);
        setValue('subject', (item.subject as any)?._id);
        setValue('date', new Date(item.date).toISOString().split('T')[0]);
        setValue('topic', item.topic);
        setIsEditModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this study guide?')) {
            deleteMutation.mutate(id);
        }
    };

    const onEditSubmit = (data: any) => {
        if (currentStudyGuide?._id) {
            updateMutation.mutate({ id: currentStudyGuide._id, data });
        }
    };

    const columns = [
        {
            header: 'Subject',
            accessor: (item: IStudyGuide) => (item.subject as any)?.name || 'N/A'
        },
        {
            header: 'Topic / Homework',
            accessor: 'topic' as keyof IStudyGuide,
            className: 'max-w-xs truncate'
        },
        {
            header: 'Class',
            accessor: (item: IStudyGuide) => (item.class as any)?.name || 'N/A'
        },
        {
            header: 'Section',
            accessor: (item: IStudyGuide) => (item.section as any)?.name || 'N/A'
        },
        {
            header: 'Date',
            accessor: (item: IStudyGuide) => new Date(item.date).toLocaleDateString()
        },
        {
            header: 'Actions',
            accessor: (item: IStudyGuide) => (
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
                <h1 className="text-2xl font-bold text-gray-800">Daily Study Guide</h1>
                <Link
                    to="/study-guides/add"
                    className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200"
                >
                    <Plus size={20} className="mr-2" />
                    Add Entry
                </Link>
            </div>

            {/* Filter Section */}
            <div className="bg-white p-4 rounded-lg shadow mb-6 flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                    <select
                        value={selectedClass}
                        onChange={(e) => {
                            setSelectedClass(e.target.value);
                            setSelectedSection('');
                        }}
                        className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                    >
                        <option value="">All Classes</option>
                        {classes.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                    <select
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                        disabled={!selectedClass}
                    >
                        <option value="">{isLoadingSections ? 'Loading...' : !selectedClass ? 'Select Class First' : 'All Sections'}</option>
                        {filterSections.map((s: any) => <option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                </div>
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                    />
                </div>
                <button
                    onClick={handleFilter}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md shadow transition duration-200 flex items-center h-[42px]"
                >
                    <Search size={18} className="mr-2" />
                    Filter
                </button>
            </div>

            <Table
                data={guides}
                columns={columns}
                isLoading={isLoading}
            />

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title="Edit Study Guide"
            >
                <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Class</label>
                        <select {...register('class', { required: 'Class is required' })} className="w-full border border-gray-300 rounded-md p-2">
                            <option value="">Select Class</option>
                            {classes.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                        {errors.class && <p className="text-red-500 text-xs mt-1">{String(errors.class.message)}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Section</label>
                        <select {...register('section', { required: 'Section is required' })} className="w-full border border-gray-300 rounded-md p-2">
                            <option value="">Select Section</option>
                            {editSections.map((s: any) => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                        {errors.section && <p className="text-red-500 text-xs mt-1">{String(errors.section.message)}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Subject</label>
                        <select {...register('subject', { required: 'Subject is required' })} className="w-full border border-gray-300 rounded-md p-2">
                            <option value="">Select Subject</option>
                            {subjects.map((s: any) => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                        {errors.subject && <p className="text-red-500 text-xs mt-1">{String(errors.subject.message)}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                        <input {...register('date', { required: 'Date is required' })} type="date" className="w-full border border-gray-300 rounded-md p-2" />
                        {errors.date && <p className="text-red-500 text-xs mt-1">{String(errors.date.message)}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Topic</label>
                        <textarea {...register('topic', { required: 'Topic is required' })} className="w-full border border-gray-300 rounded-md p-2" rows={3}></textarea>
                        {errors.topic && <p className="text-red-500 text-xs mt-1">{String(errors.topic.message)}</p>}
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

export default StudyGuideList;
