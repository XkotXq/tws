import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { connectDB } from "utils/connect";
import Question from "models/questionModel";
import QuestionSet from "models/questionSetModel";
import Profile from "models/profileModel";
import checkIsAuth from "utils/checkIsAuth";

export async function GET(req) {
	const { getUser, isAuthenticated } = getKindeServerSession();
	const _isAuthenticated = await isAuthenticated();
	if (!_isAuthenticated) {
		return NextResponse.json(
			{ error: "Wymagane uwierzytelnienie" },
			{ status: 401 }
		);
	}

	const lessOption = req.nextUrl.searchParams.get("less") || "";

	try {
		await connectDB();

		const user = await getUser();
		const profile = await Profile.findOne(
			{ kindeId: user.id },
			{
				email: 0,
				firstName: 0,
				lastName: 0,
				savedTests: 0,
				activeTests: 0,
				endedTests: 0,
				createdAt: 0,
				updatedAt: 0,
			}
		);
        
		if (!profile.isOwner && !profile.isManage) {
            return NextResponse.json({ error: "Brak uprawnień" }, { status: 400 });
		}
		let options = {}
		if( lessOption ) {
			options = {...options, options: 0, correctOption: 0, organizationId: 0, randomAnswers: 0, __v: 0, createdAt: 0, updatedAt: 0, createdBy: 0}
		}

        const questions = await Question.find({}, options);
        return NextResponse.json( questions , { status: 200 });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: "Niespodziewany błąd" }, { status: 500 });
	}
}
