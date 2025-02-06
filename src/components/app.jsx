import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login"; 
import Dashboard from "./dashboard"; 
import Categories from "./categories";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* ✅ Default is Login */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* ✅ Dashboard Page */}
        <Route path="/categories" element={<Categories />} /> {/* ✅ categories Page */}
      </Routes>
    </Router>
  );
}
