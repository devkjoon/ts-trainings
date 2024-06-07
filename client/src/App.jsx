import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import GenerateCode from "./pages/GenerateCode"
import Login from "./pages/Login"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='Login' element={<Login />} />
        <Route path='GenerateCode' element={<GenerateCode />} />
      </Routes>
    </BrowserRouter>
  );
}