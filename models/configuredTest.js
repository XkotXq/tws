import mongoose from "mongoose";

const configuredTest = new mongoose.Schema(
	{
		name: { type: String, required: true },
		test: [{ type: mongoose.Schema.Types.ObjectId, ref: "Test" }],
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
		isActive: { type: Boolean, default: false },
		autoActivate: { type: Boolean, default: false },
		activationTime: { type: Date },
		deactivationTime: { type: Date },
		// stages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Stage" }],
	},
	{ timestamps: true }
);

const ConfiguredTest = mongoose.models.ConfiguredTest || mongoose.model("ConfiguredTest", configuredTest);

export default ConfiguredTest;
