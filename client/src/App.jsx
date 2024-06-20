import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Admin from "./pages/Admin"
import AdminLogin from "./pages/AdminLogin"

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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;