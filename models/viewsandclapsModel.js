import mongoose from "mongoose";

const interactionSchema = new mongoose.Schema({
  experimentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Experiment",
  },
  views: {
    type: Number,
    default: 0,
  },
  claps: {
    type: Number,
    default: 0,
  },
});

const Interaction = mongoose.model("Interaction", interactionSchema);

export default Interaction;
