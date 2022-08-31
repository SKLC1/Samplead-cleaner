import mongoose from "mongoose";


const resumeScheme = new mongoose.Schema({
  room: {type: String}
})

export const Resume = mongoose.model('resume', resumeScheme)