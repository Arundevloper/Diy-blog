import React, { useState,useEffect } from "react";
import Layout from "../Layouts/Layout";
import "../Css/addExperiment.css";
import { toast } from "react-hot-toast";
import axios from "axios";

function AddExperiment() {
  // State variables for form fields
  const [experimentName, setExperimentName] = useState("");
  const [oneLineDescription, setOneLineDescription] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [materialsList, setMaterialsList] = useState([
    { name: "", quantity: "" },
  ]);
  const [newTag, setNewTag] = useState("");
  const [safetyPrecautions, setSafetyPrecautions] = useState("");
  const [categoryTags, setCategoryTags] = useState([]);
  const [steps, setSteps] = useState([
    { stepNumber: 1, image: "", stepDescription: "" },
  ]);
  const [mainImage, setSelectedImage] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");

  // Function to handle form submission
const handleSubmit = async (e) => {
  e.preventDefault();
console.log(steps);
  try {
    const formData = new FormData();

    formData.append("experimentName", experimentName);
    formData.append("oneLineDescription", oneLineDescription);
    formData.append("difficultyLevel", difficultyLevel);
    formData.append("subject", selectedSubject);
    formData.append("safetyPrecautions", safetyPrecautions);
    formData.append("categoryTags", JSON.stringify(categoryTags));

    // Append materialsList as JSON string
    formData.append("materialsList", JSON.stringify(materialsList));

    // Append each step as a separate field
   steps.forEach((step, index) => {
     const stepNumber = index + 1;
     // Append step number, step description, and image to formData
     formData.append(`step[${index}][stepNumber]`, stepNumber);
     formData.append(`step[${index}][stepDescription]`, step.stepDescription);
     formData.append(`step[${index}][image]`, step.image);
   });

    // Append mainImage
    formData.append("mainImage", mainImage);

    const response = await axios.post(
      "/api/v1/experiment/saveExperimentData",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );


      toast.success("Experiment saved successfully");
  } catch (error) {
    console.error("Error saving experiment:", error);
    // Handle error, show an error message to the user
  }
};


 useEffect(() => {
   const fetchSubjects = async () => {
     try {
       const response = await axios.get("/api/v1/experiment/subjects");
       setSubjects(response.data);
     } catch (error) {
       console.error("Error fetching subjects:", error);
     }
   };

   fetchSubjects();
 }, []);


  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  // Function to handle file input change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
  };

  // Function to add a new tag
  const handleAddTag = () => {
    if (newTag.trim() !== "") {
      setCategoryTags([...categoryTags, newTag.trim()]);
      setNewTag(""); // Clear the input field
    }
  };

  return (
    <>
      <div className="container add my-3">
        <div className="d-flex justify-content-center">
          <label className="form-label">Add Experiments</label>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Experiment Name:</label>
            <input
              type="text"
              className="form-control"
              value={experimentName}
              onChange={(e) => setExperimentName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">One Line Description:</label>
            <input
              type="text"
              className="form-control"
              value={oneLineDescription}
              onChange={(e) => setOneLineDescription(e.target.value)}
            />
          </div>
          <div className="row mb-3">
            <div className="col">
              <label className="form-label">Difficulty Level:</label>
              <input
                type="text"
                className="form-control"
                value={difficultyLevel}
                onChange={(e) => setDifficultyLevel(e.target.value)}
              />
            </div>
            <div className="col">
              <label className="form-label">Subject:</label>
              <select
                className="form-control"
                value={selectedSubject}
                onChange={handleSubjectChange}
              >
                <option value="">Select Subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject.subjects}>
                    {subject.subjects}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">Image:</label>
            <input
              type="file"
              className="form-control"
              onChange={handleImageChange}
            />
            {mainImage && (
              <div className="d-flex justify-content-center mt-2">
                <img
                  src={URL.createObjectURL(mainImage)}
                  alt="Selected Preview"
                  className="img-fluid mt-2"
                  style={{ maxWidth: "100px" }}
                />
              </div>
            )}
          </div>
          <div className="mb-3">
            <label className="form-label">Materials List:</label>
            {materialsList.map((material, index) => (
              <div key={index} className="row">
                <div className="col">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Name"
                    value={material.name}
                    onChange={(e) => {
                      const newList = [...materialsList];
                      newList[index].name = e.target.value;
                      setMaterialsList(newList);
                    }}
                  />
                </div>
                <div className="col">
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Quantity"
                    value={material.quantity}
                    onChange={(e) => {
                      const newList = [...materialsList];
                      newList[index].quantity = e.target.value;
                      setMaterialsList(newList);
                    }}
                  />
                </div>
                <div className="col-auto align-self-center">
                  <button
                    type="button"
                    className="btn btn-outline-danger mb-2"
                    onClick={() => {
                      const newList = [...materialsList];
                      newList.splice(index, 1);
                      setMaterialsList(newList);
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              className="btn btn-outline-primary mb-2"
              onClick={() =>
                setMaterialsList([...materialsList, { name: "", quantity: "" }])
              }
            >
              Add Material
            </button>
          </div>

          <div className="mb-3">
            <label className="form-label">Steps:</label>
            {steps.map((step, index) => (
              <div key={index} className="mb-2">
                <div className="row mb-2">
                  <div className="col">
                    <label className="form-label">Image:</label>
                    <input
                      type="file"
                      className="form-control"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        const newSteps = [...steps];
                        newSteps[index].image = file;
                        setSteps(newSteps);
                      }}
                    />
                  </div>
                  {step.image && (
                    <div className="col-auto align-self-center">
                      <img
                        src={URL.createObjectURL(step.image)}
                        alt={`Step ${index + 1}`}
                        style={{ maxWidth: "100px", maxHeight: "100px" }}
                      />
                    </div>
                  )}
                </div>
                <div className="row mb-2">
                  <div className="col">
                    <label className="form-label">Description:</label>
                    <textarea
                      className="form-control"
                      value={step.stepDescription}
                      onChange={(e) => {
                        const newSteps = [...steps];
                        newSteps[index].stepDescription = e.target.value;
                        setSteps(newSteps);
                      }}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-auto ms-auto">
                    <button
                      className="btn btn-outline-danger"
                      type="button"
                      onClick={() => {
                        const newSteps = [...steps];
                        newSteps.splice(index, 1);
                        setSteps(newSteps);
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="row">
              <div className="col-auto">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() =>
                    setSteps([...steps, { image: null, stepDescription: "" }])
                  }
                >
                  Add Step
                </button>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Safety Precautions:</label>
            <textarea
              className="form-control"
              value={safetyPrecautions}
              onChange={(e) => setSafetyPrecautions(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Category Tags:</label>

            {categoryTags.map((tag, index) => (
              <div key={index} className="input-group mb-2  ">
                <div className="input-group-text">{tag}</div>
                <button
                  className="btn btn-outline-danger"
                  type="button"
                  onClick={() => {
                    const newTags = [...categoryTags];
                    newTags.splice(index, 1);
                    setCategoryTags(newTags);
                  }}
                >
                  &times;
                </button>
              </div>
            ))}
            <div className="input-group mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="Category Tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={handleAddTag}
              >
                Add Tag
              </button>
            </div>
          </div>
          <div className="d-flex justify-content-center">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AddExperiment;
