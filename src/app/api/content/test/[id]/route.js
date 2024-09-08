import { NextResponse } from "next/server";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { connectDB } from "../../../../../../utils/connect";
import QuestionSet from "../../../../../../models/questionSetModel"
import Test from "models/testModel";

import Profile from "models/profileModel";
import Question from "models/questionModel";


export async function GET(req, {params}) {
    const { getUser, isAuthenticated } = getKindeServerSession()
    const _isAuthenticated = await isAuthenticated()
    if (!_isAuthenticated) {
        return NextResponse.json(
            { error: "Wymagane uwierzytelnienie" },
			{ status: 401 }
		);
	}

	const moreReturn = req.nextUrl.searchParams.get("more") || "false";

    try {
        await connectDB()
        const user = await getUser()
        const profile = await Profile.findOne({ kindeId: user.id}, {email: 0, firstName: 0, lastName: 0, savedTests: 0, activeTests: 0, endedTests: 0, createdAt: 0, updatedAt: 0 })
        if (!profile.isOwner && !profile.isManage) return NextResponse.json(
            { error: "brak uprawnień" },
			{ status: 403 }
		);
        const { id } = params;
        const test = await Test.findOne(
			{ createdBy: profile._id, _id: id },
			{
				organizationId: 0,
				isActive: 0,
				autoActivate: 0,
				createdAt: 0,
				updatedAt: 0,
				__v: 0,
			}
		);
        
        
        if(moreReturn === "false") {
            return NextResponse.json({ test }, { status: 200 });
        } else if (moreReturn === "true") {
            const questionSets = await QuestionSet.find({ _id: {$in: test.questionSets}})
            const allQuestionIdsInQuestionSets = questionSets.flatMap(_questionSet => _questionSet.questions)
            const questions = await Question.find({ _id: {$in: [...allQuestionIdsInQuestionSets, ...test.questions]}}, { options: 0, correctOption: 0, createdBy: 0, organizationId: 0, __v:0, createdAt: 0, updatedAt: 0 })
            function replaceQuestionsInQuestionSets(questionIds) {
                const replacedQuestions = questions.filter((_question) =>
                    questionIds.includes(_question._id)
                );
                return replacedQuestions;
            }
            const transformedQuestionSets = questionSets.map(_questionSet => ({
                _id: _questionSet._id,
                name: _questionSet.name,
                questions: replaceQuestionsInQuestionSets(_questionSet.questions)
            }))
            
            
            const transformedTest = {
                _id: test._id,
                name: test.name,
                description: test.description,
                questions: questions.filter(
                    _question => test.questions.includes(_question._id.toString()) ||
                                 allQuestionIdsInQuestionSets.includes(_question._id.toString())
                ),
                questionSets: transformedQuestionSets,
                createdBy: test.createdBy
            }
            return NextResponse.json({ test: transformedTest }, { status: 200 });
        } else {
            return NextResponse.json({ error: "Błędne zapytanie" }, { status: 400 });
        }



    } catch (err) {
        console.error(err)
        return NextResponse.json(
			{ error: "niespodziewny błąd" },
			{ status: 500 }
		);
    }
}