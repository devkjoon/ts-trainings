import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Admin from "./pages/Admin"
import AdminLogin from "./pages/AdminLogin"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='Admin' element={<Admin />} />
        <Route path='AdminLogin' element={<AdminLogin />} />
      </Routes>
    </BrowserRouter>
  );
}