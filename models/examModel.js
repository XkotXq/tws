import mongoose from "mongoose";

const examModel = new mongoose.Schema({
   title: {
      type: String,
      required: true
  },
  questions: [{
      question: String,
      options: [String],
      answer: String
  }],
  createdAt: {
      type: Date,
      default: Date.now
  },
  startsAt: {
      type: Date,
      required: true
  },
  createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: true
  }
})


   const Exam = mongoose.models.Exam || mongoose.model("Exam", examModel)

   export default Exam