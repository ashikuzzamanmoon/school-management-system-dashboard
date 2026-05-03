import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Trash2, Search, Edit } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { userService } from '../../services/user.service';
import Table from '../../components/common/Table';
import Modal from '../../components/common/Modal';
import { toast } from 'sonner';
import type { IStudent } from '../../types/student.types';

const StudentList = () => {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');

    // Edit State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState<IStudent | null>(null);
    const { register, handleSubmit, reset, setValue } = useForm();

    // Fetch Students
    const { data: students = [], isLoading } = useQuery({
        queryKey: ['students'],
        queryFn: () => userService.getAllStudents(),
    });

    // Delete Student Mutation
    const deleteStudentMutation = useMutation({
        mutationFn: userService.deleteStudent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
            toast.success('Student deleted successfully');
        },
        onError: (error: Error & { response?: { data?: { message?: string } } }) => {
            toast.error(error.response?.data?.message || 'Failed to delete student');
        },
    });

    // Update Student Mutation
    const updateStudentMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: { name?: string; guardianPhone?: string } }) => userService.updateStudent(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['students'] });
            toast.success('Student updated successfully');
            closeModal();
        },
        onError: (error: Error & { response?: { data?: { message?: string } } }) => {
            toast.error(error.response?.data?.message || 'Failed to update student');
        }
    });

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete student "${name}"? This action cannot be undone.`)) {
            deleteStudentMutation.mutate(id);
        }
    };

    const handleEdit = (student: IStudent) => {
        setCurrentStudent(student);
        setValue('name', student.name);
        setValue('guardianPhone', student.guardianPhone);
        setIsEditModalOpen(true);
    };

    const closeModal = () => {
        setIsEditModalOpen(false);
        setCurrentStudent(null);
        reset();
    };

    const onEditSubmit = (data: { name?: string; guardianPhone?: string }) => {
        if (currentStudent?._id) {
            updateStudentMutation.mutate({ id: currentStudent._id, data });
        }
    };

    // Filter and sort students based on search term, class, section, and roll
    const filteredStudents = students
        .filter((student: IStudent) => {
            const term = searchTerm.toLowerCase();
            return (
                student.name.toLowerCase().includes(term) ||
                student.user?.id?.toLowerCase().includes(term) ||
                student.roll.toLowerCase().includes(term)
            );
        })
        .sort((a: IStudent, b: IStudent) => {
            const classA = a.class?.name || '';
            const classB = b.class?.name || '';
            if (classA < classB) return -1;
            if (classA > classB) return 1;

            const sectionA = a.section?.name || '';
            const sectionB = b.section?.name || '';
            if (sectionA < sectionB) return -1;
            if (sectionA > sectionB) return 1;

            // If same class and section, sort by roll numerically
            const rollA = parseInt(a.roll, 10) || 0;
            const rollB = parseInt(b.roll, 10) || 0;
            return rollA - rollB;
        });

    const columns = [
        // {
        //     header: 'Student ID',
        //     accessor: (item: IStudent) => item.user?.id || 'N/A'
        // },
        {
            header: 'Full Name',
            accessor: 'name' as keyof IStudent
        },
        {
            header: 'Roll No',
            accessor: 'roll' as keyof IStudent
        },
        {
            header: 'Class',
            accessor: (item: IStudent) => item.class?.name || 'N/A'
        },
        {
            header: 'Section',
            accessor: (item: IStudent) => item.section?.name || 'N/A'
        },
        {
            header: 'Guardian Phone',
            accessor: 'guardianPhone' as keyof IStudent
        },
        {
            header: 'Actions',
            accessor: (item: IStudent) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
                        title="Edit Student"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => handleDelete(item._id, item.name)}
                        className="text-red-600 hover:text-red-800 transition-colors p-1 rounded hover:bg-red-50"
                        title="Delete Student"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Student List</h1>

                <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                    {/* Search Input */}
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                            <Search size={18} />
                        </span>
                        <input
                            type="text"
                            placeholder="Search by Name or ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 w-full sm:w-64"
                        />
                    </div>

                    <Link
                        to="/students/add"
                        className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200 whitespace-nowrap"
                    >
                        <Plus size={20} className="mr-2" />
                        Add New Student
                    </Link>
                </div>
            </div>

            <Table
                data={filteredStudents}
                columns={columns}
                isLoading={isLoading}
            />

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={closeModal}
                title="Edit Student Info"
            >
                <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-md mb-4 text-sm text-gray-600">
                        <p>Academic details (Class/Section/Roll) cannot be changed here.</p>
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                        <input
                            {...register('name')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="Student Name"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Guardian Phone</label>
                        <input
                            {...register('guardianPhone')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="Guardian Phone"
                        />
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
                            disabled={updateStudentMutation.isPending}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition disabled:opacity-50"
                        >
                            {updateStudentMutation.isPending ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default StudentList;
