"use client";

import { BorderedBoxC } from "@/components/customComponents";
import { Tooltip, Divider, Switch, ScrollShadow } from "@nextui-org/react";
import {
	ArrowLeft,
	ArrowRight,
	Check,
	Copy07,
	FileCheck01,
	Folder,
	List,
	Loading01,
	Loading02,
	Plus,
	RefreshCcw05,
	Trash03,
	X,
} from "@untitled-ui/icons-react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { ButtonC, InputC } from "@/components/customComponents";
import {
	motion,
	useMotionValue,
	AnimatePresence,
	Reorder,
} from "framer-motion";

function truncateString(str, maxLength) {
	if (str.length <= maxLength) {
		return str;
	}
	return str.slice(0, maxLength - 3) + "...";
}

export default function DragBox({
	_dataQuestionSet,
	dataQuestionSetLength,
	isDownloadededQuestionSet,
}) {
	const [activeQuestionSet, setActiveQuestionSet] = useState(null);
	const [downloadedFreeQuestions, setDownloadedFreeQuestions] = useState([]);
	const [isDownloadedFreeQuestions, setIsDownloadedFreeQuestions] =
		useState(false);
	const [downloadedQuestions, setDownloadedQuestions] = useState([]);
	const [selectedForDeletion, setSelectedForDeletion] = useState(null);
	const [selectedForDeletion2, setSelectedForDeletion2] = useState(null);
	const [errorSheet, setErrorSheet] = useState(null);
	const [successSheet, setSuccessSheet] = useState(null);
	const [isActiveAddCollection, setIsActiveAddCollection] = useState(false);
	const [nameOfQuestionSet, setNameOfQuestionSet] = useState("");
	const [randomQuestions, setRandomQuestions] = useState(true);
	const [deletedQuestions, setDeletedQuestions] = useState([]);
	const [savedChanges, setSavedChanges] = useState("no");
	const [dataQuestionSet, setListQuestionSet] = useState([]);

	useEffect(() => {
		if (
			downloadedQuestions.length === 0 ||
			downloadedQuestions.every((question) => question.length === 0)
		) {
			setDownloadedQuestions(Array(dataQuestionSetLength).fill([]));
		}
	}, [dataQuestionSet]);
	useEffect(() => {
		setListQuestionSet(_dataQuestionSet)
		console.log(_dataQuestionSet, "testtesttesttest")
		getQuestion();
	}, []);
	useEffect(() => {
		if (selectedForDeletion !== null) {
			setTimeout(() => {
				setSelectedForDeletion(null);
			}, 3000);
		}
		if (selectedForDeletion2 !== null) {
			setTimeout(() => {
				setSelectedForDeletion2(null);
			}, 3000);
		}
	}, [selectedForDeletion, selectedForDeletion2]);

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
	function findNameQuestionSet(id) {
		const filtered = dataQuestionSet.filter((item) => item._id === id);
		const filteredName = filtered[0].name;
		return filteredName;
	}
	function findIndexQuestionSet(id) {
		return dataQuestionSet.findIndex((item) => item._id === id);
	}

	const moveQuestionForQuestionSet = (id) => {
		if (activeQuestionSet === null) return;
		if (
			downloadedQuestions[findIndexQuestionSet(activeQuestionSet)].some(
				(item) => item._id === id
			)
		)
			return;
		const findedQuestion = downloadedFreeQuestions.find(
			(item) => item._id === id
		);
		setDownloadedQuestions((prevState) => {
			const updatedState = [...prevState];
			const updatedQuestions = [
				...updatedState[findIndexQuestionSet(activeQuestionSet)],
			];
			updatedQuestions.push(findedQuestion);
			updatedState[findIndexQuestionSet(activeQuestionSet)] = updatedQuestions;
			return updatedState;
		});
		setDownloadedFreeQuestions((prevState) => {
			const updatedState = [...prevState];
			const newUpdatedState = updatedState.filter((item) => id !== item._id);
			return newUpdatedState;
		});
		console.log(findedQuestion);
	};
	const moveQuestionFromQuestionSet = (id) => {
		if (activeQuestionSet === null) return;
		if (downloadedFreeQuestions.some((item) => item._id === id)) return;

		const findedQuestion = downloadedQuestions[
			findIndexQuestionSet(activeQuestionSet)
		].find((item) => item._id === id);
		setDownloadedFreeQuestions((prevState) => {
			const updatedState = [...prevState];
			updatedState.push(findedQuestion);
			return updatedState;
		});

		setDownloadedQuestions((prevState) => {
			const updatedState = [...prevState];
			const newUpdatedState = updatedState[
				findIndexQuestionSet(activeQuestionSet)
			].filter((item) => id !== item._id);
			updatedState[findIndexQuestionSet(activeQuestionSet)] = newUpdatedState;
			return updatedState;
		});
	};
	const duplicateQuestionForQuestionSet = (id) => {
		if (activeQuestionSet === null) return;
		if (
			downloadedQuestions[findIndexQuestionSet(activeQuestionSet)].some(
				(item) => item._id === id
			)
		)
			return;
		const findedQuestion = downloadedFreeQuestions.find(
			(item) => item._id === id
		);
		setDownloadedQuestions((prevState) => {
			const updatedState = [...prevState];
			console.log(updatedState);
			const updatedQuestions = [
				...updatedState[findIndexQuestionSet(activeQuestionSet)],
			];
			updatedQuestions.push(findedQuestion);
			updatedState[findIndexQuestionSet(activeQuestionSet)] = updatedQuestions;
			return updatedState;
		});
	};
	const duplicateQuestionFromQuestionSet = (id) => {
		if (activeQuestionSet === null) return;
		if (downloadedFreeQuestions.some((item) => item._id === id)) return;

		const findedQuestion = downloadedQuestions[
			findIndexQuestionSet(activeQuestionSet)
		].find((item) => item._id === id);
		setDownloadedFreeQuestions((prevState) => {
			const updatedState = [...prevState];
			updatedState.push(findedQuestion);
			return updatedState;
		});
	};
	const deleteQuestionFromDownloadedQuestions = (id) => {
		setDeletedQuestions((prevState) => {
			const updatedState = [...prevState];
			const newItem = downloadedFreeQuestions.find((item) => id === item._id);
			updatedState.push(newItem);
			return updatedState;
		});
		setDownloadedFreeQuestions((prevState) => {
			const updatedState = [...prevState];
			const newUpdatedState = updatedState.filter((item) => id !== item._id);
			return newUpdatedState;
		});
	};
	const deleteQuestionFromQuestionSet = (id) => {
		if (activeQuestionSet === null) return;
		setDeletedQuestions((prevState) => {
			const updatedState = [...prevState];
			const newItem = downloadedQuestions.find((item) => id === item._id);
			updatedState.push(newItem);
			return updatedState;
		});
		setDownloadedQuestions((prevState) => {
			const updatedState = [...prevState];
			const newUpdatedState = updatedState[
				findIndexQuestionSet(activeQuestionSet)
			].filter((item) => id !== item._id);
			updatedState[findIndexQuestionSet(activeQuestionSet)] = newUpdatedState;
			return updatedState;
		});
	};
	const restoreQuestionForQuestions = (id) => {
		setDownloadedFreeQuestions((prevState) => {
			const updatedState = [...prevState];
			const newItem = deletedQuestions.find((item) => item._id === id);
			updatedState.push(newItem);
			return updatedState;
		});
		setDeletedQuestions((prevState) => {
			const updatedState = [...prevState];
			const newUpdatedState = updatedState.filter((item) => item._id !== id);
			return newUpdatedState;
		});
	};
	const createQuestionSet = async () => {
		try {
			const res = await fetch("http://localhost:3000/api/content/questionSet", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: nameOfQuestionSet,
					randomQuestions: randomQuestions,
				}),
			});
			if (!res.ok) {
				console.error("nie stworzono zbioru pytań");
				return;
			}
			setSuccessSheet("Pomyślnie stworzono zbiór");
			const { data } = await res.json();
			const { name, id, questions } = data;
			setNameOfQuestionSet("");
			setRandomQuestions(true);
			setDownloadedQuestions((prevState) => {
				return [...prevState, []];
			});
			setListQuestionSet((prevState) => {
				return [...prevState, { name, _id: id, questions }];
			});
		} catch (err) {
			console.error(err);
			setErrorSheet("niespodziewany błąd podczas tworzenia zbioru");
		}
	};

	const deleteQuestionSet = async (id) => {
		try {
			const res = await fetch(
				`http://localhost:3000/api/content/questionSet/${id}`,
				{
					method: "delete",
				}
			);
			if (!res.ok) {
				console.log("błąd podczas usuwania zbioru");
				return;
			}
			setSuccessSheet("Pomyślnie usunięto zbiór");
			setDownloadedQuestions((prevState) => {
				const updatedState = [...prevState];
				const questionSetItem = dataQuestionSet.find((item) => item._id === id);
				const indexQuestion = findIndexQuestionSet(questionSetItem._id);
				updatedState.splice(indexQuestion, 1);
				return updatedState;
			});
			setListQuestionSet((prevState) => {
				const updatedState = [...prevState];
				return updatedState.filter((item) => item._id !== id);
			});
		} catch (err) {
			console.error(err);
		}
	};
	const deleteAllQuestionSet = async (id) => {
		try {
			const res = await fetch(
				`http://localhost:3000/api/content/questionSet/all/${id}`,
				{
					method: "delete",
				}
			);
			if (!res.ok) {
				console.log("błąd podczas usuwania zbioru");
				return;
			}
			setSuccessSheet(
				"Pomyślnie usunięto zbiór razem z zawartymi w nim pytaniami"
			);

			setListQuestionSet((prevState) => {
				const updatedState = [...prevState];
				return updatedState.filter((item) => item._id !== id);
			});
		} catch (err) {
			console.error(err);
		}
	};
	const checkIfQuestionsIUsed = (id, skipIndex = null) => {
		const isUsedQuestions = downloadedQuestions.some(
			(innerArray, index) =>
				index !== skipIndex && innerArray.some((item) => item._id === id)
		);
		const isUsedFreeQuestions = downloadedFreeQuestions.some(
			(item) => item._id === id
		);
		return isUsedQuestions || isUsedFreeQuestions;
	};
	const sendUpdateQuestions = async () => {
		const updatedQuestionSets = downloadedQuestions
			.map((item, index) =>
				item.length > 0
					? {
							questionSetId: findIdQuestionSetfromIndex(index),
							questions: item.map((question) => question._id),
					  }
					: null
			)
			.filter((item) => item !== null);
		console.log(updatedQuestionSets, "zaktualizowane QuestionSet");
      if(updatedQuestionSets.length === 0) return
		try {
         setSavedChanges("loading");
			const res = await fetch("http://localhost:3000/api/content/questions", {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					updatedQuestionSets
				})
			})
			if(!res.ok) {
				console.log("błąd podczas zapisywania")
			}
         setSavedChanges("yes")

         setTimeout(() => {
            if(savedChanges === "yes")
            setSavedChanges("no")
         }, 4000)
		} catch (err) {
			console.error(err)
		}
	};
	const findIdQuestionSetfromIndex = (index) => {
		return dataQuestionSet[index]._id;
	};

	return (
		<div className="flex flex-col gap-3">
			<div className="mt-1">
				<BorderedBoxC>
					<div className="p-2 flex justify-between items-center text-[#a8a8a8]">
						<div className="flex gap-1 items-center">
							<div>
								<Sheet>
									<SheetTrigger>
										<span className="hover:text-gray-300 flex justify-center items-center">
											przywracanie usuniętych pytań
										</span>
									</SheetTrigger>
									<SheetContent
										className="border-[#303030] h-full flex flex-col"
										aria-describedby="panel-tworzenie-zbiorów">
										<SheetHeader className="text-2xl font-bold">
											<SheetTitle>Przywracanie pytań</SheetTitle>
										</SheetHeader>
										<div className="mt-2">
											<p>Usunięte pytania</p>
											<Divider />
										</div>
										<div className="text-gray-400 overflow-hidden">
											<div className="overflow-y-auto max-h-full">
												{deletedQuestions.length > 0 ? (
													deletedQuestions.map((item) => (
														<div
															key={item._id}
															className="p-2 hover:bg-white/10w flex justify-between">
															<p>{item.text}</p>
															<Tooltip content="przywróć pytanie" delay={800}>
																<button
																	className="group"
																	onClick={() =>
																		restoreQuestionForQuestions(item._id)
																	}>
																	<RefreshCcw05 className="group-hover:-rotate-45 transition-transform" />
																</button>
															</Tooltip>
														</div>
													))
												) : (
													<p>brak pytań do przywrócenia</p>
												)}
											</div>
										</div>
									</SheetContent>
								</Sheet>
							</div>
							<div orientation="vertical" className="h-6 w-[1px] bg-gray-700" />
							<div>
								<Sheet>
									<SheetTrigger>
										<span className="hover:text-gray-300 flex justify-center items-center">
											zarządzanie zbiorami
										</span>
									</SheetTrigger>
									<SheetContent
										className="border-[#303030] h-full flex flex-col"
										aria-describedby="panel-tworzenie-zbiorów">
										<SheetHeader className="text-2xl font-bold">
											<SheetTitle>Zarządzanie zbiorami</SheetTitle>
										</SheetHeader>
										{errorSheet && (
											<div
												className="w-full py-1 px-2 bg-danger-500/20 rounded-lg text-danger-500 border border-danger-500 cursor-pointer"
												title="zamknij informację o błędzie"
												onClick={() => setErrorSheet("")}>
												{errorSheet}
											</div>
										)}
										{successSheet && (
											<div
												className="w-full py-1 px-2 bg-success-500/20 rounded-lg text-success-500 border border-success-500 cursor-pointer"
												title="zamknij informację powodzeniu"
												onClick={() => setSuccessSheet("")}>
												{successSheet}
											</div>
										)}
										<div className="flex flex-col mt-5 flex-grow overflow-hidden">
											<div className="flex justify-between items-end w-full">
												<h2 className="text-xl">Zbiory</h2>
											</div>
											<Divider />
											<div className="py-5 flex-grow overflow-y-auto">
												{isDownloadededQuestionSet ? (
													dataQuestionSet.length > 0 ? (
														<div className="flex flex-col gap-2">
															{dataQuestionSet.map((item) => (
																<QuestionSetBarSheet
																	key={item._id}
																	name={item.name}
																	id={item._id}
																	questions={item.questions}
																	deleteQuestionSet={deleteQuestionSet}
																	deleteAllQuestionSet={deleteAllQuestionSet}
																	// getQuestionsForQuestionSet={
																	// 	getQuestionsForQuestionSet
																	// }
																/>
															))}
														</div>
													) : (
														<p>brak zapisanych zbiorów</p>
													)
												) : (
													<p>ładowanie...</p>
												)}
											</div>
											<Divider />
											<div className="pt-3">
												{isActiveAddCollection && (
													<div className="mb-3">
														<div className="w-full flex justify-between m-1">
															<p className="font-bold">Tworzenie zbioru</p>
															<button
																className="text-white/40 hover:text-white/90 transition-colors"
																onClick={() => setIsActiveAddCollection(false)}>
																<X />
															</button>
														</div>
														<div className="flex gap-2 flex-col">
															<InputC
																placeholder="nazwa zbioru"
																onChange={(e) =>
																	setNameOfQuestionSet(e.target.value)
																}
																value={nameOfQuestionSet}
																maxLength={40}
															/>
															<Switch
																onValueChange={setRandomQuestions}
																value={randomQuestions}
																defaultSelected>
																losowa kolejność pytań
															</Switch>
														</div>
													</div>
												)}
												<ButtonC
													className="w-full"
													style={{
														width: "calc(100% - 0.5rem)",
														height: "auto",
													}}
													onClick={() => {
														if (isActiveAddCollection) {
															createQuestionSet();
														} else setIsActiveAddCollection(true);
													}}>
													Dodaj zbiór
												</ButtonC>
											</div>
										</div>
									</SheetContent>
								</Sheet>
							</div>
							<div orientation="vertical" className="h-6 w-[1px] bg-gray-700" />
							<div>
								<button
									className="hover:text-gray-300 flex gap-1 relative justify-center items-center"
									onClick={sendUpdateQuestions}>
									zapisz zmiany
									<AnimatePresence>
										{savedChanges === "yes" ? (
											<motion.div
												initial={{ opacity: 0, scale: 0.5 }}
												animate={{ opacity: 1, x: 0, scale: 1 }}
												exit={{ opacity: 0, scale: 0.5 }}>
												<Check className="z-20"/>
												<motion.div
													initial={{ opacity: 1, x: 20 }}
													animate={{ opacity: 0, x: 100, scale: 1.8 }}
													exit={{ opacity: 0, x: -50, scale: 1.5 }}
                                       transition={{ duration: 1 }}
                                       className="absolute top-0 -translate-y-1/2 text-gray-400 z-100"
                                       >
													zapisano
												</motion.div>
											</motion.div>
										) : savedChanges === "loading" ? (
											<motion.div
                                    initial={{ opacity: 0, scale: 0.5 }}
												animate={{ opacity: 1, x: 0, scale: 1 }}
												exit={{ opacity: 0, scale: 0.5 }}>
												<Loading02 className="animate-spin-slow" />
											</motion.div>
										) : null}
									</AnimatePresence>
								</button>
							</div>
						</div>
						<div>
							<button className="hover:text-gray-300 cursor-pointer">
								zgłoś błąd
							</button>
						</div>
					</div>
				</BorderedBoxC>
			</div>
			<div className="flex gap-4 pt-2">
				<div className="w-full">
					<BorderedBoxC className="w-full text-center py-5">
						<h1 className="text-2xl font-bold">Pytania</h1>
					</BorderedBoxC>
					<BorderedBoxC className="w-full text-center" variant="tnone">
						{downloadedFreeQuestions.length > 0 ? (
							<ScrollShadow
								className="max-h-[400px] overflow-y-auto"
								hideScrollBar>
								<AnimatePresence initial={false}>
									{downloadedFreeQuestions.map((item) => (
										<motion.div
											key={item._id}
											initial={{ opacity: 0, x: 100 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: 100 }}>
											<div className="bg-none backdrop-blur-sm p-1 active:z-50 text-start text-gray-400 group flex justify-between hover:bg-white/10 transition-background duration-75 px-2">
												<p>{item.text}</p>
												<div className=" group-hover:opacity-100 opacity-0 flex gap-2 transition-opacity duration-75">
													{selectedForDeletion === item._id ? (
														<Tooltip content="potwierdź usunięcie pytania">
															<button
																className="text-danger-400"
																onClick={() => {
																	deleteQuestionFromDownloadedQuestions(
																		item._id
																	);
																	setSelectedForDeletion(null);
																}}>
																<Check />
															</button>
														</Tooltip>
													) : (
														<Tooltip content="usuń pytanie" delay={1000}>
															<button
																className="text-gray-600 hover:text-danger-400 disabled:text-gray-700"
																onClick={() =>
																	setSelectedForDeletion(item._id)
																}>
																<Trash03 />
															</button>
														</Tooltip>
													)}
													<Tooltip
														content="duplikuj i przenieś pytanie do zbioru"
														delay={1000}>
														<button
															className="text-gray-600 hover:text-gray-400 disabled:text-gray-700"
															disabled={activeQuestionSet === null}
															onClick={() =>
																duplicateQuestionForQuestionSet(item._id)
															}>
															<Copy07 />
														</button>
													</Tooltip>
													<Tooltip
														content="przenieś pytanie do zbioru"
														delay={1000}>
														<button
															className="text-gray-600 hover:text-info-400 disabled:text-gray-700"
															disabled={activeQuestionSet === null}
															onClick={() =>
																moveQuestionForQuestionSet(item._id)
															}>
															<ArrowRight />
														</button>
													</Tooltip>
												</div>
											</div>
										</motion.div>
									))}
								</AnimatePresence>
							</ScrollShadow>
						) : isDownloadedFreeQuestions ? (
							<p>brak pytań</p>
						) : (
							<p>ładowanie pytań...</p>
						)}
					</BorderedBoxC>
				</div>
				{activeQuestionSet ? (
					<div className="w-full flex flex-col">
						<BorderedBoxC className="w-full text-center py-5 relative">
							<div
								className="absolute top-1 left-1 text-[#a2a2a2] cursor-pointer hover:bg-white/20 rounded-full p-0.5"
								onClick={() => setActiveQuestionSet(null)}>
								<ArrowLeft />
							</div>
							{findNameQuestionSet(activeQuestionSet).length > 20 ? (
								<Tooltip
									content={findNameQuestionSet(activeQuestionSet)}
									delay={800}>
									<h1 className="text-2xl font-bold">
										{truncateString(findNameQuestionSet(activeQuestionSet), 20)}
									</h1>
								</Tooltip>
							) : (
								<h1 className="text-2xl font-bold">
									{findNameQuestionSet(activeQuestionSet)}
								</h1>
							)}
						</BorderedBoxC>
						<BorderedBoxC className="w-full text-center" variant="tnone">
							<motion.div className="max-h-[400px] overflow-y-auto h-full">
								<ScrollShadow
									hideScrollBar
									className="max-h-[400px] overflow-y-auto">
									<ActiveQuestionSetList
										setDownloadedQuestions={setDownloadedQuestions}
										activeQuestionSet={
											downloadedQuestions[
												findIndexQuestionSet(activeQuestionSet)
											]
										}
										activeQuestionSetNumber={findIndexQuestionSet(
											activeQuestionSet
										)}
										dataQuestionSet={dataQuestionSet}
										moveQuestionFromQuestionSet={moveQuestionFromQuestionSet}
										duplicateQuestionFromQuestionSet={
											duplicateQuestionFromQuestionSet
										}
										selectedForDeletion2={selectedForDeletion2}
										setSelectedForDeletion2={setSelectedForDeletion2}
										deleteQuestionFromQuestionSet={
											deleteQuestionFromQuestionSet
										}
									/>
								</ScrollShadow>
							</motion.div>
						</BorderedBoxC>
					</div>
				) : (
					<div className="w-full flex flex-col">
						<BorderedBoxC className="w-full flex py-5">
							<h1 className="text-2xl font-bold text-center w-full">Zbiory</h1>
						</BorderedBoxC>
						<BorderedBoxC className="w-full text-center" variant="tnone">
							{dataQuestionSet.length > 0 ? (
								<ScrollShadow
									hideScrollBar
									className="max-h-[400px] overflow-y-auto">
									{dataQuestionSet.map((item, index) => (
										<QuestionSetBar
											key={item._id}
											name={item.name}
											amount={
												downloadedQuestions[index]?.length > 0
													? downloadedQuestions[index].length
													: item.questions
											}
											setActiveQuestionSet={setActiveQuestionSet}
											id={item._id}
										/>
									))}
								</ScrollShadow>
							) : isDownloadededQuestionSet ? (
								<p>Brak zbiorów</p>
							) : (
								<p>ładowanie zbiorów</p>
							)}
						</BorderedBoxC>
					</div>
				)}
			</div>
		</div>
	);
}

const ActiveQuestionSetList = ({
	setDownloadedQuestions,
	activeQuestionSet,
	dataQuestionSet,
	activeQuestionSetNumber,
	moveQuestionFromQuestionSet,
	duplicateQuestionFromQuestionSet,
	selectedForDeletion2,
	setSelectedForDeletion2,
	deleteQuestionFromQuestionSet,
}) => {
	const [isDownloaded, setIsDownloaded] = useState(false);
	const getQuestionsA = async () => {
		if (activeQuestionSet.length <= 0)
			try {
				const res = await fetch("http://localhost:3000/api/content/questions", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						questions: dataQuestionSet[activeQuestionSetNumber].questionsList,
					}),
				});
				if (!res.ok) {
					console.log("błąd");
				}
				const { questions } = await res.json();
				// console.log(questions)

				setDownloadedQuestions((prevState) => {
					const updatedState = [...prevState];

					updatedState.forEach((item, index) => {
						if (index === activeQuestionSetNumber) {
							updatedState[index] = questions;
						}
					});

					return updatedState;
				});
				setIsDownloaded(true);
			} catch (err) {
				console.error(err);
			}
	};

	useEffect(() => {
		getQuestionsA();
	}, []);
	// if(activeQuestionSet) {
	// 	console.log("jest")
	// } else {
	// }
	return (
		<Reorder.Group
			axis="y"
			values={activeQuestionSet || []}
			onReorder={(newOreder) => {
				setDownloadedQuestions((prevState) => {
					let updatedState = [...prevState];
					updatedState[activeQuestionSetNumber] = newOreder;
					return updatedState;
				});
			}}>
			{isDownloaded || activeQuestionSet.length > 0 ? (
				activeQuestionSet.length > 0 ? (
					activeQuestionSet.map((item, index) => (
						<Reorder.Item key={item._id} value={item}>
							<div className="hover:bg-white/10 backdrop-blur-sm p-1 active:z-50 text-start text-gray-400 cursor-move group flex justify-between gap-1 px-2">
								<p>{item.text}</p>
								<div className="group-hover:opacity-100 flex opacity-0 gap-2">
									{selectedForDeletion2 === item._id ? (
										<Tooltip content="potwierdź usunięcie pytania">
											<button
												className="text-danger-400"
												onClick={() => {
													deleteQuestionFromQuestionSet(item._id);
													setSelectedForDeletion2(null);
												}}>
												<Check />
											</button>
										</Tooltip>
									) : (
										<Tooltip content="usuń pytanie" delay={1000}>
											<button
												className="text-gray-600 hover:text-danger-400 disabled:text-gray-700"
												onClick={() => setSelectedForDeletion2(item._id)}>
												<Trash03 />
											</button>
										</Tooltip>
									)}
									<button
										className="text-gray-600 hover:text-gray-400"
										onClick={() => moveQuestionFromQuestionSet(item._id)}>
										<ArrowLeft />
									</button>
									<button
										className="text-gray-600 hover:text-gray-400"
										onClick={() => duplicateQuestionFromQuestionSet(item._id)}>
										<Copy07 />
									</button>
								</div>
							</div>
						</Reorder.Item>
					))
				) : (
					<div>
						<p>brak pytań</p>
					</div>
				)
			) : (
				<div>
					<p>pobieranie pytań</p>
				</div>
			)}
		</Reorder.Group>
	);
};

const QuestionSetBar = ({ name, amount, setActiveQuestionSet, id }) => {
	return (
		<div
			className="flex justify-between hover:bg-white/20 p-2 rounded-lg cursor-pointer"
			onClick={() => setActiveQuestionSet(id)}>
			{name.length > 28 ? (
				<Tooltip content={name} delay={800}>
					<p>{truncateString(name, 25)}</p>
				</Tooltip>
			) : (
				<p>{name}</p>
			)}
			<p>{amount}</p>
		</div>
	);
};
const QuestionSetBarSheet = ({
	name,
	id,
	deleteQuestionSet,
	questions,
	deleteAllQuestionSet,
	getQuestionsForQuestionSet,
}) => {
	const [isOpenOptions, setIsOpenOptions] = useState(false);

	return (
		<div className="relative">
			<div
				className="p-2 rounded-lg flex justify-between cursor-pointer z-20 hover:bg-primary-400/40"
				onClick={() => setIsOpenOptions(!isOpenOptions)}>
				<div className="flex gap-1" title={name}>
					<Folder />
					<span className="text-wrap max-w-48 overflow-hidden">{name}</span>
				</div>
				<div
					className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground shrink-0"
					data-v0-t="badge">
					{questions}
				</div>
			</div>
			{isOpenOptions && (
				<div className="flex flex-col gap-1 z-10 border-b border-white/20 box-content overflow-hidden">
					<button
						className="w-full hover:bg-primary-400/30 p-2 flex gap-2 rounded-lg"
						onClick={() => {
							getQuestionsForQuestionSet(id);
						}}>
						<List /> lista pytań
					</button>
					<button
						className="w-full hover:bg-primary-400/30 p-2 flex gap-2 text-danger-500 rounded-lg"
						onClick={() => deleteQuestionSet(id)}>
						<Trash03 /> usuń zbiór (pytania zostają)
					</button>
					<button
						className="w-full hover:bg-primary-400/30 p-2 flex gap-2 text-danger-500 rounded-lg disabled:opacity-50"
						onClick={() => deleteAllQuestionSet(id)}
						disabled>
						<Trash03 /> usuń zbiór razem z pytaniami
					</button>
				</div>
			)}
		</div>
	);
};
