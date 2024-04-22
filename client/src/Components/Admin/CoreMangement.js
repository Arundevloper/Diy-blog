import React, { useState, useEffect } from "react";
import axios from "axios";

function CoreMangement() {
  const [subjects, setSubjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    fetchSubjects();
    fetchCategories();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("/api/v1/experiment/subjects");
      setSubjects(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/v1/experiment/diycategories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddSubject = async () => {
    try {
      await axios.post("/api/v1/experiment/subjects", { name: newSubject });
      setNewSubject("");
    fetchSubjects();
    } catch (error) {
      console.error("Error adding subject:", error);
    }
  };

  const handleAddCategory = async () => {
    try {
      await axios.post("/api/v1/experiment/diycategories", {
        name: newCategory,
      });
      setNewCategory("");
      fetchCategories();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <div className="container core mt-5" style={{ width: "50%" }}>
      <div className="row">
        <div className="col">
          <h2>Add New Subject</h2>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="New Subject"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleAddSubject}>
              Add Subject
            </button>
          </div>
          <h2>Subjects</h2>
          <table className="table">
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject._id}>
                  <td>{subject.subjects}</td>{" "}
                  {/* Accessing 'subjects' property */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default CoreMangement;
