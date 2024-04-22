import mongoose from "mongoose";

// Define Experiment schema
const ExperimentSchema = new mongoose.Schema({
  experimentName: String,
  oneLineDescription: String,
  difficultyLevel: String,

  subject: [{ type: String }],

  mainImage: {
    data: Buffer,
    contentType: String,
  },
  materialsList: [
    {
      name: String,
      quantity: String,
    },
  ],
  safetyPrecautions: String,
  steps: [
    {
      stepNumber: Number,
      image: {
        data: Buffer,
        contentType: String,
      },
      stepDescription: String,
    },
  ],
  categoryTags: [{ type: String }],
});

// Create model
const Experiment = mongoose.model("Experiment", ExperimentSchema);

export default Experiment;
