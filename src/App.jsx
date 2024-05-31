import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import GenerateCode from "./pages/GenerateCode"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='GenerateCode' element={<GenerateCode />} />
      </Routes>
    </BrowserRouter>
  );
}