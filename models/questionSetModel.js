import mongoose from "mongoose";

const questionSetSchema = new mongoose.Schema(
	{
		name: {type: String},
		questions: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Question'
		  }],
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Profile",
		},
		organizationId: {
			type: String,
			// ref: "Organization",
		},
		randomQuestions: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

const QuestionSet =
	mongoose.models.QuestionSet ||
	mongoose.model("QuestionSet", questionSetSchema);

export default QuestionSet;
