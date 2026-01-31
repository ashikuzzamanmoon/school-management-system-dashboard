import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { userService } from '../../services/user.service';
import { feeService } from '../../services/utility.service';
import { createFeeSchema, type CreateFeeFormData } from '../../schemas/utility.schema';
import { academicService } from '../../services/academic.service';
import { User, CreditCard, Calendar, Save, Layers, Users } from 'lucide-react';

const AddFee = () => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<CreateFeeFormData>({
        resolver: zodResolver(createFeeSchema),
        defaultValues: {
            status: 'Unpaid'
        }
    });

    const statusObj = watch('status');

    // Fetch Classes & Sections
    const { data: classes = [] } = useQuery({ queryKey: ['classes'], queryFn: () => academicService.getClasses() });

    const selectedClass = watch('class');
    const selectedSection = watch('section');

    const { data: sections = [] } = useQuery({
        queryKey: ['sections', selectedClass],
        queryFn: () => academicService.getSections({ class: selectedClass }),
        enabled: !!selectedClass
    });

    // Fetch students based on Class & Section
    const { data: students = [] } = useQuery({
        queryKey: ['students', selectedClass, selectedSection],
        queryFn: () => userService.getAllStudents({ class: selectedClass, section: selectedSection }),
        enabled: !!selectedClass && !!selectedSection
    });


    const createMutation = useMutation({
        mutationFn: feeService.createFee,
        onSuccess: () => {
            setSuccessMessage('Fee record added successfully!');
            setErrorMessage(null);
            reset({ status: 'Unpaid', transactionId: '' });
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (error: any) => {
            setErrorMessage(error.response?.data?.message || 'Failed to add fee record');
            setSuccessMessage(null);
        },
    });

    const onSubmit = (data: CreateFeeFormData) => {
        createMutation.mutate(data);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Add Fee Record</h1>

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
                                {classes.map((cls: any) => (
                                    <option key={cls._id} value={cls._id}>{cls.name}</option>
                                ))}
                            </select>
                        </div>
                        {errors.class && <p className="text-red-500 text-xs mt-1">{errors.class.message}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Section</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Users size={18} /></span>
                            <select {...register('section')} className={`w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white ${errors.section ? 'border-red-500' : 'border-gray-300'}`}>
                                <option value="">Select Section</option>
                                {sections.map((sec: any) => (
                                    <option key={sec._id} value={sec._id}>{sec.name}</option>
                                ))}
                            </select>
                        </div>
                        {errors.section && <p className="text-red-500 text-xs mt-1">{errors.section.message}</p>}
                    </div>
                </div>

                {/* Student */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Student</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><User size={18} /></span>
                        <select {...register('student')} className={`w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white ${errors.student ? 'border-red-500' : 'border-gray-300'}`}>
                            <option value="">Select Student</option>
                            {students.map((stu: any) => (
                                <option key={stu._id} value={stu._id}>{stu.name} (Roll: {stu.roll})</option>
                            ))}
                        </select>
                    </div>
                    {errors.student && <p className="text-red-500 text-xs mt-1">{errors.student.message}</p>}
                </div>

                {/* Amount & Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Amount</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><CreditCard size={18} /></span>
                            <input {...register('amount', { valueAsNumber: true })} type="number" className={`w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${errors.amount ? 'border-red-500' : 'border-gray-300'}`} />
                        </div>
                        {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Fee Type</label>
                        <input {...register('type')} placeholder="e.g. Monthly Fee, Exam Fee" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${errors.type ? 'border-red-500' : 'border-gray-300'}`} />
                        {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
                    </div>
                </div>

                {/* Month & Year */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Month</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Calendar size={18} /></span>
                            <select {...register('month')} className={`w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white ${errors.month ? 'border-red-500' : 'border-gray-300'}`}>
                                <option value="">Select Month</option>
                                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                        </div>
                        {errors.month && <p className="text-red-500 text-xs mt-1">{errors.month.message}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Year</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Calendar size={18} /></span>
                            <select {...register('year')} className={`w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white ${errors.year ? 'border-red-500' : 'border-gray-300'}`}>
                                <option value="">Select Year</option>
                                {[2024, 2025, 2026].map(y => (
                                    <option key={y} value={y.toString()}>{y}</option>
                                ))}
                            </select>
                        </div>
                        {errors.year && <p className="text-red-500 text-xs mt-1">{errors.year.message}</p>}
                    </div>
                </div>

                {/* Status & TxID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                        <select {...register('status')} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 bg-white ${errors.status ? 'border-red-500' : 'border-gray-300'}`}>
                            <option value="Unpaid">Unpaid</option>
                            <option value="Paid">Paid</option>
                        </select>
                        {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>}
                    </div>

                    {statusObj === 'Paid' && (
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Transaction ID</label>
                            <input {...register('transactionId')} placeholder="e.g. TXN123456" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${errors.transactionId ? 'border-red-500' : 'border-gray-300'}`} />
                            {errors.transactionId && <p className="text-red-500 text-xs mt-1">{errors.transactionId.message}</p>}
                        </div>
                    )}
                </div>

                <div className="flex justify-end">
                    <button type="submit" disabled={createMutation.isPending} className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50">
                        <Save size={20} className="mr-2" />
                        {createMutation.isPending ? 'Saving...' : 'Save Fee Record'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddFee;
