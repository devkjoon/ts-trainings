import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Admin from "./pages/Admin"
import AdminLogin from "./components/AdminLogin"
import AdminRegistration from "./components/AdminRegistration"
import StudentLogin from './components/StudentLogin'
import AdminDashboard from "./pages/AdminDashboard"
import NewStudent from "./components/NewStudent"
import StudentList from './components/StudentList'
import StudentDashboard from "./pages/StudentDashboard"

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
          <Route path='/student/login' element={<StudentLogin />} />
          <Route path='/admin/dashboard' element={<AdminDashboard />} />
          <Route path='/admin/new-student' element={<NewStudent />} />
          <Route path='/admin/students' element={<StudentList />} />
          <Route path='/student/dashboard' element={<StudentDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;