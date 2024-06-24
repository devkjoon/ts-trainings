import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Admin from "./pages/Admin"
import AdminLogin from "./components/AdminLogin"
import AdminRegistration from "./components/AdminRegistration"
import StudentLogin from './components/StudentLogin'
import Dashboard from "./pages/Dashboard"
import NewStudent from "./components/NewStudent"
import StudentList from './components/StudentList'

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
          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/new-student' element={<NewStudent />} />
          <Route path='/admin/students' element={<StudentList />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;