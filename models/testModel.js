import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String, default: ""},
		questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
		questionSets: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "QuestionSet" },
		],
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Profile",
		},
		organizationId: {
			type: String,
			// ref: "Organization",
		},
		isActive: { type: Boolean, default: false },
		autoActivate: { type: Boolean, default: false },
		// activationTime: { type: Date },
		// deactivationTime: { type: Date },
		// stages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stage" }],
	},
	{ timestamps: true }
);

const Test = mongoose.models.Test || mongoose.model("Test", testSchema);

export default Test;
