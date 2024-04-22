import fs from "fs";
import Experiment from "../models/experimentModel.js";
import Interaction from "../models/viewsandclapsModel.js";
import { Subject, DIYCategory } from "../models/coreModel.js";




export const saveExperimentData = async (req, res) => {
  try {
    const { fields, files } = req;

    const { mainImage } = files;
    const stepsData = [];

    // Extract main experiment data
    const {
      experimentName,
      oneLineDescription,
      difficultyLevel,
      subject,
      materialsList,
      safetyPrecautions,
      categoryTags,
    } = fields;

    // Validate required fields
    if (
      !experimentName ||
      !oneLineDescription ||
      !difficultyLevel ||
      !subject ||
      !materialsList ||
      !safetyPrecautions ||
      !categoryTags
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Read main image file and convert to binary format
    const mainImageBuffer = fs.readFileSync(mainImage.path);

    // Process steps data
    let stepIndex = 0;
    while (fields[`step[${stepIndex}][stepNumber]`] !== undefined) {
      const stepNumber = fields[`step[${stepIndex}][stepNumber]`];
      const stepDescription = fields[`step[${stepIndex}][stepDescription]`];
      const stepImage = files[`step[${stepIndex}][image]`];

      // Read step image file and convert to binary format
      const stepImageBuffer = fs.readFileSync(stepImage.path);

      // Add step data to stepsData array
      stepsData.push({
        stepNumber,
        stepDescription,
        image: {
          data: stepImageBuffer,
          contentType: stepImage.mimetype,
        },
      });

      stepIndex++;
    }

    // Save the experiment data including steps to MongoDB
    const newExperiment = new Experiment({
      experimentName,
      oneLineDescription,
      difficultyLevel,
      subject,
      mainImage: {
        data: mainImageBuffer,
        contentType: mainImage.mimetype,
      },
      materialsList: JSON.parse(materialsList),
      safetyPrecautions,
      categoryTags: JSON.parse(categoryTags),
      steps: stepsData,
    });

    const savedExperiment = await newExperiment.save();

    res.status(201).json({
      success: true,
      message: "Experiment created successfully.",
      data: savedExperiment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const reteriveExperimentList = async (req, res) => {
  try {
    const experimentList = await Experiment.aggregate([
      {
        $lookup: {
          from: "interactions",
          localField: "_id",
          foreignField: "experimentId",
          as: "interactionData",
        },
      },
      {
        $project: {
          experimentName: 1,
          views: { $sum: "$interactionData.views" },
          claps: { $sum: "$interactionData.claps" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: experimentList,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};


//Update Experiment
export const updateExperimentData = async (req, res) => {
  try {
    const { id } = req.params;
    const { fields, files } = req;

    const { mainImage } = files;
    const stepsData = [];

    // Extract main experiment data
    const {
      experimentName,
      oneLineDescription,
      difficultyLevel,
      subject,
      materialsList,
      safetyPrecautions,
      categoryTags,
    } = fields;

    // Process steps data if provided
    let stepIndex = 0;
    while (fields[`step[${stepIndex}][stepNumber]`] !== undefined) {
      const stepNumber = fields[`step[${stepIndex}][stepNumber]`];
      const stepDescription = fields[`step[${stepIndex}][stepDescription]`];
      const stepImage = files[`step[${stepIndex}][image]`];

      if (stepImage) {
        const stepImageBuffer = fs.readFileSync(stepImage.path);

        // Add step data to stepsData array
        stepsData.push({
          stepNumber,
          stepDescription,
          image: {
            data: stepImageBuffer,
            contentType: stepImage.mimetype,
          },
        });
      } else {
        // If no step image provided, only update step description
        stepsData.push({
          stepNumber,
          stepDescription,
        });
      }

      stepIndex++;
    }

    // Find the existing experiment by ID
    const existingExperiment = await Experiment.findById(id);

    if (!existingExperiment) {
      return res.status(404).json({
        success: false,
        message: "Experiment not found.",
      });
    }

    // Update the experiment data including steps
    existingExperiment.experimentName =
      experimentName || existingExperiment.experimentName;
    existingExperiment.oneLineDescription =
      oneLineDescription || existingExperiment.oneLineDescription;
    existingExperiment.difficultyLevel =
      difficultyLevel || existingExperiment.difficultyLevel;
    existingExperiment.subject = subject || existingExperiment.subject;
    existingExperiment.materialsList = materialsList
      ? JSON.parse(materialsList)
      : existingExperiment.materialsList;
    existingExperiment.safetyPrecautions =
      safetyPrecautions || existingExperiment.safetyPrecautions;
    existingExperiment.categoryTags = categoryTags
      ? JSON.parse(categoryTags)
      : existingExperiment.categoryTags;
    if (mainImage) {
      // Read main image file and convert to binary format
      const mainImageBuffer = fs.readFileSync(mainImage.path);
      existingExperiment.mainImage = {
        data: mainImageBuffer,
        contentType: mainImage.mimetype,
      };
    }

    // Update steps if provided
    if (stepsData.length > 0) {
      existingExperiment.steps = stepsData;
    }

    const updatedExperiment = await existingExperiment.save();

    res.status(200).json({
      success: true,
      message: "Experiment updated successfully.",
      data: updatedExperiment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};



export const fetchExperimentMainImageById = async (req, res) => {
  try {
    const experimentId = req.params.experimentId;

    const experiment = await Experiment.findById(experimentId);

    if (!experiment || !experiment.mainImage || !experiment.mainImage.data) {
      return res.status(404).json({
        success: false,
        message: "Experiment or main image not found.",
      });
    }

    res.set("Content-Type", experiment.mainImage.contentType);
    res.status(200).send(experiment.mainImage.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while getting photo",
      error: error.message, // Return only error message to avoid exposing sensitive information
    });
  }
};



export const fetchExperimentStepImageById = async (req, res) => {
  try {
    const { experimentId, stepIndex } = req.params;

    // Validate experimentId and stepIndex
    if (!experimentId || !stepIndex || isNaN(stepIndex)) {
      return res.status(400).json({
        success: false,
        message: "Experiment ID and step index are required.",
      });
    }

    // Find experiment by ID and select only the steps field
    const experiment = await Experiment.findById(experimentId).select("steps");

    if (!experiment) {
      return res.status(404).json({
        success: false,
        message: "Experiment not found.",
      });
    }

    const step = experiment.steps[stepIndex];

    if (!step || !step.image) {
      return res.status(404).json({
        success: false,
        message: "Step image not found.",
      });
    }

    // Send step image binary data
    res.set("Content-Type", "image/jpeg"); 
    res.status(200).send(step.image.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};



export const retrieveOnlyOne = async (req, res) => {
  try {
    const { id } = req.params;

    const experiment = await Experiment.findById(id).select(
      "-mainImage -steps.image"
    );

    if (!experiment) {
      return res.status(404).json({ error: "Experiment not found" });
    }

    let interaction = await Interaction.findOne({ experimentId: id });

    if (!interaction) {
      interaction = new Interaction({ experimentId: id });
    }

    interaction.views++;

    await interaction.save();

    const { views, claps } = interaction;

    console.log("this is "+interaction);
    res.status(200).json({
      experiment: experiment,
      interaction: { views, claps },
    });
  } catch (error) {
    console.error("Error retrieving experiment data:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getViewsAndClapsCount = async (req, res) => {
  try {
    const { id } = req.params;

    const interaction = await Interaction.findOne({ experimentId: id });

    if (!interaction) {
      return res.status(404).json({ message: "Interaction not found" });
    }

    const { views, claps } = interaction;

    return res.json({interaction: { views, claps }});
  } catch (error) {
    console.error("Error fetching views and claps count:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};



export const saveTheclaps = async (req, res) => {
  try {
    const { id } = req.params;

    let interaction = await Interaction.findOne({ experimentId: id });

    if (!interaction) {
      return res.status(404).json({ message: "Interaction not found" });
    }

    interaction.claps++;
    await interaction.save();

    return res.json(interaction);
  } catch (error) {
    console.error("Error incrementing clap count:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// Add Subject
export const addSubject = async (req, res) => {
  const { name } = req.body;
  try {
    const newSubject = await Subject.create({ subjects: name });
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Subjects
export const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Category
export const addCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const newCategory = await DIYCategory.create({ DIYCategory: name });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Categories
export const getCategories = async (req, res) => {
  try {
    const diycategories = await DIYCategory.find();
    res.status(200).json(diycategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//Sort by view and claps
export const sortInteractionsByViewsAndClaps = async (req, res) => {
  try {
    // Fetch interactions from the database and populate the 'experimentId' field to retrieve experiment details
    const interactions = await Interaction.find({})
      .populate("experimentId", "experimentName") // Populate experimentName field from the Experiment model
      .exec();

    // Sort interactions by views and claps
    interactions.sort((a, b) => {
      if (!a.experimentId || !b.experimentId) {
        return 0; // If experimentId is null or undefined, consider them equal
      }
      if (a.views !== b.views) {
        return b.views - a.views;
      } else {
        return b.claps - a.claps;
      }
    });

    // Extract necessary fields (experiment id, name, views, claps) from sorted interactions
    const sortedInteractions = interactions.map((interaction) => ({
      _id: interaction.experimentId
        ? interaction.experimentId._id
        : null,
      experimentName: interaction.experimentId
        ? interaction.experimentId.experimentName
        : null,
      views: interaction.views,
      claps: interaction.claps,
    }));

    // Send the sorted interactions in the response
    res.json(sortedInteractions);
  } catch (error) {
    // Handle errors
    console.error("Error sorting interactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const sortInteractionsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    // Fetch interactions filtered by category
    const interactions = await Interaction.find({})
      .populate({
        path: "experimentId",
        match: { categoryTags: category }, // Filter experiments by category
        select: "_id experimentName", // Select required fields from experiment
        options: { sort: { views: -1, claps: -1 } }, // Sort experiments by views and claps
      })
      .exec();

    // Filter out interactions with no matching experiment
    const validInteractions = interactions.filter(
      (interaction) => interaction.experimentId !== null
    );

    // Extract necessary fields (experiment id, name, views, claps) from interactions
    const formattedInteractions = validInteractions.map((interaction) => ({
       _id: interaction.experimentId._id,
      experimentName: interaction.experimentId.experimentName,
      views: interaction.views,
      claps: interaction.claps,
    }));

    // Return the formatted interactions in the response
    res.json(formattedInteractions);
  } catch (error) {
    console.error("Error sorting interactions by category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};