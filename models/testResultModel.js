import mongoose from "mongoose";

const testResultSchema  = new mongoose.Schema(
	{
        testId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Test',
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        answers: [{
            questionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Question',
                required: true
            },
            answer: {
                type: String,
                required: true
            },
            isCorrect: {
                type: Boolean,
                required: true
            }
        }],
        score: {
            type: Number,
            required: true
        },
        completedAt: {
            type: Date,
            default: Date.now
        }
    }, { timestamps: true });

const TestResult = mongoose.models.TestResult || mongoose.model("TestResult", testResultSchema);

export default TestResult;
