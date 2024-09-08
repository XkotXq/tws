import mongoose from "mongoose";

const OrganizationSchema = new mongoose.Schema({
    organizationName: {
        type: String,
        required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    }],
    organizationId: {
        type: String,
        required: true,
        unique: true
    },
    tests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        default: []
    }],
    isOpenAccess: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
});

const Organization = mongoose.models.Organization || mongoose.model("Organization", OrganizationSchema)

export default Organization