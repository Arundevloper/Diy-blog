import mongoose from "mongoose";

const { Schema, model } = mongoose;

const diycategorySchema = new Schema({
  DIYCategory: 
    {
      type: String,
      required: true,
    },
  
});

const subjectSchema = new Schema({
  subjects: 
    {
      type: String,
      required: true,
    },
  
});

const Subject = model("Subject", subjectSchema);
const DIYCategory = model("Category", diycategorySchema);

export { Subject, DIYCategory };
