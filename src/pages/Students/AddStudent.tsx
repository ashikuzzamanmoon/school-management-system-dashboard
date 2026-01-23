import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { academicService } from '../../services/academic.service';
import { userService } from '../../services/user.service';
import { createStudentSchema, type CreateStudentResult } from '../../schemas/student.schema';
import { Save, User, Mail, Phone, Hash, BookOpen, Layers, Lock } from 'lucide-react';

const AddStudent = () => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Fetch Classes
    const { data: classes = [] } = useQuery({
        queryKey: ['classes'],
        queryFn: academicService.getClasses,
    });

    const {
        register,
        handleSubmit,
        reset,
        watch, // Added watch
        setValue, // Added setValue to reset section
        formState: { errors },
    } = useForm<CreateStudentResult>({
        resolver: zodResolver(createStudentSchema),
        defaultValues: {
            student: {
                name: '',
                email: '',
                roll: '',
                class: '',
                section: '',
                guardianPhone: '',
            },
            password: 'student123', // Default password
        },
    });

    const selectedClass = watch('student.class');

    // Reset section when class changes
    useEffect(() => {
        setValue('student.section', '');
    }, [selectedClass, setValue]);

    // Fetch Sections
    const { data: sections = [] } = useQuery({
        queryKey: ['sections', selectedClass],
        queryFn: () => academicService.getSections({ class: selectedClass }),
        enabled: !!selectedClass,
    });

    const createStudentMutation = useMutation({
        mutationFn: userService.createStudent,
        onSuccess: (data) => {
            setSuccessMessage(data.message || 'Student created successfully!');
            setErrorMessage(null);
            reset();
            window.scrollTo(0, 0);
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (error: any) => {
            setErrorMessage(error.response?.data?.message || 'Failed to create student');
            setSuccessMessage(null);
            window.scrollTo(0, 0);
        },
    });

    const onSubmit = (data: CreateStudentResult) => {
        createStudentMutation.mutate(data);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Student Admission</h1>

            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">
                    {successMessage}
                </div>
            )}

            {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Student Details Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-700 border-b pb-2">
                        <User className="mr-2 text-blue-600" size={24} /> Student Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                            <input
                                {...register('student.name')}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${errors.student?.name ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Enter Full Name"
                            />
                            {errors.student?.name && <p className="text-red-500 text-xs mt-1">{errors.student.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <Mail size={18} />
                                </span>
                                <input
                                    {...register('student.email')}
                                    className={`w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${errors.student?.email ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="student@example.com"
                                />
                            </div>
                            {errors.student?.email && <p className="text-red-500 text-xs mt-1">{errors.student.email.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Password (Optional)</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <Lock size={18} />
                                </span>
                                <input
                                    {...register('password')}
                                    type="password"
                                    className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                    placeholder="Defaults to 'student123'"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Academic Information Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-700 border-b pb-2">
                        <BookOpen className="mr-2 text-purple-600" size={24} /> Academic Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Class</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <Layers size={18} />
                                </span>
                                <select
                                    {...register('student.class')}
                                    className={`w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white ${errors.student?.class ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="">Select Class</option>
                                    {classes.map((cls: any) => (
                                        <option key={cls._id} value={cls._id}>
                                            {cls.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.student?.class && <p className="text-red-500 text-xs mt-1">{errors.student.class.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Section</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <Layers size={18} />
                                </span>
                                <select
                                    {...register('student.section')}
                                    className={`w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white ${errors.student?.section ? 'border-red-500' : 'border-gray-300'}`}
                                >
                                    <option value="">Select Section</option>
                                    {sections.map((sec: any) => (
                                        <option key={sec._id} value={sec._id}>
                                            {sec.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.student?.section && <p className="text-red-500 text-xs mt-1">{errors.student.section.message}</p>}
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Roll Number</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <Hash size={18} />
                                </span>
                                <input
                                    {...register('student.roll')}
                                    className={`w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${errors.student?.roll ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="e.g. 101"
                                />
                            </div>
                            {errors.student?.roll && <p className="text-red-500 text-xs mt-1">{errors.student.roll.message}</p>}
                        </div>
                    </div>
                </div>

                {/* Guardian Information Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-6 flex items-center text-gray-700 border-b pb-2">
                        <Phone className="mr-2 text-green-600" size={24} /> Guardian Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Guardian Phone</label>
                            <input
                                {...register('student.guardianPhone')}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${errors.student?.guardianPhone ? 'border-red-500' : 'border-gray-300'}`}
                                placeholder="Contact Number"
                            />
                            {errors.student?.guardianPhone && <p className="text-red-500 text-xs mt-1">{errors.student.guardianPhone.message}</p>}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={createStudentMutation.isPending}
                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50"
                    >
                        <Save size={20} className="mr-2" />
                        {createStudentMutation.isPending ? 'Submitting...' : 'Admit Student'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddStudent;
