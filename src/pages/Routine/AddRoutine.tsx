import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { academicService } from '../../services/academic.service';
import { routineService } from '../../services/routine.service';
import { createRoutineSchema, type CreateRoutineFormData } from '../../schemas/routine.schema';
import { Calendar, Clock, BookOpen, Layers, Save } from 'lucide-react';

const AddRoutine = () => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<CreateRoutineFormData>({
        resolver: zodResolver(createRoutineSchema),
    });

    const selectedClass = watch('class');

    const { data: classes = [] } = useQuery({ queryKey: ['classes'], queryFn: academicService.getClasses });
    const { data: sections = [], isLoading: isLoadingSections } = useQuery({
        queryKey: ['sections', selectedClass],
        queryFn: () => academicService.getSections({ class: selectedClass }),
        enabled: !!selectedClass
    });
    const { data: subjects = [] } = useQuery({ queryKey: ['subjects'], queryFn: academicService.getSubjects });

    const createRoutineMutation = useMutation({
        mutationFn: routineService.createRoutine,
        onSuccess: () => {
            setSuccessMessage('Routine created successfully!');
            setErrorMessage(null);
            reset();
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (error: any) => {
            setErrorMessage(error.response?.data?.message || 'Failed to create routine');
            setSuccessMessage(null);
        },
    });

    const onSubmit = (data: CreateRoutineFormData) => {
        // Cast the day string to the literal type expected by the interface
        const payload = {
            ...data,
            day: data.day as "Saturday" | "Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday"
        };
        createRoutineMutation.mutate(payload);
    };

    const days = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Add Class Routine</h1>

            {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">{successMessage}</div>}
            {errorMessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">{errorMessage}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md space-y-6">

                {/* Class & Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Class</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Layers size={18} /></span>
                            <select {...register('class')} className={`w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white ${errors.class ? 'border-red-500' : 'border-gray-300'}`}>
                                <option value="">Select Class</option>
                                {classes.map((cls: any) => <option key={cls._id} value={cls._id}>{cls.name}</option>)}
                            </select>
                        </div>
                        {errors.class && <p className="text-red-500 text-xs mt-1">{errors.class.message}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Section</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Layers size={18} /></span>
                            <select
                                {...register('section')}
                                className={`w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white ${errors.section ? 'border-red-500' : 'border-gray-300'}`}
                                disabled={!selectedClass}
                            >
                                <option value="">{isLoadingSections ? 'Loading...' : !selectedClass ? 'Select Class First' : 'Select Section'}</option>
                                {sections.map((sec: any) => <option key={sec._id} value={sec._id}>{sec.name}</option>)}
                            </select>
                        </div>
                        {errors.section && <p className="text-red-500 text-xs mt-1">{errors.section.message}</p>}
                    </div>
                </div>

                {/* Subject & Day */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Subject</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><BookOpen size={18} /></span>
                            <select {...register('subject')} className={`w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}>
                                <option value="">Select Subject</option>
                                {subjects.map((sub: any) => <option key={sub._id} value={sub._id}>{sub.name} ({sub.code})</option>)}
                            </select>
                        </div>
                        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Day</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Calendar size={18} /></span>
                            <select {...register('day')} className={`w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white ${errors.day ? 'border-red-500' : 'border-gray-300'}`}>
                                <option value="">Select Day</option>
                                {days.map((day) => <option key={day} value={day}>{day}</option>)}
                            </select>
                        </div>
                        {errors.day && <p className="text-red-500 text-xs mt-1">{errors.day.message}</p>}
                    </div>
                </div>

                {/* Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Start Time</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Clock size={18} /></span>
                            <input {...register('startTime')} type="time" className={`w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${errors.startTime ? 'border-red-500' : 'border-gray-300'}`} />
                        </div>
                        {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime.message}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">End Time</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Clock size={18} /></span>
                            <input {...register('endTime')} type="time" className={`w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${errors.endTime ? 'border-red-500' : 'border-gray-300'}`} />
                        </div>
                        {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime.message}</p>}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" disabled={createRoutineMutation.isPending} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50">
                        <Save size={20} className="mr-2" />
                        {createRoutineMutation.isPending ? 'Saving...' : 'Save Routine'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddRoutine;
