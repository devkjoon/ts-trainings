import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Tools/Navbar";

import ProtectedRoute from "./components/Tools/ProtectedRoute";

import Home from "./pages/Home";
import Admin from "./pages/Admin/Admin"
import AdminLogin from "./pages/Admin/AdminLogin"
import AdminRegistration from "./pages/Admin/AdminRegistration"
import StudentLogin from './pages/Student/StudentLogin'
import AdminDashboard from "./pages/Admin/AdminDashboard"
import StudentList from './pages/Student/StudentList'
import Companies from './pages/Company/Companies'
import StudentDashboard from "./pages/Student/StudentDashboard"
import CourseList from './pages/Course/CourseList'
import CourseDetail from './pages/Course/CourseDetail'
import ModuleDashboard from './pages/Module/ModuleDashboard';
import ModuleViewer from './pages/Module/ModuleViewer';

import './App.css'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='/admin' element={<Admin />} />
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/admin/registration' element={<AdminRegistration />} />
          <Route path='/admin/dashboard' element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path='/admin/students' element={<StudentList />} />
          <Route path='/admin/courses' element={<CourseList />} />  
          <Route path='/admin/courses/:courseId' element={<CourseDetail />} />  
          <Route path='/admin/companies' element={<Companies />} />
          <Route path='/student/login' element={<StudentLogin />} />
          <Route path='/student/dashboard' element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
          <Route path='/student/courses/:courseId/modules' element={<ModuleDashboard />} />
          {/* <Route path='/student/courses' element={<StudentCourseDashboard />} /> */}
          <Route path='/student/courses/:courseId/modules/:moduleId' element={<ModuleViewer />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;