import express from "express";
import {
  saveExperimentData,
  reteriveExperimentList,
  retrieveOnlyOne,
  saveTheclaps,
  fetchExperimentMainImageById,
  fetchExperimentStepImageById,
  getViewsAndClapsCount,
  updateExperimentData,
  addSubject,
  getSubjects,
  addCategory,
  getCategories,
  sortInteractionsByViewsAndClaps,
  sortInteractionsByCategory,
} from "../controllers/experimentController.js";
import formidable from "express-formidable";
const router = express.Router();



// Route to save experiment date
router.post("/saveExperimentData", formidable(),saveExperimentData);


// Route to save experiment date
router.put("/updateExperimentData/:id",formidable(),updateExperimentData);


// Route to Reterive Experiment list
router.get("/experimentList", reteriveExperimentList);


// Route to fetch main image of an experiment by ID
router.get('/experiment-image/:experimentId', fetchExperimentMainImageById);

// Route to fetch a step image of an experiment by ID and step index
router.get('/experiment/:experimentId/step-image/:stepIndex', fetchExperimentStepImageById);

// Route to retrieve all experiment data
router.get("/retrieveOnlyOne/:id", retrieveOnlyOne);

// Route to retrieve all experiment data
router.get("/viewsAndClaps/:id", getViewsAndClapsCount);

// Route to save a clap
router.post("/saveTheclaps/:id", saveTheclaps);


// Route to save a clap
router.post("/saveTheclaps/:id", saveTheclaps);


// Route to save a clap
router.post("/saveTheclaps/:id", saveTheclaps);

// Subject routes
router.post('/subjects', addSubject);
router.get('/subjects', getSubjects);

// Category routes
router.post('/diycategories', addCategory);
router.get('/diycategories', getCategories);

//Sort by views and clap
router.get("/sortbyViewsClap", sortInteractionsByViewsAndClaps);


//Sort by views and clap
router.get("/filterByCategory/:category", sortInteractionsByCategory);



export default router;
