import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2, X, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { examService } from '../../services/exam.service';
import Table from '../../components/common/Table';
import type { IExam } from '../../types/exam.types';

const ExamList = () => {
    const queryClient = useQueryClient();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedExam, setSelectedExam] = useState<IExam | null>(null);

    const { data: exams = [], isLoading } = useQuery({
        queryKey: ['exams'],
        queryFn: () => examService.getExams(),
    });

    const deleteExamMutation = useMutation({
        mutationFn: examService.deleteExam,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams'] });
        }
    });

    const updateExamMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => examService.updateExam(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['exams'] });
            setIsEditModalOpen(false);
            setSelectedExam(null);
        }
    });

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this exam?')) {
            deleteExamMutation.mutate(id);
        }
    };

    const handleEdit = (exam: IExam) => {
        setSelectedExam(exam);
        setIsEditModalOpen(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedExam) return;

        // Collect form data
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const data = {
            examName: formData.get('examName'),
            date: formData.get('date'),
            startTime: formData.get('startTime'),
            endTime: formData.get('endTime'),
        };

        updateExamMutation.mutate({ id: selectedExam._id, data });
    };

    const columns = [
        { header: 'Exam Name', accessor: 'examName' as keyof IExam },
        { header: 'Class', accessor: (item: IExam) => (item.class as any)?.name || (item.class as any)?.className || 'N/A' },
        { header: 'Subject', accessor: (item: IExam) => (item.subject as any)?.name || (item.subject as any)?.subjectName || 'N/A' },
        { header: 'Date', accessor: (item: IExam) => new Date(item.date).toLocaleDateString() },
        { header: 'Time', accessor: (item: IExam) => `${item.startTime} - ${item.endTime}` },
        {
            header: 'Actions',
            accessor: (item: IExam) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit(item)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="Edit"
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => handleDelete(item._id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Exam Schedule</h1>
                <Link to="/exams/add" className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                    <Plus size={20} />
                    Add Exam
                </Link>
            </div>

            <Table
                data={exams}
                columns={columns}
                isLoading={isLoading}
            />

            {/* Edit Modal */}
            {isEditModalOpen && selectedExam && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Edit Exam</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Exam Name</label>
                                <input
                                    name="examName"
                                    defaultValue={selectedExam.examName}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date</label>
                                <input
                                    name="date"
                                    type="date"
                                    defaultValue={new Date(selectedExam.date).toISOString().split('T')[0]}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                                    <input
                                        name="startTime"
                                        type="time"
                                        defaultValue={selectedExam.startTime}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                                    <input
                                        name="endTime"
                                        type="time"
                                        defaultValue={selectedExam.endTime}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateExamMutation.isPending}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {updateExamMutation.isPending ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamList;
