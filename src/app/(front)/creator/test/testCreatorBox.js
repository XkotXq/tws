"use client";

import {
	BorderedBoxC,
	ButtonC,
	InputC,
	TextAreaC,
} from "@/components/customComponents";
import { Eye, Folder, HelpCircle, List, Trash03 } from "@untitled-ui/icons-react";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { TimeInput } from "@nextui-org/react";
import {
	parseAbsoluteToLocal,
	Time,
	ZonedDateTime,
} from "@internationalized/date";
import { useForm } from "react-hook-form";

export default function TestCreatorBox() {
	const [listQuestionSet, setListQuestionSet] = useState([]);
	const [activeQuestionSet, setActiveQuestionSet] = useState([]);
	const [activeQuestions, setActiveQuestions] = useState([]);
	const [isDownloadededQuestionSet, setIsDownloadedQuestionSet] =
		useState(false);
	const [activeStage, setActiveStage] = useState(1);
	const [formData, setFormData] = useState("");
	const [autoSwitchTestStartTime, setAutoSwitchTestStartTime] = useState(
		parseAbsoluteToLocal("2024-04-08T18:45:22Z")
	);
	const [autoSwitchTestEndTime, setAutoSwitchTestEndTime] = useState(
		parseAbsoluteToLocal("2024-04-08T18:45:22Z")
	);
	const [downloadedFreeQuestions, setDownloadedFreeQuestions] = useState([]);
	const [isDownloadedFreeQuestions, setIsDownloadedFreeQuestions] =
		useState(false);
	const {
		register,
		handleSubmit,
		watch,
		setError,
		clearErrors,
		formState: { errors },
	} = useForm();

	const numberOfActiveQuestions = activeQuestionSet.reduce(
		(total, activeId) => {
			const foundSet = listQuestionSet.find((set) => set._id === activeId);
			return total + (foundSet ? foundSet.questions : 0);
		},
		0
	);

	async function getQuestion() {
		try {
			const res = await fetch(
				"http://localhost:3000/api/content/questions?more=true",
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			if (!res.ok) {
				console.log("błąd");
				return;
			}
			const { questions } = await res.json();
			console.log(questions);
			setDownloadedFreeQuestions(questions);
			setIsDownloadedFreeQuestions(true);
		} catch (err) {
			console.error(err);
		}
	}

	const getQuestionSet = async () => {
		try {
			const req = await fetch("http://localhost:3000/api/content/questionSet", {
				method: "GET",
			});
			if (!req.ok) {
				setListQuestionSet([]);
				return;
			}
			const { data } = await req.json();
			setListQuestionSet(data.questionSets);
			setIsDownloadedQuestionSet(true);
			return;
		} catch (err) {
			console.error(err);
		}
	};
	useEffect(() => {
		getQuestionSet();
		getQuestion();
	}, []);
	useEffect(() => {
		console.log(formData);
	}, [formData]);

	const handleRightClick = (e) => {
		e.preventDefault();
		setActiveQuestionSet(
			// wyłączanie testów po koleji
			// (prevState) => {
			// 	let updatedState = [...prevState];
			// 	for (let i = 0; i < prevState.length; i++) {
			// 		setTimeout(() => {
			// 			updatedState = updatedState.slice(1);
			// 			setActiveQuestionSet(updatedState)
			// 		}, i * 50);
			// 	}
			// 	return updatedState
			// }
			[]
		);
	};
	const handleRightClickQuestionsRemover = (e) => {
		e.preventDefault();
		setActiveQuestions(
			[]
		);
	};

	const switchActiveQuestionSet = (questionSetIdToSwitch) => {
		setActiveQuestionSet((prevState) => {
			let updatedState;
			if (prevState.includes(questionSetIdToSwitch)) {
				updatedState = prevState.filter(
					(item) => item !== questionSetIdToSwitch
				);
			} else {
				updatedState = [...prevState, questionSetIdToSwitch];
			}
			return updatedState;
		});
	};
	const switchActiveQuestion = (questionSetIdToSwitch) => {
		setActiveQuestions((prevState) => {
			let updatedState;
			if (prevState.includes(questionSetIdToSwitch)) {
				updatedState = prevState.filter(
					(item) => item !== questionSetIdToSwitch
				);
			} else {
				updatedState = [...prevState, questionSetIdToSwitch];
			}
			return updatedState;
		});
	};

	const sendCreatedTest = async (data) => {
		if (data.name.trim().length === 0) return;
		const itemTest = {
			name: data.name.trim(),
			description: data.description.trim(),
			questionSets: activeQuestionSet,
			questions: activeQuestions,
		};
		console.log(itemTest, "tooo");
		try {
			const res = await fetch("http://localhost:3000/api/content/test", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(itemTest)
			})
			if (res.ok) {
				alert('działa')
			}
		} catch (err) {
			console.log("nastąpił niespodziewany błąd podczas wysyłasnia testu")
		}
	};

	return (
		<div>
			<BorderedBoxC className="overflow-hidden max-h-[500px] h-[400px] relative">
				{/* <motion.div > */}
				<AnimatePresence initial={false}>
					{activeStage === 1 ? ( // dodawanie zbiorów
						<motion.div
							key="stage-1"
							initial={{ opacity: 0, translateX: "100%" }}
							animate={{ opacity: 1, translateX: 0 }}
							exit={{ opacity: 0, translateX: "-100%" }}
							transition={{ duration: 0.3 }}
							className="w-full h-full p-2 flex flex-col gap-2 absolute"
							onContextMenu={handleRightClick}>
							<div className="w-full flex justify-between">
								<h1 className="text-3xl">
									<span>1</span> Dobierz zbiory do testu
								</h1>
								<div className="flex gap-2 justify-center items-center">
									<span>
										razem <strong>{numberOfActiveQuestions}</strong>{" "}
										{numberOfActiveQuestions === 1
											? "pytanie"
											: numberOfActiveQuestions >= 2 &&
											  numberOfActiveQuestions <= 4
											? "pytania"
											: "pytań"}
									</span>
									<ButtonC
										onClick={() => setActiveStage((prevState) => prevState + 1)}
										isDisabled={numberOfActiveQuestions === 0}>
										Dalej
									</ButtonC>
								</div>
							</div>
							<div className="flex flex-wrap gap-2 justify-center w-full">
								{listQuestionSet.map((item) => (
									<QuestionSetBarSheet
										key={item._id}
										name={item.name}
										id={item._id}
										questions={item.questions}
										switchActiveQuestionSet={switchActiveQuestionSet}
										activeQuestionSet={activeQuestionSet}
									/>
								))}
							</div>
						</motion.div>
					) : activeStage === 2 ? ( // czy dodac osobne pytania
						<motion.div
							key="stage-2"
							initial={{ opacity: 0, translateX: "100%" }}
							animate={{ opacity: 1, translateX: 0 }}
							exit={{ opacity: 0, translateX: "-100%" }}
							transition={{ duration: 0.3 }}
							className="w-full h-full p-2 flex flex-col gap-2 absolute"
							onContextMenu={handleRightClickQuestionsRemover}>
							<div className="flex justify-between items-center gap-2">
								<h2 className="text-2xl">
									<span>2</span> Dodawanie nieprzydzielonych pytań
								</h2>
								<div><span>
										razem <strong>{activeQuestions.length}</strong>{" "}
										{activeQuestions.length === 1
											? "pytanie"
											: activeQuestions.length >= 2 &&
											activeQuestions.length <= 4
											? "pytania"
											: "pytań"}
									</span>
									<ButtonC
										onClick={() =>
											setActiveStage((prevState) => prevState - 1)
										}>
										Wstecz
									</ButtonC>
									<ButtonC
										onClick={() =>
											setActiveStage((prevState) => prevState + 1)
										}>
											{activeQuestions.length > 0 ? "Dalej" : "Pomiń"}
									</ButtonC>
								</div>
							</div>
							<div className="overflow-y-auto flex gap-1 flex-wrap">
								{downloadedFreeQuestions.map((item) => (
									<QuestionBarSheet
										key={item._id}
										id={item._id}
										switchActiveQuestions={switchActiveQuestion}
										activeQuestions={activeQuestions}
										name={item.text}
									/>
								))}
							</div>
						</motion.div>
					) : activeStage === 3 ? ( // dodwanie nieprzydielonych pytań
						<motion.div
							key="stage-3"
							initial={{ opacity: 0, translateX: "100%" }}
							animate={{ opacity: 1, translateX: 0 }}
							exit={{ opacity: 0, translateX: "-100%" }}
							transition={{ duration: 0.3 }}
							className="w-full h-full p-2 flex flex-col gap-2 absolute">
							<div className="flex justify-between items-center gap-2">
								<h2 className="text-2xl">
									<span>3</span> Właściwości testu
								</h2>
								<div>
									<ButtonC
										onClick={() =>
											setActiveStage((prevState) => prevState - 1)
										}>
										Wstecz
									</ButtonC>
									{/* <ButtonC
										onClick={() =>
											setActiveStage((prevState) => prevState + 1)
										}>
										Dalej
									</ButtonC> */}
								</div>
							</div>
							<div>
								{/* <div className="flex">
									<div className="flex items-center gap-1">
										<span>od</span>
										<TimeInput
											value={autoSwitchTestStartTime}
											onChange={setAutoSwitchTestStartTime}
											maxValue={autoSwitchTestEndTime}
										/>
									</div>
									<div>
										czas trwania
									</div>
									<div className="flex items-center gap-1">
										<span>do</span>
										<TimeInput
											value={autoSwitchTestEndTime}
											onChange={setAutoSwitchTestEndTime}
											minValue={autoSwitchTestStartTime}
										/>
									</div>
								</div> */}
								<form onSubmit={handleSubmit((data) => sendCreatedTest(data))}>
									<div className="flex flex-col gap-2">
										<InputC
											{...register("name", { required: true })}
											placeholder="Nazwa testu"
										/>
										<TextAreaC
											classNameT="resize-none"
											{...register("description")}
											placeholder="Opis testu"
											rows="6"
											maxLength={750}
										/>
										<InputC type="submit" value="Zapisz test" />
									</div>
								</form>
							</div>
						</motion.div>
					) : null}
				</AnimatePresence>
				{/* </motion.div> */}
			</BorderedBoxC>
		</div>
	);
}
const QuestionSetBarSheet = ({
	name,
	id,
	activeQuestionSet,
	questions,
	switchActiveQuestionSet,
}) => {
	const isActive = activeQuestionSet.some((itemId) => itemId === id);
	return (
		<div className="relative">
			<button
				className={clsx(
					"p-2 rounded-lg flex justify-between cursor-pointer z-20 gap-2 text-start disabled:opacity-50 disabled:cursor-default",
					{
						"hover:bg-primary-400/40": !isActive && questions > 0,
						"bg-blue-500/40": isActive,
					}
				)}
				onClick={() => switchActiveQuestionSet(id)}
				disabled={questions === 0}>
				<div className="flex gap-1" title={name}>
					<Folder />
					<span className=" w-48 overflow-hidden block text-ellipsis text-nowrap">
						{name}
					</span>
				</div>
				<div>
					<span>{questions}</span>
				</div>
				<div className="flex justify-center">
					<div
						className="rounded-full hover:bg-primary-400/50 p-1"
						onClick={(e) => {
							e.stopPropagation();
							if (questions > 0) {
								console.log("test");
							}
						}}>
						<Eye className="w-4 h-4" />
					</div>
				</div>
			</button>
		</div>
	);
};
const QuestionBarSheet = ({
	name,
	id,
	activeQuestions,
	switchActiveQuestions,
}) => {
	console.log(activeQuestions, "test activeQuestions");
	const isActive = activeQuestions.some((item) => item === id);
	console.log(isActive, "czy aktywne")
	return (
		<div className="relative">
			<button
				className={clsx(
					"p-2 rounded-lg flex justify-between cursor-pointer z-20 gap-2 text-start disabled:opacity-50 disabled:cursor-default",
					{
						"hover:bg-primary-400/40": !isActive,
						"bg-blue-500/40": isActive,
					}
				)}
				onClick={() => switchActiveQuestions(id)}>
				<div className="flex gap-1" title={name}>
					<HelpCircle />
					<span className=" w-48 overflow-hidden block text-ellipsis text-nowrap">
						{name}
					</span>
				</div>
			</button>
		</div>
	);
};
