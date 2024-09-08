import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { connectDB } from "utils/connect";
import Question from "models/questionModel";
import QuestionSet from "models/questionSetModel";
import Profile from "models/profileModel";
import checkIsAuth from "utils/checkIsAuth";

export async function POST(req) {
	const { getUser, isAuthenticated } = getKindeServerSession();
	const _isAuthenticated = await isAuthenticated()
	if (!_isAuthenticated) {
		return NextResponse.json(
			{ error: "Wymagane uwierzytelnienie" },
			{ status: 401 }
		);
	}
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
		if (!profile.isOwner && !profile.isManage)
			return NextResponse.json({ error: "brak uprawnień" }, { status: 403 });

		const data = await req.json();

		const downloadedQuestions = await Question.find({
			_id: { $in: data.questions },
		});
		return NextResponse.json(
			{ questions: downloadedQuestions },
			{ status: 200 }
		);
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: "niespodziewny błąd" }, { status: 500 });
	}
}

export async function GET(req) {
	const { getUser, isAuthenticated } = getKindeServerSession();
	const _isAuthenticated = await isAuthenticated()
	if (!_isAuthenticated) {
		return NextResponse.json(
			{ error: "Wymagane uwierzytelnienie" },
			{ status: 401 }
		);
	}

	const moreReturn = req.nextUrl.searchParams.get("more") || "false";
	const allReturn = req.nextUrl.searchParams.get("all") || "false";

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

		const questionSets = await QuestionSet.find(
			{ createdBy: profile._id },
			{
				name: 0,
				organizationId: 0,
				randomQuestions: 0,
				createdAt: 0,
				updatedAt: 0,
				__v: 0,
			}
		);

		const questionIdsInSets = questionSets.reduce((acc, questionSet) => {
			return acc.concat(questionSet.questions);
		}, []);
		if (allReturn === "false") {
			if (moreReturn === "false") {
				return NextResponse.json(
					{ questionsId: questionIdsInSets },
					{ status: 200 }
				);
			} else if (moreReturn === "true") {
				const questions = await Question.find({
					createdBy: profile._id,
					_id: { $nin: questionIdsInSets },
				});
	
				return NextResponse.json({ questions }, { status: 200 });
			} else {
				return NextResponse.json({ error: "Błędne zapytanie" }, { status: 400 });
			}
		} else if (allReturn === "true") {
			if (moreReturn === "false") {
				return NextResponse.json(
					{ questionsId: questionIdsInSets },
					{ status: 200 }
				);
			} else if (moreReturn === "true") {
				const questions = await Question.find({
					createdBy: profile._id,
				});
	
				return NextResponse.json({ questions }, { status: 200 });
			} else {
				return NextResponse.json({ error: "Błędne zapytanie" }, { status: 400 });
			}
		}
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: "Niespodziewany błąd" }, { status: 500 });
	}
}
export async function PATCH(req) {
	const { getUser, isAuthenticated } = getKindeServerSession();
	const _isAuthenticated = await isAuthenticated()
	if (!_isAuthenticated) {
		return NextResponse.json(
			{ error: "Wymagane uwierzytelnienie" },
			{ status: 401 }
		);
	}
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
		if (!profile.isOwner && !profile.isManage)
			return NextResponse.json({ error: "brak uprawnień" }, { status: 403 });

		const { updatedQuestionSets } = await req.json();

		for(let activeIndex in updatedQuestionSets) {
			const updatedQuestionSet = updatedQuestionSets[activeIndex]
			console.log(updatedQuestionSet, "i jak")
			await QuestionSet.findByIdAndUpdate(updatedQuestionSet.questionSetId, {  questions: updatedQuestionSet.questions }, { new: true })
		}

		return NextResponse.json({ message: "zapisano" }, { status: 200 });
	} catch(err) {
		console.error(err)
		return NextResponse.json({ error: "Niespodziewany błąd"}, { status: 500 })
	}
}