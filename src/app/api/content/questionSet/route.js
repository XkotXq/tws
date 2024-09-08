import { NextResponse } from "next/server";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { connectDB } from "../../../../../utils/connect";
import QuestionSet from "../../../../../models/questionSetModel"
import Profile from "models/profileModel";
import mongoose from "mongoose"


export async function GET() {
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
        const questionSets = await QuestionSet.find({createdBy: profile._id}, { createdAt: 0, updatedAt: 0, __v: 0 })
        const updatedQuestionSets = questionSets.map(item => {
            const itemObject = item.toObject();
            return {
                ...itemObject,
                questions: Array.isArray(itemObject.questions) ? itemObject.questions.length : 0,
                questionsList: itemObject.questions
            };
        });
        return NextResponse.json(
			{ data: { questionSets: updatedQuestionSets} },
			{ status: 200 }
		);

    } catch(err) {
        console.error(err)
        return NextResponse.json(
			{ error: "niespodziewny błąd" },
			{ status: 500 }
		);
    }
}
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
        console.log(profile.organizationId, "pokaż")
        if (!profile.isOwner && !profile.isManage) return NextResponse.json(
            { error: "brak uprawnień" },
			{ status: 403 }
		);
        
        const data = await req.json()
        console.log(data, "data")
        const {organizationId, _id} = profile
        const newQuestionSet = new QuestionSet ({
            name: data.name,
            createdBy: _id,
            organizationId: organizationId,
            randomQuestions: data.randomQuestions
        })
        await newQuestionSet.save()
        return NextResponse.json(
			{ message: "Stworzono zbiór pytań", data: {name: data.name, id:newQuestionSet._id, questions: 0} },
			{ status: 201 }
		);
    } catch (err) {
        console.error(err)
        return NextResponse.json(
			{ error: "niespodziewny błąd" },
			{ status: 500 }
		);
    }
}
