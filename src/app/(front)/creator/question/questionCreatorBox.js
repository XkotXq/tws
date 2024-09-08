"use client";

import { useEffect, useState } from "react";
import QuestionCard from "./questionCard";
import {
	Button,
	CircularProgress,
	Code,
	Divider,
	Input,
	Switch,
} from "@nextui-org/react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import {
	FileQuestion03,
	Folder,
	List,
	Plus,
	Trash03,
	X,
} from "@untitled-ui/icons-react";
import { InputC, ButtonC, BorderedBoxC } from "@/components/customComponents";

export default function QuestionCreatorBox() {
	const [activeQuestion, setActiveQuestion] = useState(0);
	const [nameOfQuestionSet, setNameOfQuestionSet] = useState("");
	const [randomQuestions, setRandomQuestions] = useState(true);
	const [questionSetList, setQuestionSetList] = useState([]);
	const [isGettedQuestionSetList, setIsGettedQuestionSetList] = useState(false);
	const [isActiveAddCollection, setIsActiveAddCollection] = useState(false);
	// const [invalidQuestions, setInvalidQuestions] = useState([]);
	const [errorSheet, setErrorSheet] = useState("");
	const [errorImportSheet, setErrorImportSheet] = useState("");
	const [skipBadQuestions, setSkipBadQuestions] = useState(false);
	const [successSheet, setSuccessSheet] = useState("");
	const [valueImportTextarea, setValueImportTextarea] = useState("");
	const [questions, setQuestions] = useState([
		{
			text: "",
			options: ["", "", "", ""],
			correctOption: null,
			randomPositionKey: true,
		},
	]);

	useEffect(() => {
		getQuestionSets();
	}, []);

	const addAnswer = () => {
		if (questions[activeQuestion].options.length <= 10)
			setQuestions((prevQuestions) => {
				const updatedQuestions = [...prevQuestions];
				updatedQuestions[activeQuestion] = {
					...updatedQuestions[activeQuestion],
					options: [...updatedQuestions[activeQuestion].options, ""],
				};
				return updatedQuestions;
			});
	};
	const afterActiveQuestion = () => {
		setActiveQuestion(activeQuestion - 1);
	};
	const nextActiveQuestion = () => {
		if (questions.length >= activeQuestion + 1)
			setActiveQuestion(activeQuestion + 1);
	};
	const setQuestionsDefault = () => {
		setActiveQuestion(0);
		setQuestions([
			{
				text: "",
				options: ["", "", "", ""],
				correctOption: null,
				randomPositionKey: true,
			},
		]);
	};

	const createQuestion = () => {
		const _activeQuestion = questions[activeQuestion];
		if (
			_activeQuestion.text &&
			_activeQuestion.options.every(
				(option) =>
					option.trim() !== "" && _activeQuestion.correctOption !== null
			)
		) {
			setQuestions((prevQuestions) => {
				const updatedQuestions = [...prevQuestions];
				updatedQuestions.push({
					text: "",
					options: Array(questions[activeQuestion].options.length).fill(""),
					correctOption: null,
					randomPositionKey: true,
				});
				return updatedQuestions;
			});
			setActiveQuestion(questions.length);
		}
	};

	const sendQuestionsForQuestionSet = async (_id) => {
		let invalidQuestions = [];
		for (const [index, question] of questions.entries()) {
			if (
				question.text.trim() === "" ||
				question.options.some((option) => option.trim() === "") ||
				question.correctOption === null
			) {
				invalidQuestions.push(index);
			}
		}
		if (invalidQuestions.length > 0) {
			setErrorSheet(
				`Pytani${
					invalidQuestions.length > 1 ? "a" : "e"
				} ${invalidQuestions.map((item) => item + 1)} ${
					invalidQuestions.length > 1 ? "są" : "jest"
				} niepoprawnie przygotowane (pytania nie zostały wysłane)`
			);
			return;
		}

		try {
			const data = {
				id: _id,
				questions: questions,
			};
			const res = await fetch(
				"http://localhost:3000/api/content/questionSet/question",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ data }),
				}
			);

			if (!res.ok) {
				console.log("błąd podczas wysyłania pytań");
				return;
			}
			setSuccessSheet("Pomyślnie dodano pytania do zbioru");
			setQuestionsDefault();
			const returndedData = await res.json();
			setQuestionSetList((prevState) => {
				return prevState.map((item) => {
					if (item._id === returndedData.id) {
						return { ...item, questions: returndedData.questions };
					}
					return item;
				});
			});
		} catch (err) {
			console.error(err);
		}
	};

	const getQuestionSets = async () => {
		try {
			const res = await fetch("http://localhost:3000/api/content/questionSet", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (!res.ok) {
				setIsGettedQuestionSetList(true);
				console.error("błąd podczas pobierania danych");
				return;
			}
			const { data } = await res.json();
			console.log(data);
			setQuestionSetList(data.questionSets);
			setIsGettedQuestionSetList(true);
		} catch (err) {
			console.error(err);
		}
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
				setIsGettedQuestionSetList(true);
				console.error("nie stworzono zbioru pytań");
				return;
			}
			setSuccessSheet("Pomyślnie stworzono zbiór");
			const { data } = await res.json();
			const { name, id, questions } = data;
			setQuestionSetList((prevState) => {
				return [...prevState, { name, _id: id, questions }];
			});
			setIsGettedQuestionSetList(true);
		} catch (err) {}
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
			setQuestionSetList((prevState) => {
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

			setQuestionSetList((prevState) => {
				const updatedState = [...prevState];
				return updatedState.filter((item) => item._id !== id);
			});
		} catch (err) {
			console.error(err);
		}
	};

	const getQuestionsForQuestionSet = async (id) => {
		try {
			const _activequestionSetList = questionSetList.filter(
				(item) => id === item._id
			);
			console.log(_activequestionSetList[0]);
			const res = await fetch(
				"http://localhost:3000/api/content/questionSet/all",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						questionsReference: _activequestionSetList[0].questionsList,
					}),
				}
			);
		} catch (error) {
			console.error(err);
		}
	};
	const deleteQuestion = () => {
		if (questions.length - 1 > 0) {
			setQuestions((prevState) => {
				const updatedState = [...prevState];
				updatedState.splice(activeQuestion, 1);
				return updatedState;
			});
			setActiveQuestion(questions.length - 2);
		}
	};
	const sendOnlyQuestion = async () => {
		let invalidQuestions = [];
		for (const [index, question] of questions.entries()) {
			if (
				question.text.trim() === "" ||
				question.options.some((option) => option.trim() === "") ||
				question.correctOption === null
			) {
				invalidQuestions.push(index);
			}
		}
		if (invalidQuestions.length > 0) {
			setErrorSheet(
				`Pytani${
					invalidQuestions.length > 1 ? "a" : "e"
				} ${invalidQuestions.map((item) => item + 1)} ${
					invalidQuestions.length > 1 ? "są" : "jest"
				} niepoprawnie przygotowane (pytania nie zostały wysłane)`
			);
			return;
		}
		try {
			const res = await fetch("http://localhost:3000/api/content/question", {
				method: "POST",
				headers: {
					"Conent-Type": "application/json",
				},
				body: JSON.stringify({
					questions,
				}),
			});
			if (!res.ok) {
				setErrorSheet("Błąd podczas wysyłania pytań");
			}
			setSuccessSheet("Pomyślnie dodano pytania");
			setQuestionsDefault();
		} catch (err) {
			console.error(err);
		}
	};
	const copyToClipboard = async (text) => {
		try {
			await navigator.clipboard.writeText(text);
		} catch (err) {
			console.error("Nie udało się skopiować tekstu: ", err);
		}
	};
	const handleDownload = () => {
		const json = JSON.stringify(questions, null, 2);
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `kreator_tws-${questions.length}-${
			questions.length === 1
				? "pytanie"
				: questions.length > 1 && questions.length < 5
				? "pytania"
				: "pytan"
		}.json`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};
	const mapKeys = (obj, keyMap) => {
		return Object.keys(obj).reduce((acc, key) => {
			const newKey = keyMap[key] || key;
			acc[newKey] = obj[key];
			return acc;
		}, {});
	};

	const mapKeysForArray = (arr, keyMap) => {
		return arr.map((item) => mapKeys(item, keyMap));
	};
	const keyMap = {
		text: "pytanie",
		options: "odpowiedzi",
		correctOption: "poprawna_odpowiedz",
		randomPositionKey: "losowa_kolejnosc_pytan",
	};
	const reverseKeyMap = {
		pytanie: "text",
		odpowiedzi: "options",
		poprawna_odpowiedz: "correctOption",
		losowa_kolejnosc_pytan: "randomPositionKey",
	};
	const handleFileChange = (event) => {
		const file = event.target.files[0];

		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const json = JSON.parse(e.target.result);

					if (Array.isArray(json) && json.every(isValidQuestion)) {
						setQuestions((prevQuestions) => [...prevQuestions, ...json]);
						setError(null);
					} else {
						setError("Niepoprawna struktura pliku JSON.");
					}
				} catch (err) {
					setError("Nie udało się przetworzyć pliku JSON.");
				}
			};

			reader.readAsText(file);
		}
	};

	const isValidQuestion = (_question) => {
		return (
			_question.hasOwnProperty("text") &&
			Array.isArray(_question.options) &&
			typeof _question.correctOption === "number" &&
			typeof _question.randomPositionKey === "boolean"
		);
	};
	const isEmptyQuestion = (_question) => {
		return (
			_question.text === "" &&
			_question.options.some((item) => item === "") &&
			_question.correctOption === null
		);
	};
	const handleConvert = () => {
		try {
			const parsedInput = JSON.parse(valueImportTextarea);
			if (Array.isArray(parsedInput)) {
				const converted = mapKeysForArray(parsedInput, reverseKeyMap);
				const clearedConvert = converted.filter(
					(item) => !isEmptyQuestion(item)
				);
				console.log(clearedConvert);
				if (clearedConvert.every(isValidQuestion)) {
					if (isEmptyQuestion(questions[questions.length - 1])) {
						setQuestions((prevState) => {
							const updatedState = [...prevState];
							updatedState.pop();
							return updatedState;
						});
					}
					setQuestions((prevState) => {
						return [...prevState, ...clearedConvert];
					});
					setValueImportTextarea("");
				}
			} else {
				console.log("Błąd: Wprowadzony JSON musi być tablicą.");
			}
		} catch (error) {
			console.log("Błąd: Nieprawidłowy JSON.");
			console.error(error);
		}
	};
	return (
		<div className="flex flex-col gap-2 my-2">
			<div className="flex w-full justify-between">
				<h2 className="text-3xl font-bold">Numer pytania</h2>
				<div className="flex gap-2">
					<Sheet>
						<SheetTrigger>
							<span className="text-[#a8a8a8] h-[38px] flex justify-center items-center">
								Export pytań
							</span>
						</SheetTrigger>
						<SheetContent
							className="border-[#303030] h-full flex flex-col"
							aria-describedby="panel-zapisywania-pytań">
							<SheetHeader className="text-2xl font-bold">
								<SheetTitle>Export pytań</SheetTitle>
							</SheetHeader>
							<BorderedBoxC className="flex flex-col mt-2 flex-grow overflow-hidden">
								{/* <div className="flex justify-between items-end w-full">
								</div> */}
								<div className="p-0.5 flex-grow overflow-y-auto bg-white/10">
									{questions.filter((item) => !isEmptyQuestion(item)).length >
									0 ? (
										<pre className="text-sm text-wrap">
											{JSON.stringify(
												mapKeysForArray(
													questions.filter((item) => !isEmptyQuestion(item)),
													keyMap
												),
												null,
												2
											)}
										</pre>
									) : (
										<p className="text-center">brak pytań spełniających warunki</p>
									)}
								</div>
							</BorderedBoxC>
							<div className="w-full flex flex-col gap-0.5">
								<ButtonC
								isDisabled={questions.filter((item) => !isEmptyQuestion(item)).length ? false : true}
									onClick={() =>
										copyToClipboard(
											JSON.stringify(
												mapKeysForArray(questions, keyMap),
												null,
												2
											)
										)
									}
									className="w-full"
									style={{ width: "calc(100% - 0.5rem)", height: "auto" }}>
									Kopiuj do schowka
								</ButtonC>
								<ButtonC
									isDisabled={questions.filter((item) => !isEmptyQuestion(item)).length ? false : true}
									onClick={handleDownload}
									className="w-full"
									style={{ width: "calc(100% - 0.5rem)", height: "auto" }}>
									Pobierz pytania .json
								</ButtonC>
							</div>
						</SheetContent>
					</Sheet>
					<Sheet>
						<SheetTrigger>
							<span className="text-[#a8a8a8] h-[38px] flex justify-center items-center">
								Import pytań
							</span>
						</SheetTrigger>
						<SheetContent
							className="border-[#303030] h-full flex flex-col"
							aria-describedby="panel-zapisywania-pytań">
							<SheetHeader className="text-2xl font-bold">
								<SheetTitle>Import pytań</SheetTitle>
							</SheetHeader>
							<Switch
								value={skipBadQuestions}
								onValueChange={setSkipBadQuestions}>
								Podczas dodawania pomiń źle sformatowane pytania
							</Switch>
							<BorderedBoxC className="flex flex-col flex-grow p-0.5 overflow-hidden bg-white/10">
								{/* <div className="flex justify-between items-end w-full">
								</div> */}
								<div className="flex-grow">
									<textarea
										value={valueImportTextarea}
										onChange={(e) => setValueImportTextarea(e.target.value)}
										className="w-full h-full outline-none max-h-full bg-transparent resize-none"
										placeholder="JSON z pytaniami"
									/>
								</div>
							</BorderedBoxC>
							<div className="w-full flex flex-col gap-0.5">
								<ButtonC
									onClick={handleConvert}
									className="w-full"
									style={{ width: "calc(100% - 0.5rem)", height: "auto" }}>
									Importuj pytania
								</ButtonC>
								<ButtonC
									onClick={handleDownload}
									className="w-full"
									style={{ width: "calc(100% - 0.5rem)", height: "auto" }}>
									Importuj z pliku .json
								</ButtonC>
								<input
									type="file"
									accept="application/json"
									onChange={handleFileChange}
									// style={{ display: "none" }}
									// className=""
								/>
							</div>
						</SheetContent>
					</Sheet>
					<Sheet>
						<SheetTrigger>
							<span className="text-[#a8a8a8] h-[38px] flex justify-center items-center">
								Zapisz pytania
							</span>
						</SheetTrigger>
						<SheetContent
							className="border-[#303030] h-full flex flex-col"
							aria-describedby="panel-zapisywania-pytań">
							<SheetHeader className="text-2xl font-bold">
								<SheetTitle>Zapisywanie pytań</SheetTitle>
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
									<button
										className="text-white rounded-lg font-bold transform hover:-translate-y-1 transition duration-400"
										onClick={sendOnlyQuestion}>
										Zapisz pytania
									</button>
								</div>
								<Divider />
								<div className="py-5 flex-grow overflow-y-auto">
									{isGettedQuestionSetList ? (
										questionSetList.length > 0 ? (
											<div className="flex flex-col gap-2">
												{questionSetList.map((item) => (
													<QuestionSetBar
														key={item._id}
														name={item.name}
														id={item._id}
														questions={item.questions}
														deleteQuestionSet={deleteQuestionSet}
														deleteAllQuestionSet={deleteAllQuestionSet}
														sendQuestionsForQuestionSet={
															sendQuestionsForQuestionSet
														}
														getQuestionsForQuestionSet={
															getQuestionsForQuestionSet
														}
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
													onChange={(e) => setNameOfQuestionSet(e.target.value)}
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
										style={{ width: "calc(100% - 0.5rem)", height: "auto" }}
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
			</div>
			<div className="w-full gap-1 flex">
				{questions.map((item, index) => (
					<ButtonC
						key={index}
						// color="warning"
						className="text-[#a8a8a8] aspect-square h-[38px]"
						isDisabled={index === activeQuestion ? true : false}
						onClick={() => setActiveQuestion(index)}>
						{index + 1}
					</ButtonC>
				))}
			</div>
			<div className="flex w-full gap-1">
				<ButtonC
					className="w-full"
					onClick={afterActiveQuestion}
					isDisabled={0 <= activeQuestion - 1 ? false : true}>
					Poprzednie pytanie
				</ButtonC>
				<ButtonC className="w-full" onClick={deleteQuestion}>
					Usuń pytanie
				</ButtonC>
				<ButtonC className="w-full" onClick={addAnswer}>
					Dodaj odpowiedź
				</ButtonC>
				{activeQuestion + 1 === questions.length ? (
					<ButtonC className="w-full" onClick={createQuestion}>
						Nowe pytanie
					</ButtonC>
				) : (
					<ButtonC className="w-full" onClick={nextActiveQuestion}>
						Następne pytanie
					</ButtonC>
				)}
			</div>
			<QuestionCard
				questions={questions}
				setQuestions={setQuestions}
				activeQuestion={activeQuestion}
			/>
		</div>
	);
}

const QuestionSetBar = ({
	name,
	id,
	deleteQuestionSet,
	questions,
	sendQuestionsForQuestionSet,
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
							sendQuestionsForQuestionSet(id);
						}}>
						<Plus /> dodaj pytania do zbioru
					</button>
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
						<Trash03 /> usuń zbiór
					</button>
					<button
						className="w-full hover:bg-primary-400/30 p-2 flex gap-2 text-danger-500 rounded-lg"
						onClick={() => deleteAllQuestionSet(id)}>
						<Trash03 /> usuń zbiór razem z pytaniami
					</button>
				</div>
			)}
		</div>
	);
};
