import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Auth & Layouts
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layout/MainLayout';
import StudentLayout from './layout/StudentLayout';

// Shared / Common Pages
import DashboardHome from './pages/Dashboard/DashboardHome';
import StudentDashboard from './pages/Dashboard/StudentDashboard';
import Profile from './pages/Profile/Profile';

// Admin Specific Pages
import ClassList from './pages/Academic/ClassList';
import SectionList from './pages/Academic/SectionList';
import SubjectList from './pages/Academic/SubjectList';
import AddStudent from './pages/Students/AddStudent';
import StudentList from './pages/Students/StudentList';
import AddRoutine from './pages/Routine/AddRoutine';
import RoutineList from './pages/Routine/RoutineList';
import AddExam from './pages/Exam/AddExam';
import ExamList from './pages/Exam/ExamList';
import AddResult from './pages/Result/AddResult';
import ResultList from './pages/Result/ResultList';
import AddNotice from './pages/Notice/AddNotice';
import NoticeList from './pages/Notice/NoticeList';
import AddStudyGuide from './pages/StudyGuide/AddStudyGuide';
import StudyGuideList from './pages/StudyGuide/StudyGuideList';
import AddFee from './pages/Fee/AddFee';
import FeeList from './pages/Fee/FeeList';
import LeaveList from './pages/Leave/LeaveList';
import CreateAdmin from './pages/Admin/CreateAdmin';
import AdminList from './pages/Admin/AdminList';
import UpdateAdmin from './pages/Admin/UpdateAdmin';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Admin & SuperAdmin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'superadmin']} />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/create-admin" element={<CreateAdmin />} />
              <Route path="/admin-list" element={<AdminList />} />
              <Route path="/admin/edit/:id" element={<UpdateAdmin />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/academic/classes" element={<ClassList />} />
              <Route path="/academic/sections" element={<SectionList />} />
              <Route path="/academic/subjects" element={<SubjectList />} />
              <Route path="/students" element={<StudentList />} />
              <Route path="/students/add" element={<AddStudent />} />
              <Route path="/routine" element={<RoutineList />} />
              <Route path="/routine/add" element={<AddRoutine />} />
              <Route path="/exams" element={<ExamList />} />
              <Route path="/exams/add" element={<AddExam />} />
              <Route path="/results" element={<ResultList />} />
              <Route path="/results/add" element={<AddResult />} />
              <Route path="/notices" element={<NoticeList />} />
              <Route path="/notices/add" element={<AddNotice />} />
              <Route path="/study-guides" element={<StudyGuideList />} />
              <Route path="/study-guides/add" element={<AddStudyGuide />} />
              <Route path="/fees" element={<FeeList />} />
              <Route path="/fees/add" element={<AddFee />} />
              <Route path="/leaves" element={<LeaveList />} />
            </Route>
          </Route>

          {/* Student Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route element={<StudentLayout />}>
              <Route path="/dashboard" element={<StudentDashboard />} />
              <Route path="/student/routine" element={<RoutineList />} /> {/* Temporary: Use same component */}
              <Route path="/student/exams" element={<ExamList />} />
              <Route path="/student/results" element={<ResultList />} />
              <Route path="/student/study-guides" element={<StudyGuideList />} />
              <Route path="/student/fees" element={<FeeList />} />
              <Route path="/student/leaves" element={<LeaveList />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>

          {/* Fallback for unauthorized access or wrong path */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
