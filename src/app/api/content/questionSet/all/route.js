import { NextResponse } from "next/server";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { connectDB } from "utils/connect";
import Question from "models/questionModel"
import Profile from "models/profileModel";
import checkIsAuth from "utils/checkIsAuth"

export async function POST(req) {
    const { getUser, isAuthenticated } = getKindeServerSession()
    const _isAuthenticated = await isAuthenticated()
	if (!_isAuthenticated) {
		return NextResponse.json(
			{ error: "Wymagane uwierzytelnienie" },
			{ status: 401 }
		);
	}
    try {
        await connectDB()
        const user = await getUser()
        const profile = await Profile.findOne({ kindeId: user.id}, {email: 0, firstName: 0, lastName: 0, savedTests: 0, activeTests: 0, endedTests: 0, createdAt: 0, updatedAt: 0 })
        if (!profile.isOwner && !profile.isManage) return NextResponse.json(
            { error: "brak uprawnień" },
			{ status: 403 }
		);
        const { questionsReference } = await req.json()

        const questions = await Question.find({
            _id: { $in: questionsReference }
        });
        console.log(questions, "pytania")
        return NextResponse.json(
			{ questions },
			{ status: 201 }
		);
    } catch(err) {
        console.error(err)
    }
}