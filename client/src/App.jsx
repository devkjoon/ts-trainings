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
          <Route path='Admin' element={<Admin />} />
          <Route path='AdminLogin' element={<AdminLogin />} />
          <Route path='AdminRegistration' element={<AdminRegistration />} />
          <Route path='StudentLogin' element={<StudentLogin />} />
          <Route path='Dashboard' element={<Dashboard />} />
          <Route path='NewStudent' element={<NewStudent />} />
          <Route path='StudentList' element={<StudentList />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;