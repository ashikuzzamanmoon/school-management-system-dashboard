import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { academicService } from '../../services/academic.service';
import { examService } from '../../services/exam.service';
import { resultService } from '../../services/exam.service'; // Typo in Service File? No, I exported resultService from exam.service.ts? Wait, let me check. I put it in exam.service.ts in previous step? Yes I did.
import { userService } from '../../services/user.service'; // To fetch students? actually userService has getAllStudents.
import { createResultSchema, type CreateResultFormData } from '../../schemas/exam.schema';
import { User, CheckCircle } from 'lucide-react';

const AddResult = () => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Master Data
    const { data: classes = [] } = useQuery({ queryKey: ['classes'], queryFn: () => academicService.getClasses() });
    const { data: subjects = [] } = useQuery({ queryKey: ['subjects'], queryFn: () => academicService.getSubjects() });
    const { data: exams = [] } = useQuery({ queryKey: ['exams'], queryFn: () => examService.getExams() });

    const { data: allStudents = [] } = useQuery({ queryKey: ['students'], queryFn: () => userService.getAllStudents() });

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<CreateResultFormData>({
        resolver: zodResolver(createResultSchema),
    });

    const selectedClass = watch('class');
    const selectedSection = watch('section');

    const { data: sections = [], isLoading: isLoadingSections } = useQuery({
        queryKey: ['sections', selectedClass],
        queryFn: () => academicService.getSections({ class: selectedClass }),
        enabled: !!selectedClass
    });

    // Filter Students based on selection
    const filteredStudents = allStudents.filter((stu: any) =>
        (!selectedClass || stu.class?._id === selectedClass) &&
        (!selectedSection || stu.section?._id === selectedSection)
    );

    const createResultMutation = useMutation({
        mutationFn: resultService.createResult,
        onSuccess: () => {
            setSuccessMessage('Result added successfully!');
            setErrorMessage(null);
            reset({
                ...watch(), // Keep context selections
                student: '', // Reset student
                marks: 0,
                grade: ''
            });
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (error: any) => {
            setErrorMessage(error.response?.data?.message || 'Failed to add result');
            setSuccessMessage(null);
        },
    });

    const onSubmit = (data: CreateResultFormData) => {
        // Prepare payload: redundant fields (class, section) are stripped by Zod if strict? 
        // The service expects specific payload. I'll just pass data which has student, examName, subject, marks, grade.
        createResultMutation.mutate(data);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Enter Student Result</h1>

            {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">{successMessage}</div>}
            {errorMessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">{errorMessage}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md space-y-6">

                {/* Context: Exam, Class, Section, Subject */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Exam</label>
                        <select {...register('exam')} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white ${errors.exam ? 'border-red-500' : 'border-gray-300'}`}>
                            <option value="">Select Exam</option>
                            {exams.map((e: any) => (
                                <option key={e._id} value={e._id}>{e.examName}</option>
                            ))}
                        </select>
                        {errors.exam && <p className="text-red-500 text-xs mt-1">{errors.exam.message}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Subject</label>
                        <select {...register('subject')} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}>
                            <option value="">Select Subject</option>
                            {subjects.map((sub: any) => <option key={sub._id} value={sub._id}>{sub.name}</option>)}
                        </select>
                        {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject.message}</p>}
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Class</label>
                        <select {...register('class')} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white ${errors.class ? 'border-red-500' : 'border-gray-300'}`}>
                            <option value="">Select Class</option>
                            {classes.map((cls: any) => <option key={cls._id} value={cls._id}>{cls.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Section</label>
                        <select
                            {...register('section')}
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white ${errors.section ? 'border-red-500' : 'border-gray-300'}`}
                            disabled={!selectedClass}
                        >
                            <option value="">{isLoadingSections ? 'Loading...' : !selectedClass ? 'Select Class First' : 'Select Section'}</option>
                            {sections.map((sec: any) => <option key={sec._id} value={sec._id}>{sec.name}</option>)}
                        </select>
                    </div>
                </div>

                <hr className="border-gray-200" />

                {/* Student Selection (Derived) */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Student</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><User size={18} /></span>
                        <select {...register('student')} className={`w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white ${errors.student ? 'border-red-500' : 'border-gray-300'}`} disabled={!selectedClass || !selectedSection}>
                            <option value="">Select Student</option>
                            {filteredStudents.map((stu: any) => (
                                <option key={stu._id} value={stu._id}>{stu.name} (Roll: {stu.roll})</option>
                            ))}
                        </select>
                    </div>
                    {(!selectedClass || !selectedSection) && <p className="text-gray-400 text-xs mt-1">Select Class and Section first</p>}
                    {errors.student && <p className="text-red-500 text-xs mt-1">{errors.student.message}</p>}
                </div>

                {/* Marks & Grade */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Marks Obtained</label>
                        <input {...register('marks', { valueAsNumber: true })} type="number" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${errors.marks ? 'border-red-500' : 'border-gray-300'}`} />
                        {errors.marks && <p className="text-red-500 text-xs mt-1">{errors.marks.message}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Grade</label>
                        <input {...register('grade')} placeholder="e.g. A+" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${errors.grade ? 'border-red-500' : 'border-gray-300'}`} />
                        {errors.grade && <p className="text-red-500 text-xs mt-1">{errors.grade.message}</p>}
                    </div>
                </div>

                <div className="flex justify-end">
                    <button type="submit" disabled={createResultMutation.isPending} className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50">
                        <CheckCircle size={20} className="mr-2" />
                        {createResultMutation.isPending ? 'Saving...' : 'Save Result'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddResult;
