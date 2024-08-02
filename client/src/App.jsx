import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Admin from "./pages/Admin"
import AdminLogin from "./components/Admin/AdminLogin"
import AdminRegistration from "./components/Admin/AdminRegistration"
import StudentLogin from './components/Student/StudentLogin'
import AdminDashboard from "./pages/AdminDashboard"
import NewStudent from "./components/Student/NewStudent"
import StudentList from './components/Student/StudentList'
import Contractors from './components//Contractor/Contractors'
import StudentDashboard from "./pages/StudentDashboard"
// import StudentCourseDashboard from './components/Student/StudentCourseDashboard'
import CourseList from './components/Course/CourseList'
import CourseDetail from './components/Course/CourseDetail'
import ModuleDashboard from './components/Course/ModuleDashboard';
import ModuleViewer from './components/Course/ModuleViewer';
import AdminTokenVerification from "./hooks/AdminTokenVerification";

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
          <Route path='/admin/new-student' element={<NewStudent />} />
          <Route path='/admin/students' element={<StudentList />} />
          <Route path='/admin/courses' element={<CourseList />} />  
          <Route path='/admin/courses/:courseId' element={<CourseDetail />} />  
          <Route path='/admin/contractors' element={<Contractors />} />
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