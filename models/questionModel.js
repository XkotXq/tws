import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
	{
		text: String,
		options: [String],
		correctOption: String,
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Profile"
		},
		organizationId: {
			type: String,
			// ref: "Organization"
		},
		randomAnswers: {
			type: Boolean,
			default: true
		}
	},
	{
		timestamps: true,
	}
);

const Question = mongoose.models.Question || mongoose.model("Question", questionSchema);

export default Question;
