import React, { useEffect, useState } from "react";
import Layout from "../Layouts/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Css/home.css";

function Home() {
  const [experimentList, setExperimentList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchExperimentList();
  }, []);

  const fetchExperimentList = async () => {
    try {
      const response = await axios.get("/api/v1/experiment/experimentList");

      setExperimentList(response.data.data);
    } catch (error) {
      console.error("Error fetching experiment list:", error);
    }
  };

  const categories = [
    { label: "Chemisty", value: "chemistry" },
    { label: "Biology", value: "biology" },
    { label: "Optics", value: "optics" },
    { label: "Physics", value: "physics" },
  ];

  const handleSortByCategory = async (category) => {
    try {
      setSelectedCategory(category);
      const endpoint = `/api/v1/experiment/filterByCategory/${category}`;
      const response = await axios.get(endpoint);
  console.log(response.data);
  setExperimentList(response.data);
    } catch (error) {
      console.error("Error filtering experiments by category:", error);
    }
  };

  const handleSortByViews = async () => {
    try {
      const response = await axios.get("/api/v1/experiment/sortbyViewsClap");
      if (response) {
        console.log(response.data);
        setExperimentList(response.data);
      }
    } catch (error) {
      console.error("Error sorting interactions:", error);
    }
  };

  const handleView = (eid) => {
    navigate(`/blog-page/${eid}`);
  };

  return (
    <div>
      <Layout title="DIY Blogs">
        <div className="container home my-3">
          <div className="d-flex justify-content-center">
            <label className="form-label experimentName">
              Experiment Lists
            </label>
          </div>
          <div className="d-flex justify-content-end">
            <div className="btn-group my-4 " role="group" aria-label="Sort">
              <button
                type="button"
                className="btn  btn-outline-secondary"
                onClick={handleSortByViews}
              >
                Sort by Views and Claps
              </button>
            </div>
            <div className="btn-group my-4 ms-2" role="group" aria-label="Sort">
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {selectedCategory
                    ? `Filter by ${selectedCategory}`
                    : "Filter by Category"}
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  {categories.map(({ label, value }) => (
                    <li key={value}>
                      <button
                        className="dropdown-item"
                        onClick={() => handleSortByCategory(value)}
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="row row-cols-1 row-cols-md-3 g-4">
            {experimentList.map((experiment) => (
              <div className="col" key={experiment._id}>
                <div className="card">
                  <img
                    onClick={() => handleView(experiment._id)}
                    src={`/api/v1/experiment/experiment-image/${experiment._id}`}
                    className="card-img-top"
                    alt={experiment.experimentName}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{experiment.experimentName}</h5>
                    <div className="viewsandclap d-flex justify-content-between">
                      <p className="card-text">Views: {experiment.views}</p>
                      <p className="card-text">Claps: {experiment.claps}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </div>
  );
}

export default Home;
