import mongoose from "mongoose";

const stageSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		tests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Test" }],
		autoActivate: { type: Boolean, default: false },
		activationTime: { type: Date },
		deactivationTime: { type: Date },
        isActive: { type: Boolean, default: false },
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Profile",
			required: true,
		},
		organizationId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Organization",
			required: true,
		},
	},
	{ timestamps: true }
);

const Stage = mongoose.models.Stage || mongoose.model("Stage", stageSchema);
module.exports = Stage;
