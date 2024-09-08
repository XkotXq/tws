"use client";

import { ButtonC, InputC, OppositedBoxC } from "@/components/customComponents";
import { Folder } from "@untitled-ui/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function CollectionManagment({ questionSetData }) {
	const [activeStage, setActiveStage] = useState(1);
	const [activeQuestionSet, setActiveQuestionSet] = useState(null);
	const [questionSets, setQuestionSets] = useState([]);
	const [handleValueSearchInput, setHandleValueSearchInput] = useState("");
	const [handleAllQuestionsSearchInput, setHandleAllQuestionsSearchInput] =
		useState("");
	const [cacheQuestionsForQuestionSets, setCacheQuestionsForQuestionSets] =
		useState([]);
	const [userQuestions, setUserQuestions] = useState([]);

	useEffect(() => {
		getUserQuestions();
		setQuestionSets(questionSetData);

		const settedCacheQuestionsForQuestionSets = questionSetData.map((item) => {
			return { _id: item._id, questions: [], downloaded: false };
		});
		setCacheQuestionsForQuestionSets(settedCacheQuestionsForQuestionSets);
		console.log(questionSetData, "questionSets")
	}, [questionSetData]);

	const getUserQuestions = async () => {
		try {
			const res = await fetch(
				"http://localhost:3000/api/content/v2/questions?less=true",
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				}
			);
			if (!res.ok) {
				console.log("Błąd podczas pobierania pytań.");
				return;
			}
			const data = await res.json();
			setUserQuestions(data);
		} catch (err) {
			console.error("Błąd:", err);
		}
	};

	// Ustawienie aktywnego zbioru
	const handleSetActiveQuestionSet = (id) => {
		if (activeQuestionSet === id) {
			setActiveQuestionSet(null);
		} else if (activeQuestionSet !== id) {
			window.scrollTo({
				top: 0,
				behavior: "smooth",
			});
			setActiveQuestionSet(id);
		}
	};

	const findQuestionsFromUserQuestions = (ids) => {
		return userQuestions.filter((item) => ids.includes(item._id));
	};

	const findQuestionSetFromQuestionSets = (id, type = 1) => {
		const foundQuestionSet = questionSets.find((item) => item._id === id);
		if (type === 1) {
			return foundQuestionSet
		} else if (type === 2) {
			return foundQuestionSet?.questionsList ?? [];
		}
	};
	const findFreeQuestions = () => {
		const _freeQuestion = userQuestions.filter(question => {
			question._Id
		})
	}

	const filteredQuestionSets = questionSets.filter((collection) =>
		collection.name.toLowerCase().includes(handleValueSearchInput.toLowerCase())
	);

	const activeQuestionSetQuestions = findQuestionsFromUserQuestions(
		findQuestionSetFromQuestionSets(activeQuestionSet, 2)
	);
	if(activeQuestionSetQuestions) {
		console.log(activeQuestionSetQuestions, "coś takiego")
	}
	// usuniecie uzywanych pytan w zbiorze
	const skippedQuestions = userQuestions.filter(userQuestion => 
		!activeQuestionSetQuestions.some(activeQuestion => activeQuestion._id === userQuestion._id)
	  );
	  
	console.log(skippedQuestions, "skipnięte")


	const filteredAllQuestions = skippedQuestions.filter((question) =>
		question.text
			.toLowerCase()
			.includes(handleAllQuestionsSearchInput.toLowerCase())
	);

	// dodaje pytania do questionSets
	function addQuestionToSet(questionSets, setId, newQuestionId) {
		return questionSets.map(set => {
		  if (set._id === setId) {
			const updatedQuestionsList = [...set.questionsList, newQuestionId];
			return {
			  ...set,
			  questionsList: updatedQuestionsList,
			  questions: updatedQuestionsList.length // Zaktualizowanie ilości pytań
			};
		  }
		  return set;
		});
	  }
	
	// usuwa pytania z questionSets
	function removeQuestionFromSet(questionSets, setId, questionIdToRemove) {
		return questionSets.map(set => {
		  if (set._id === setId) {
			const updatedQuestionsList = set.questionsList.filter(id => id !== questionIdToRemove);
			return {
			  ...set,
			  questionsList: updatedQuestionsList,
			  questions: updatedQuestionsList.length // Zaktualizowanie ilości pytań
			};
		  }
		  return set;
		});
	  }

	
	const switchQuestion = (questionId) => {
		setQuestionSets(prevState => {
			const _activeQuestionSet = findQuestionSetFromQuestionSets(activeQuestionSet)
			if(_activeQuestionSet.questionsList.some(item => item === questionId)) {
				// usuwanie pytania
				return removeQuestionFromSet(questionSets, activeQuestionSet, questionId)
			} else {
				// dodawanie pytania
				return addQuestionToSet(questionSets, activeQuestionSet, questionId)

			}
		})
	}

	const activeQuestionSetObject = questionSets.find(
		(item) => item._id === activeQuestionSet
	) || {
		name: "Brak",
		quantity: 0,
		id: 0,
	};

	return (
		<div>
			{activeQuestionSet ? (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}>
					<div>
						<CollectionItem
							name={activeQuestionSetObject.name}
							quantity={activeQuestionSetObject.questions}
							id={activeQuestionSetObject._id}
							handleSetActiveQuestionSet={handleSetActiveQuestionSet}
						/>
					</div>
					<div>
						<div>
							<h2 className="text-lg">Pytania w zbiorze</h2>
							<div className="grid grid-cols-3 gap-[2px]">
								<AnimatePresence>
									{activeQuestionSetQuestions.map((activeUserQuestionSet) => (
										<FreeQuestionItem
											key={activeUserQuestionSet._id}
											id={activeUserQuestionSet._id}
											text={activeUserQuestionSet.text}
											mode="remove"
											funcOnClick={switchQuestion}
										/>
									))}
								</AnimatePresence>
							</div>
						</div>
						<div>
							<div className="flex justify-between">
								<h3 className="text-2xl">Wszystkie pytania</h3>
								<InputC
									placeholder="Wyszukaj pytania"
									value={handleAllQuestionsSearchInput}
									onChange={(e) =>
										setHandleAllQuestionsSearchInput(e.target.value)
									}
								/>
							</div>
							<div className="grid grid-cols-3 gap-[2px]">
								<AnimatePresence>
									{filteredAllQuestions.map((userQuestion) => (
										<FreeQuestionItem
											key={userQuestion._id}
											id={userQuestion._id}
											text={userQuestion.text}
											funcOnClick={switchQuestion}
										/>
									))}
								</AnimatePresence>
							</div>
						</div>
					</div>
				</motion.div>
			) : (
				<motion.div
					className="relative"
					layout
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}>
					<div className="flex gap-1 sticky top-16 bg-black/10 backdrop-blur-md z-50">
						<InputC
							className="w-full"
							value={handleValueSearchInput}
							onChange={(e) => setHandleValueSearchInput(e.target.value)}
							placeholder="Wyszukaj zbiór..."
						/>
						<ButtonC className="shrink-0">Nowy zbiór</ButtonC>
					</div>
					<div className="flex flex-col p-4">
						<AnimatePresence>
							{filteredQuestionSets.map((item) => (
								<CollectionItem
									key={item._id}
									name={item.name}
									quantity={item.questions}
									id={item._id}
									handleSetActiveQuestionSet={handleSetActiveQuestionSet}
								/>
							))}
						</AnimatePresence>
					</div>
				</motion.div>
			)}
		</div>
	);
}

const CollectionItem = ({ name, quantity, id, handleSetActiveQuestionSet }) => {
	return (
		<motion.div
			layout
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			onClick={() => handleSetActiveQuestionSet(id)}>
			<OppositedBoxC
				variant="b"
				className="border-white/20 p-2 flex gap-2 hover:bg-gradient-to-t from-white/10 to-white/5 text-white/60 hover:text-white/80 cursor-pointer">
				<div className="flex justify-center items-center">
					<Folder className="w-8 h-8" />
				</div>
				<div className="flex flex-col">
					<div>
						<p className="text-lg font-medium">{name}</p>
					</div>
					<div>
						<p className="text-sm">
							{quantity}{" "}
							{quantity === 1
								? "pytanie"
								: quantity > 1 && quantity < 5
								? "pytania"
								: "pytań"}
						</p>
					</div>
				</div>
			</OppositedBoxC>
		</motion.div>
	);
};

const FreeQuestionItem = ({ id, text, funcOnClick, mode = "add" }) => {
	return (
		<motion.div
			key={id}
			className="relative w-full overflow-hidden rounded-lg"
			layout
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}>
			<div className="flex group ">
				<div className="bg-white/10 rounded-lg py-1 px-2 w-full relative overflow-hidden">
						<p className="whitespace-nowrap overflow-hidden text-ellipsis">
							{text}
						</p>
					<div className="absolute flex -translate-y-full left-0 top-0 w-full h-full justify-center items-center group-hover:translate-y-0 transition-all bg-white/20 cursor-pointer backdrop-blur-sm rounded-lg" onClick={() => funcOnClick(id)}>
					<p className="select-none">
						{mode === "add" ? "dodaj" : "usuń"}
					</p>
					</div>
				</div>
			</div>
		</motion.div>
	);
};
