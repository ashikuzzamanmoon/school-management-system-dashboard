import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Filter, Calendar, Pencil, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import { academicService } from '../../services/academic.service';
import { routineService } from '../../services/routine.service';
import type { IRoutine } from '../../types/routine.types';

const RoutineList = () => {
    const queryClient = useQueryClient();
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<string>('');
    const [filters, setFilters] = useState<{ class: string; section: string } | null>(null);

    // Fetch master data
    const { data: classes = [] } = useQuery({ queryKey: ['classes'], queryFn: academicService.getClasses });
    const { data: sections = [], isLoading: isLoadingSections } = useQuery({
        queryKey: ['sections', selectedClass],
        queryFn: () => academicService.getSections({ class: selectedClass }),
        enabled: !!selectedClass
    });

    // Fetch Routines - Only enabled when filters are applied
    const { data: routines = [], isLoading } = useQuery({
        queryKey: ['routines', filters],
        queryFn: () => routineService.getRoutines(filters!),
        enabled: !!filters,
    });

    const handleFilter = () => {
        if (selectedClass && selectedSection) {
            setFilters({ class: selectedClass, section: selectedSection });
        } else {
            alert('Please select both Class and Section');
        }
    };

    // Group routines by day
    const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const groupedRoutines = days.reduce((acc, day) => {
        acc[day] = routines.filter((r: IRoutine) => r.day === day).sort((a: IRoutine, b: IRoutine) => a.startTime.localeCompare(b.startTime));
        return acc;
    }, {} as Record<string, IRoutine[]>);

    // Mutation for Deleting Routine
    const deleteMutation = useMutation({
        mutationFn: routineService.deleteRoutine,
        onSuccess: () => {
            toast.success('Routine deleted successfully');
            queryClient.invalidateQueries({ queryKey: ['routines'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to delete routine');
        },
    });

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this routine?')) {
            deleteMutation.mutate(id);
        }
    };

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRoutine, setEditingRoutine] = useState<IRoutine | null>(null);

    // Form State for Edit
    const [editFormData, setEditFormData] = useState({
        day: '',
        startTime: '',
        endTime: '',
    });

    const openEditModal = (routine: IRoutine) => {
        setEditingRoutine(routine);
        setEditFormData({
            day: routine.day,
            startTime: routine.startTime,
            endTime: routine.endTime,
        });
        setIsEditModalOpen(true);
    };

    const updateMutation = useMutation({
        mutationFn: (data: { id: string; payload: any }) => routineService.updateRoutine(data.id, data.payload),
        onSuccess: () => {
            toast.success('Routine updated successfully');
            setIsEditModalOpen(false);
            setEditingRoutine(null);
            queryClient.invalidateQueries({ queryKey: ['routines'] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || 'Failed to update routine');
        },
    });

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingRoutine) {
            updateMutation.mutate({
                id: editingRoutine._id,
                payload: editFormData,
            });
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800">Class Routine</h1>
                <Link to="/routine/add" className="flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-200">
                    <Plus size={20} className="mr-2" /> Add Routine
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-end">
                <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                    <select
                        value={selectedClass}
                        onChange={(e) => {
                            setSelectedClass(e.target.value);
                            setSelectedSection(''); // Reset section when class changes
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Class</option>
                        {classes.map((cls: any) => <option key={cls._id} value={cls._id}>{cls.name}</option>)}
                    </select>
                </div>
                <div className="w-full md:w-1/3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                    <select
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={!selectedClass}
                    >
                        <option value="">{isLoadingSections ? 'Loading...' : !selectedClass ? 'Select Class First' : 'Select Section'}</option>
                        {sections.map((sec: any) => <option key={sec._id} value={sec._id}>{sec.name}</option>)}
                    </select>
                </div>
                <button
                    onClick={handleFilter}
                    className="w-full md:w-auto bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-6 rounded-md transition duration-200 flex items-center justify-center"
                >
                    <Filter size={18} className="mr-2" /> Filter
                </button>
            </div>

            {/* Routine Display */}
            {!filters ? (
                <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                    <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Select Class and Section to view the routine.</p>
                </div>
            ) : isLoading ? (
                <div className="text-center py-12">Loading routine...</div>
            ) : routines.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500">No routine found for this class and section.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {days.filter(day => groupedRoutines[day].length > 0).map(day => (
                        <div key={day} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                            <div className="bg-slate-100 px-4 py-3 border-b border-gray-200 font-bold text-gray-700 flex items-center justify-between">
                                <div className="flex items-center">
                                    <Calendar size={18} className="mr-2 text-blue-600" />
                                    {day}
                                </div>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {groupedRoutines[day].map((routine) => (
                                    <div key={routine._id} className="p-4 hover:bg-gray-50 transition-colors group relative">
                                        <div className="font-bold text-lg text-gray-800">{routine.subject.name}</div>
                                        <div className="flex justify-between items-center mt-1">
                                            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                {routine.startTime} - {routine.endTime}
                                            </span>
                                            <span className="text-xs text-gray-400">{routine.subject.code}</span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => openEditModal(routine)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-full"
                                                title="Edit"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(routine._id)}
                                                className="p-1.5 text-red-600 hover:bg-red-100 rounded-full"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Edit Routine</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                                <select
                                    value={editFormData.day}
                                    onChange={(e) => setEditFormData({ ...editFormData, day: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    {days.map(day => <option key={day} value={day}>{day}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                    <input
                                        type="text"
                                        value={editFormData.startTime}
                                        onChange={(e) => setEditFormData({ ...editFormData, startTime: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="10:00 AM"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                    <input
                                        type="text"
                                        value={editFormData.endTime}
                                        onChange={(e) => setEditFormData({ ...editFormData, endTime: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="11:00 AM"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-medium"
                                    disabled={updateMutation.isPending}
                                >
                                    {updateMutation.isPending ? 'Updating...' : 'Update Routine'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoutineList;
