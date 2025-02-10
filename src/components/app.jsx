import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login"; 
import Dashboard from "./dashboard"; 
import Categories from "./categories";
import Data from "./data";
import Products from './Products';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* ✅ Default is Login */}
        <Route path="/dashboard" element={<Dashboard />} /> {/* ✅ Dashboard Page */}
        <Route path="/categories" element={<Categories />} /> {/* ✅ categories Page */}
        <Route path="/data" element={<Data />} />
        <Route path="/product/:id" element={<Products />} />
      </Routes>
    </Router>
  );
}
