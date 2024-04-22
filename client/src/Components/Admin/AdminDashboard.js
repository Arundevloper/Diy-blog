import React, { useState } from "react";
import Layout from "../Layouts/Layout";
import AddExperiment from "./AddExperiment";
import ExperimentData from "./ExperimentData";
import CoreMangement from "./CoreMangement";

const AdminDashboard = () => {
  const [key, setKey] = useState("addExperiment"); // Updated state variable

  return (
    <Layout title="Admin Dashboard">
      <div className="container mt-4">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${key === "addExperiment" ? "active" : ""}`}
              onClick={() => setKey("addExperiment")}
            >
              Add Experiment
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${
                key === "experimentTable" ? "active" : ""
              }`}
              onClick={() => setKey("experimentTable")}
            >
              Experiment Table
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${key === "coreManagement" ? "active" : ""}`}
              onClick={() => setKey("coreManagement")}
            >
              Core Management
            </button>
          </li>
        </ul>
        <div className="tab-content mt-3">
          {key === "addExperiment" && <AddExperiment />}
          {key === "experimentTable" && <ExperimentData />}
          {key === "coreManagement" && <CoreMangement />}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
