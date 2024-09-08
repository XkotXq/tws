import { NextResponse } from "next/server";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { connectDB } from "utils/connect";
import Test from "models/testModel";
import Question from "models/questionModel";
import QuestionSet from "models/questionSetModel";
import Profile from "models/profileModel";

export async function POST(req) {
	const { getUser, isAuthenticated } = getKindeServerSession();
	const _isAuthenticated = await isAuthenticated();
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

		const newTest = new Test({
			...data,
			createdBy: profile._id,
			organizationId: profile.organizationId,
		});
		await newTest.save();
		return NextResponse.json({ message: "zapisano" }, { status: 200 });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: "niespodziewny błąd" }, { status: 500 });
	}
}

export async function GET(req) {
	const { getUser, isAuthenticated } = getKindeServerSession();
	const _isAuthenticated = await isAuthenticated();
	if (!_isAuthenticated) {
		return NextResponse.json(
			{ error: "Wymagane uwierzytelnienie" },
			{ status: 401 }
		);
	}

	const moreReturn = req.nextUrl.searchParams.get("more") || "false";

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

		const tests = await Test.find(
			{ createdBy: profile._id },
			{
				organizationId: 0,
				isActive: 0,
				autoActivate: 0,
				createdAt: 0,
				updatedAt: 0,
				__v: 0,
			}
		);
		if ( moreReturn === "false") {
			return NextResponse.json({ tests }, { status: 200 });
		} else if (moreReturn === "true" || moreReturn === "yes" || moreReturn === "t") {
			const allQurstionSetIds = tests.flatMap((test) => test.questionSets);
			const questionSets = await QuestionSet.find(
				{ _id: { $in: allQurstionSetIds } },
				{
					createdBy: 0,
					organizationId: 0,
					randomQuestions: 0,
					__v: 0,
					createdAt: 0,
					updatedAt: 0,
				}
			);
			const allQuestionIdsInQuestionSets = questionSets.flatMap(
				(_questionSet) => _questionSet.questions
			);
	
			const allQurstionIds = tests.flatMap((test) => test.questions);
			const questions = await Question.find(
				{ _id: { $in: [...allQurstionIds, ...allQuestionIdsInQuestionSets] } },
				{
					options: 0,
					correctOption: 0,
					createdBy: 0,
					organizationId: 0,
					randomAnswers: 0,
					__v: 0,
					createdAt: 0,
					updatedAt: 0,
				}
			);
	
			function replaceQuestionsInQuestionSets(questionIds) {
				const replacedQuestions = questions.filter((_question) =>
					questionIds.includes(_question._id)
				);
				return replacedQuestions;
			}
			const transformedQuestionSets = questionSets.map((_questionSet) => ({
				_id: _questionSet._id,
				name: _questionSet.name,
				questions: replaceQuestionsInQuestionSets(_questionSet.questions),
			}));
	
			function replaceQuestionSetsInTest(questionSetIds) {
				const replacedQuestionSets = transformedQuestionSets.filter(
					(_transformnedQuestionSet) =>
						questionSetIds.includes(_transformnedQuestionSet._id)
				);
				return replacedQuestionSets;
			}
			function replaceQuestionsInTest(questionIds) {
				const replacedQuestions = questions.filter((_question) =>
					questionIds.includes(_question._id)
				);
				return replacedQuestions;
			}
	
			const transformedTests = tests.map((_test) => ({
				_id: _test._id,
				name: _test.name,
				description: _test.description,
				questions: replaceQuestionsInTest(_test.questions),
				questionSets: replaceQuestionSetsInTest(_test.questionSets),
				createdBy: _test.createdBy,
			}));
			return NextResponse.json({ tests: transformedTests }, { status: 200 });
			
		} else {
			return NextResponse.json({ error: "Błędne zapytanie" }, { status: 400 });
		}

	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: "Niespodziewany błąd" }, { status: 500 });
	}
}
