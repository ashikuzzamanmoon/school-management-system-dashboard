import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { noticeService } from '../../services/utility.service';
import { createNoticeSchema, type CreateNoticeFormData } from '../../schemas/utility.schema';
import { Bell, Calendar, Send } from 'lucide-react';

const AddNotice = () => {
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateNoticeFormData>({
        resolver: zodResolver(createNoticeSchema),
    });

    const createNoticeMutation = useMutation({
        mutationFn: noticeService.createNotice,
        onSuccess: () => {
            setSuccessMessage('Notice created successfully!');
            setErrorMessage(null);
            reset();
            setTimeout(() => setSuccessMessage(null), 3000);
        },
        onError: (error: any) => {
            setErrorMessage(error.response?.data?.message || 'Failed to create notice');
            setSuccessMessage(null);
        },
    });

    const onSubmit = (data: CreateNoticeFormData) => {
        createNoticeMutation.mutate(data);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Create New Notice</h1>

            {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-6">{successMessage}</div>}
            {errorMessage && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">{errorMessage}</div>}

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md space-y-6">

                {/* Title */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Notice Title</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Bell size={18} /></span>
                        <input {...register('title')} placeholder="e.g. Summer Vacation Announcement" className={`w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'}`} />
                    </div>
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">Start Date</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Calendar size={18} /></span>
                            <input {...register('startDate')} type="date" className={`w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`} />
                        </div>
                        {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate.message}</p>}
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2">End Date</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Calendar size={18} /></span>
                            <input {...register('endDate')} type="date" className={`w-full pl-10 px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`} />
                        </div>
                        {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate.message}</p>}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                    <div className="relative">
                        {/* <span className="absolute top-3 left-0 flex items-start pl-3 text-gray-400"><FileText size={18} /></span> */}
                        <textarea {...register('description')} rows={4} className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`} placeholder="Enter detailed notice description..."></textarea>
                    </div>
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                </div>

                <div className="flex justify-end">
                    <button type="submit" disabled={createNoticeMutation.isPending} className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50">
                        <Send size={20} className="mr-2" />
                        {createNoticeMutation.isPending ? 'Publishing...' : 'Publish Notice'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddNotice;
