import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Components/Pages/Home";
import AddExperiment from "./Components/Admin/AddExperiment";
import BlogPage from "./Components/Pages/ExperimentView";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import UpdateExperiment from  "./Components/Admin/UpdateExperiment";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddExperiment />} />
        <Route path="/blog-page/:eid" element={<BlogPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/update/:id" element={<UpdateExperiment />} />
        <Route
          path="/updateExperimentData/:eid"
          element={<UpdateExperiment />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
