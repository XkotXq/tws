import { NextResponse } from "next/server";
import {getKindeServerSession} from "@kinde-oss/kinde-auth-nextjs/server";
import { connectDB } from "utils/connect";
import QuestionSet from "models/questionSetModel"
import Question from "models/questionModel"
import Profile from "models/profileModel";


export async function DELETE(req, {params}) {
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
        const { id } = params;
        console.log(id, "test")
        const questionSet = await QuestionSet.findOne({ _id: id}, {})

        const questionsForDelete = questionSet.questions || []
        const qsresult = await QuestionSet.deleteOne({ _id: id })
        await Question.deleteMany({
            _id: { $in: questionsForDelete }
        });
        
        if (qsresult.deletedCount === 0) {
            return NextResponse.json(
                { error: "Zbiór nie znaleziony" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Pomyślnie usunięto zbiór" },
            { status: 200 }
        );


    } catch (err) {
        console.error(err)
        return NextResponse.json(
			{ error: "niespodziewny błąd" },
			{ status: 500 }
		);
    }


}
