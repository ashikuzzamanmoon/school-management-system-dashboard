import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Lock, User, X, GraduationCap } from 'lucide-react';
import { authService, type LoginFormData, loginSchema } from '../services/auth.service';
import { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const setDemoCredentials = (email: string, pass: string) => {
        setValue('email', email);
        setValue('password', pass);
    };

    const onSubmit = async (data: LoginFormData) => {
        setError(null);
        setLoading(true);
        try {
            const response = await authService.login(data);
            if (response.success) {
                localStorage.setItem('accessToken', response.data.accessToken);
                navigate('/dashboard');
            }
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            
            <div className="max-w-4xl w-full z-10 flex bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-white">
                {/* Left Side: Information (Visible on MD+) */}
                <div className="hidden md:flex md:w-1/2 bg-indigo-600 p-12 flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center space-x-3 text-white">
                            <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl">
                                <GraduationCap className="h-8 w-8" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">EduFlow Pro</span>
                        </div>
                        
                        <div className="mt-20">
                            <h1 className="text-4xl font-extrabold text-white leading-tight">
                                Empowering the next <br />
                                <span className="text-indigo-200">generation of leaders.</span>
                            </h1>
                            <p className="mt-6 text-indigo-100 text-lg leading-relaxed opacity-90">
                                A complete ecosystem to manage your school's academics, students, and administration with ease and elegance.
                            </p>
                        </div>
                    </div>
                    
                    <div className="relative z-10 flex items-center space-x-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-indigo-600 bg-indigo-400"></div>
                            ))}
                        </div>
                        <span className="text-indigo-100 text-sm font-medium">Joined by 200+ Institutions</span>
                    </div>
                </div>

                {/* Right Side: Login Form */}
                <div className="w-full md:w-1/2 p-8 sm:p-12">
                    <div className="text-center md:text-left mb-10">
                        <div className="md:hidden inline-flex items-center justify-center w-16 h-16 bg-indigo-50 rounded-2xl mb-6">
                            <GraduationCap className="h-8 w-8 text-indigo-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                            Welcome Back
                        </h2>
                        <p className="mt-2 text-slate-500 font-medium">
                            Please sign in to continue
                        </p>
                    </div>

                    {error && (
                        <div className="bg-rose-50 border border-rose-100 p-4 mb-8 rounded-xl flex items-center animate-shake">
                            <X className="h-5 w-5 text-rose-500 mr-3 shrink-0" />
                            <p className="text-sm text-rose-600 font-semibold">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-5">
                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-2 uppercase tracking-wider">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    </span>
                                    <input
                                        {...register('email')}
                                        type="email"
                                        className={`block w-full pl-12 pr-4 py-3.5 border border-slate-200 bg-white rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all sm:text-sm font-medium`}
                                        placeholder="admin@school.com"
                                    />
                                </div>
                                {errors.email && <p className="mt-2 text-xs text-rose-500 font-bold">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label className="block text-[13px] font-bold text-slate-700 mb-2 uppercase tracking-wider">
                                    Password
                                </label>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                                    </span>
                                    <input
                                        {...register('password')}
                                        type="password"
                                        className={`block w-full pl-12 pr-4 py-3.5 border border-slate-200 bg-white rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 transition-all sm:text-sm font-medium`}
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password && <p className="mt-2 text-xs text-rose-500 font-bold">{errors.password.message}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-4 px-6 border border-transparent text-base font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-600/20 shadow-lg shadow-indigo-600/10 transform active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-slate-100">
                        <span className="block text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
                            Demo Access
                        </span>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                onClick={() => setDemoCredentials('admin@gmail.com', 'admin123')}
                                className="flex flex-col items-center p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-100 transition-all group"
                            >
                                <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">Admin</span>
                            </button>
                            <button
                                onClick={() => setDemoCredentials('sabbir@gmail.com', 'student123')}
                                className="flex flex-col items-center p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-100 transition-all group"
                            >
                                <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600">Student</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
