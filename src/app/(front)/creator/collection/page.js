'use server'

import MaxWidthWrapper from "@/components/maxWidthWrapper";
import { CanvasRevealBoxWithoutBorder } from "@/components/CanvasRevealBoxWithoutBorder";
import DragBox from "./dragBox";
import CollectionManagment from "./collectionManagment"
import { connectDB } from "utils/connect";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import Profile from "models/profileModel";
import QuestionSet from "models/questionSetModel";
import { redirect } from "next/navigation";


export default async function page() {
	const { getUser, isAuthenticated } = getKindeServerSession();
	const _isAuthenticated = await isAuthenticated()
	if (!_isAuthenticated) {
		redirect("/createAccount");
	}
	const user = await getUser()
	await connectDB();
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
        redirect("/createAccount");
	}
	const getQuestionSet = async () => {
		try {
			const questionSets = await QuestionSet.find(
				{ createdBy: profile._id },
				{ createdAt: 0, updatedAt: 0, __v: 0 }
			);
			const updatedQuestionSets = questionSets.map((item) => {
				const itemObject = item.toObject();
				return {
					...itemObject,
					questions: Array.isArray(itemObject.questions)
						? itemObject.questions.length
						: 0,
					questionsList: itemObject.questions,
				};
			});
			return JSON.parse(JSON.stringify({
				dataQuestionSet: updatedQuestionSets,
				isDownloadededQuestionSet: true,
			}))
		} catch (err) {
			console.error(err);
		}
	};
	const { dataQuestionSet, isDownloadededQuestionSet } = await getQuestionSet();
	return (
		<div>
			<section className="w-full">
				<CanvasRevealBoxWithoutBorder
					colors={[
						[3, 252, 40],
						[3, 252, 194],
					]}>
					<MaxWidthWrapper className="py-10 flex justify-between items-center">
						<h1 className="xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl text-xl">
							Menedżer zbiorów
						</h1>
					</MaxWidthWrapper>
				</CanvasRevealBoxWithoutBorder>
			</section>
			<div className="w-full">
				<MaxWidthWrapper>
					{/* <DragBox
						_dataQuestionSet={dataQuestionSet}
						dataQuestionSetLength={dataQuestionSet.length}
						isDownloadededQuestionSet={isDownloadededQuestionSet}
					/> */}
					<CollectionManagment questionSetData={dataQuestionSet}/>
				</MaxWidthWrapper>
			</div>
		</div>
	);
}
