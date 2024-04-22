import React, { useState, useEffect } from "react";
import Layout from "../Layouts/Layout";
import "../Css/addExperiment.css";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams } from "react-router-dom";

function UpdateExperiment() {
  const [experiment, setExperiment] = useState(null);
  const [oneLineDescription, setOneLineDescription] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("");
  const [subject, setSubject] = useState("");
  const [materialsList, setMaterialsList] = useState([{ name: "", quantity: "" }]);
  const [mainImage, setMainImage] = useState(null);
  const [steps, setSteps] = useState([{ image: null, stepDescription: "" }]);
  const [safetyPrecautions, setSafetyPrecautions] = useState("");
  const [categoryTags, setCategoryTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const { eid } = useParams();

  useEffect(() => {
    fetchExperimentData();
  }, []);

  const fetchExperimentData = async () => {
    try {
      const response = await axios.get(`/api/v1/experiment/retrieveOnlyOne/${eid}`);
      setExperiment(response.data.experiment);
      setOneLineDescription(response.data.experiment.oneLineDescription);
      setDifficultyLevel(response.data.experiment.difficultyLevel);
      setSubject(response.data.experiment.subject);
      setMaterialsList(response.data.experiment.materialsList);
      setMainImage(response.data.experiment.mainImage);
      setSteps(response.data.experiment.steps);
      setSafetyPrecautions(response.data.experiment.safetyPrecautions);
      setCategoryTags(response.data.experiment.categoryTags);
    } catch (error) {
      console.error("Error fetching experiment data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // Append updated data to formData
      formData.append("experimentName", experiment.experimentName);
      formData.append("oneLineDescription", oneLineDescription);
      formData.append("difficultyLevel", difficultyLevel);
      formData.append("subject", subject);
      formData.append("safetyPrecautions", safetyPrecautions);
      formData.append("categoryTags", JSON.stringify(categoryTags));

      // Append materialsList as JSON string
      formData.append("materialsList", JSON.stringify(materialsList));

      // Append each step as a separate field
      steps.forEach((step, index) => {
        formData.append(`step[${index}][stepNumber]`, index + 1);
        formData.append(`step[${index}][stepDescription]`, step.stepDescription);
        formData.append(`step[${index}][image]`, step.image);
      });

      // Append mainImage
      formData.append("mainImage", mainImage);
console.log("this is "+eid);
      const response = await axios.put(
        `/api/v1/experiment/updateExperimentData/${eid}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Experiment updated successfully");
    } catch (error) {
      console.error("Error updating experiment:", error);
      toast.error("Failed to update experiment");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setMainImage(file);
  };

  const handleAddTag = () => {
    if (newTag.trim() !== "") {
      setCategoryTags([...categoryTags, newTag.trim()]);
      setNewTag(""); // Clear the input field
    }
  };

  return (
    <>
      <Layout title="Update Experiment">
        <div className="container add my-3">
          <div className="d-flex justify-content-center">
            <label className="form-label">Update Experiment</label>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Experiment Name:</label>
              <input
                type="text"
                className="form-control"
                value={experiment?.experimentName || ""}
                onChange={(e) =>
                  setExperiment({
                    ...experiment,
                    experimentName: e.target.value,
                  })
                }
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
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                >
                  <option value="">Select Subject</option>
                  <option value="Physics">Physics</option>
                  <option value="Maths">Maths</option>
                  <option value="Botany">Botany</option>
                  <option value="Zoology">Zoology</option>
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
           
                <div className="d-flex justify-content-center mt-2">
                  <img
                    src={`/api/v1/experiment/experiment-image/${eid}`}
                    alt="Selected Preview"
                    className="img-fluid mt-2"
                    style={{ maxWidth: "100px" }}
                  />
                </div>
              
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
                className="btn btn-outline-primary mb-2"
                onClick={() =>
                  setMaterialsList([
                    ...materialsList,
                    { name: "", quantity: "" },
                  ])
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
                  
                      <div className="col-auto align-self-center">
                        <img
                          src={`/api/v1/experiment/experiment/${
                            eid
                          }/step-image/${step.stepNumber - 1}`}
                          alt={`Step ${index + 1}`}
                          style={{ maxWidth: "100px", maxHeight: "100px" }}
                        />
                      </div>
                  
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
                Update
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
}

export default UpdateExperiment;
