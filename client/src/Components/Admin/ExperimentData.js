import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ExperimentData() {
  const [experimentNames, setExperimentNames] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/v1/experiment/experimentList");
      setExperimentNames(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleEdit = (experimentId) => {
    // Navigate to updateExperimentData page with experiment ID
    navigate(`/updateExperimentData/${experimentId}`);
  };

  return (
    <div className="container mt-5">
      <h2>Experiment data Table</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Experiment Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {experimentNames.map((experiment, index) => (
            <tr key={experiment._id}>
              <td>{index + 1}</td>
              <td>{experiment.experimentName}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleEdit(experiment._id)}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExperimentData;
