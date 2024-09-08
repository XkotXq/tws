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
        const data = await req.json()
        const filteredQuestions = data.questions.filter(item => item.correctOption != null)

        const convertedQuestions = filteredQuestions.map(item => {
            return {
                text: item.text,
                options: item.options,
                correctOption: item.options[item.correctOption],
                createdBy: profile._id,
                organizationId: profile.organizationId,
                randomAnswers: item.randomPositionKey
            }
        })
        const savedQuestions = await Question.insertMany(convertedQuestions)

        const convertedSavedQuestions = savedQuestions.map(item => item._id)

        if (data.questions.length > filteredQuestions.length) {
            const invalidQuestions = data.questions.filter(item => item.correctOption == null)
            return NextResponse.json(
                {
                    message: "niektóre pytania nie są poprawnie zrobione",
                    invalidQuestions: invalidQuestions,
                    correctQuestions: convertedSavedQuestions,
                },
                { status: 400}
            )
        }
        return NextResponse.json(
            {message: "dodano pytania",
            correctQuestions: convertedSavedQuestions,
            }, {status: 201}
        )

    } catch(err) {
        console.error(err)
        return NextResponse.json(
			{ error: "niespodziewny błąd" },
			{ status: 500 }
		);
    }
}