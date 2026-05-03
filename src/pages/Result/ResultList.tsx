import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { academicService } from '../../services/academic.service';
import { examService, resultService } from '../../services/exam.service';
import { userService } from '../../services/user.service';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import type { IResult } from '../../types/exam.types';
import { Search, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const ResultList = () => {
    // Filters
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [selectedExam, setSelectedExam] = useState('');
    // Trigger
    const [filterParams, setFilterParams] = useState<{ class?: string; section?: string; examName?: string } | null>({});

    // Edit/Delete State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentResult, setCurrentResult] = useState<IResult | null>(null);

    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<{ marks: number; grade: string }>();

    const { data: userData } = useQuery({ queryKey: ['me'], queryFn: userService.getMe });
    const userRole = (userData?.user?.role || userData?.role || '').toLowerCase();
    const isAdmin = userRole === 'admin' || userRole === 'superadmin';

    // Fetch Master Data
    const { data: classes = [] } = useQuery({ queryKey: ['classes'], queryFn: () => academicService.getClasses() });
    const { data: sections = [], isLoading: isLoadingSections } = useQuery({
        queryKey: ['sections', selectedClass],
        queryFn: () => academicService.getSections({ class: selectedClass }),
        enabled: !!selectedClass
    });
    const { data: exams = [] } = useQuery({ queryKey: ['exams'], queryFn: () => examService.getExams() });

    // Fetch Results
    const { data: results = [], isLoading, isFetching } = useQuery({
        queryKey: ['results', filterParams, userRole],
        queryFn: () => isAdmin ? resultService.getResults(filterParams || {}) : resultService.getMyResults(),
        enabled: !!userRole,
    });

    // Update Result Mutation
    const updateResultMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: { marks: number; grade: string } }) => resultService.updateResult(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['results'] });
            toast.success('Result updated successfully');
            closeModal();
        },
        onError: (error: Error & { response?: { data?: { message?: string } } }) => {
            toast.error(error.response?.data?.message || 'Failed to update result');
        }
    });

    // Delete Result Mutation
    const deleteResultMutation = useMutation({
        mutationFn: resultService.deleteResult,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['results'] });
            toast.success('Result deleted successfully');
        },
        onError: (error: Error & { response?: { data?: { message?: string } } }) => {
            toast.error(error.response?.data?.message || 'Failed to delete result');
        }
    });

    const handleFilter = () => {
        if (!selectedClass && !selectedExam) {
            alert('Please select at least Class or Exam to filter.');
            return;
        }
        setFilterParams({
            class: selectedClass || undefined,
            section: selectedSection || undefined,
            examName: selectedExam || undefined
        });
    };

    const handleEdit = (item: IResult) => {
        setCurrentResult(item);
        setValue('marks', item.marks);
        setValue('grade', item.grade || '');
        setIsEditModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this result?')) {
            deleteResultMutation.mutate(id);
        }
    };

    const closeModal = () => {
        setIsEditModalOpen(false);
        setCurrentResult(null);
        reset();
    };

    const onEditSubmit = (data: { marks: number; grade: string }) => {
        if (currentResult?._id) {
            updateResultMutation.mutate({
                id: currentResult._id,
                data: { ...data, marks: Number(data.marks) }
            });
        }
    };

    const columns = [
        {
            header: 'Student Name',
            accessor: (item: IResult) => item.student?.name || 'N/A'
        },
        {
            header: 'Roll No',
            accessor: (item: IResult) => item.student?.roll || 'N/A'
        },
        {
            header: 'Class',
            accessor: (item: IResult) => {
                // Check direct population first
                if (item.class && typeof item.class === 'object') {
                    return (item.class as unknown as { name: string }).name || 'N/A';
                }
                // Fallback to nested student population
                const student = item.student;
                if (student && typeof student === 'object' && 'class' in student) {
                    const studentClass = student.class as unknown as { name: string };
                    return studentClass?.name || 'N/A';
                }
                return 'N/A';
            }
        },
        {
            header: 'Section',
            accessor: (item: IResult) => {
                // Check direct population first
                if (item.section && typeof item.section === 'object') {
                    return (item.section as unknown as { name: string }).name || 'N/A';
                }
                // Fallback to nested student population
                const student = item.student;
                if (student && typeof student === 'object' && 'section' in student) {
                    const studentSection = student.section as unknown as { name: string };
                    return studentSection?.name || 'N/A';
                }
                return 'N/A';
            }
        },
        {
            header: 'Subject',
            accessor: (item: IResult) => (item.subject && typeof item.subject === 'object' ? item.subject.name : 'N/A')
        },
        {
            header: 'Marks',
            accessor: 'marks' as keyof IResult
        },
        {
            header: 'Grade',
            accessor: 'grade' as keyof IResult
        },
        {
            header: 'Exam',
            accessor: (item: IResult) => (item.exam && typeof item.exam === 'object' ? item.exam.examName : 'N/A')
        },
        // Only show actions for admins
        ...(isAdmin ? [{
            header: 'Actions',
            accessor: (item: IResult) => (
                <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-800">
                        <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800">
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }] : [])
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Exam Results</h1>
            </div>

            {/* Filter Section - Only for Admins */}
            {isAdmin && (
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
                            {classes.map((c: { _id: string; name: string }) => <option key={c._id} value={c._id}>{c.name}</option>)}
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
                            {sections.map((s: { _id: string; name: string }) => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Exam</label>
                        <select
                            value={selectedExam}
                            onChange={(e) => setSelectedExam(e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                        >
                            <option value="">All Exams</option>
                            {[...new Set(exams.map((e: { examName: string }) => e.examName))].map((name: string) => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleFilter}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-md shadow transition duration-200 flex items-center h-[42px]"
                    >
                        <Search size={18} className="mr-2" />
                        Filter
                    </button>
                </div>
            )}

            {/* Result Table */}
            <Table
                data={results}
                columns={columns}
                isLoading={isLoading || isFetching}
            />

            {/* Edit Result Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={closeModal}
                title="Edit Result"
            >
                <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-md mb-4 text-sm">
                        <p><span className="font-bold">Student:</span> {currentResult?.student?.name} ({currentResult?.student?.roll})</p>
                        <p><span className="font-bold">Exam:</span> {currentResult?.exam && typeof currentResult.exam === 'object' ? currentResult.exam.examName : 'N/A'}</p>
                        <p><span className="font-bold">Subject:</span> {currentResult?.subject && typeof currentResult.subject === 'object' ? currentResult.subject.name : 'N/A'}</p>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Marks</label>
                        <input
                            {...register('marks', { required: 'Marks are required', min: 0, max: 100 })}
                            type="number"
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                        {errors.marks && <p className="text-red-500 text-xs mt-1">Marks must be between 0 and 100</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Grade</label>
                        <input
                            {...register('grade')}
                            type="text"
                            placeholder="e.g. A, B+"
                            className="w-full border border-gray-300 rounded-md p-2"
                        />
                    </div>

                    <div className="flex justify-end gap-2 mt-4">
                        <button type="button" onClick={closeModal} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
                        <button type="submit" disabled={updateResultMutation.isPending} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
                            {updateResultMutation.isPending ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ResultList;
