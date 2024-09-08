import { NextResponse } from "next/server";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { connectDB } from "../../../../../../utils/connect";
import QuestionSet from "../../../../../../models/questionSetModel"
import Question from "../../../../../../models/questionModel"
import Profile from "models/profileModel";
import checkIsAuth from "utils/checkIsAuth"


export async function POST(req) {
    const { getUser, isAuthenticated } = getKindeServerSession()
    await checkIsAuth(isAuthenticated)
    // const _isAuthenticated = await isAuthenticated()
    // if (!_isAuthenticated) {
    //     return NextResponse.json(
    //         { error: "Wymagane uwierzytelnienie" },
	// 		{ status: 401 }
	// 	);
	// }
    try {
        await connectDB()
        const user = await getUser()
        const profile = await Profile.findOne({ kindeId: user.id}, {email: 0, firstName: 0, lastName: 0, savedTests: 0, activeTests: 0, endedTests: 0, createdAt: 0, updatedAt: 0 })
        if (!profile.isOwner && !profile.isManage) return NextResponse.json(
            { error: "brak uprawnień" },
			{ status: 403 }
		);
        const { data } = await req.json()
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

        const updatedQuestionSet = await QuestionSet.findOneAndUpdate(
            { createdBy: profile._id, _id: data.id },
            { $addToSet: { questions: { $each: convertedSavedQuestions } } },
            { new: true, useFindAndModify: false }
          );
        
          console.log("Zaktualizowany QuestionSet:", updatedQuestionSet);
        if (data.questions.length > filteredQuestions.length) {
            const invalidQuestions = data.questions.filter(item => item.correctOption == null)
            return NextResponse.json(
                {
                    message: "niektóre pytania nie są poprawnie zrobione",
                    invalidQuestions: invalidQuestions,
                    correctQuestions: convertedSavedQuestions,
                    id: updatedQuestionSet._id
                },
                { status: 400}
            )
        }
        return NextResponse.json(
            {message: "dodano pytania do zbioru",
            correctQuestions: convertedSavedQuestions,
            id: updatedQuestionSet._id,
            questions: updatedQuestionSet.questions.length
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