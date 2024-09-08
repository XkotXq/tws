import mongoose from "mongoose";


// const solvedExamsBadgesSchema = new mongoose.Schema({
//     1: { type: Boolean, default: false },
//     5: { type: Boolean, default: false },
//     10: { type: Boolean, default: false },
//     25: { type: Boolean, default: false },
//     50: { type: Boolean, default: false },
//     100: { type: Boolean, default: false }
// });

// const customBadgesSchema = new mongoose.Schema({
//     bugProspector: { type: Boolean, default: false },
//     helpInProject: { type: Boolean, default: false },
//     originator: { type: Boolean, default: false },
//     programmer: { type: Boolean, default: false },
//     otherMerits: { type: Boolean, default: false },
//     moreOtherMerits: { type: Boolean, default: false }
// });


const profileSchema = new mongoose.Schema(
    {
    kindeId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    isOwner: {
        type: Boolean,
        required: true,
        default: false
    },
    isManage: {
        type: Boolean,
        default: false
    },
    organizationId: {
        type: String,
        // ref: 'Organization',
        required: true
    },
    savedTests: {
        type: [String],
        default: []
    },
    activeTests: {
        type: [String],
        default: []
    },
    endedTests: {
        type: [String],
        default: []
    },
    // attachments: {
    //     solvedExamsBadges: solvedExamsBadgesSchema,
    //     customBadges: customBadgesSchema
    // }
},
{
    timestamps: true
}
)


const Profile = mongoose.models?.Profile || mongoose.model('Profile', profileSchema);

export default Profile