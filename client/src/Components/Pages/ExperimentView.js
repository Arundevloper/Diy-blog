import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../Layouts/Layout";
import { useParams } from "react-router-dom";
import "../Css/viewExperiment.css"; 
import toast from "react-hot-toast";


function BlogPage() {
  const [experiment, setExperiment] = useState({});
  const [interaction, setInteraction] = useState({});
  const { eid } = useParams();

  useEffect(() => {
    const fetchExperiment = async () => {
   
      try {
        const response = await axios.get(
          `/api/v1/experiment/retrieveOnlyOne/${eid}`
        );
        setExperiment(response.data.experiment);
        setInteraction(response.data.interaction);
      } catch (error) {
        console.error("Error fetching experiment:", error);
      }
    };


    fetchExperiment();
  }, []);

const fetchViewsAndClapsCount = async () => {
  try {
    const response = await axios.get(`/api/v1/experiment/viewsAndClaps/${eid}`);
     setInteraction(response.data.interaction);
  } catch (error) {
    console.error("Error fetching views and claps count:", error);
    throw error; 
  }
};




  // Function to handle claps
const handleClap = async (eid) => {
  try {
    const hasClapped = localStorage.getItem(`clapped_${eid}`);

    if (!hasClapped) {
      const response = await axios.post(
        `/api/v1/experiment/saveTheclaps/${eid}`
      );
      setInteraction((prevInteraction) => ({
        ...prevInteraction,
        clap: response.data.claps,
      }));
      localStorage.setItem(`clapped_${eid}`, true);
      console.log("seucces");
      toast.success("You clapped!");
      fetchViewsAndClapsCount();
    } else {
      toast.error("You have already clapped!");
      console.log("failesd");
    }
  } catch (error) {
    console.error("Error clapping:", error);
  }
};

  // Function to make a portion of the step description bold
  const makeDescriptionBold = (description) => {
    const dotIndex = description.indexOf(":");
    const boldPart = description.slice(0, dotIndex + 1);
    const regularPart = description.slice(dotIndex + 1);
    return (
      <>
        <b className="desc-bold">{boldPart}</b>
        {regularPart}
      </>
    );
  };

  const renderSentencesAsList = (text) => {
   
    if(text==null){
      return;
    }
    const sentences = text.split(".");
    return (
      <ul>
        {sentences.map(
          (sentence, index) =>
            // Skip empty sentences
            sentence.trim() && <li key={index}>{`${sentence.trim()}.`}</li>
        )}
      </ul>
    );
  };

  return (
    <Layout title="Experiment Blog">
      <div className="container  viewExperiment my-3 ">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h3>{experiment.experimentName}</h3>
            <p>{experiment.oneLineDescription}</p>
            <img
              src={`/api/v1/experiment/experiment-image/${experiment._id}`}
              className="img-fluid rounded"
              alt={experiment.experimentName}
            />
            <div className="d-flex justify-content-between">
              <p className="view">Views: {interaction.views}</p>
              <p className="clap" onClick={() => handleClap(experiment._id)}>
                👏{interaction.claps}
              </p>
            </div>

            <h3>Materials Required</h3>
            <ul>
              {experiment.materialsList &&
                experiment.materialsList.map((material) => (
                  <li key={material._id}>
                    {material.name}: {material.quantity}
                  </li>
                ))}
            </ul>
            <h3>Safety Precautions</h3>

            {renderSentencesAsList(experiment.safetyPrecautions)}
            <h3>Steps</h3>
            {experiment.steps &&
              experiment.steps.map((step) => (
                <div key={step._id} className="mb-3">
                  <h4 className="highlight">Step {step.stepNumber}</h4>
                  <p>{makeDescriptionBold(step.stepDescription)}</p>
                  <img
                    src={`/api/v1/experiment/experiment/${
                      experiment._id
                    }/step-image/${step.stepNumber - 1}`}
                    alt={`Step ${step.stepNumber}`}
                    className="img-fluid"
                  />
                </div>
              ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default BlogPage;
