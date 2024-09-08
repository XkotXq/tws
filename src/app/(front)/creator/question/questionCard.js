"use client";

import {
	Button,
	Input,
	Popover,
	PopoverTrigger,
	PopoverContent,
} from "@nextui-org/react";
import { Check, Image02, Trash04, X } from "@untitled-ui/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { InputC, ButtonC } from "@/components/customComponents"

export default function QuestionCard({
	activeQuestion,
	questions,
	setQuestions,
}) {

	const updateQuestionText = (newText) => {
		setQuestions((prevQuestions) => {
			const updatedQuestions = [...prevQuestions];
			updatedQuestions[activeQuestion].text = newText;
			return updatedQuestions;
		});
	};
	const handleUpdateAnswer = (indexOption, newText) => {
		setQuestions((prevQuestions) => {
			const updatedQuestions = [...prevQuestions];
			updatedQuestions[activeQuestion].options[indexOption] = newText;
			return updatedQuestions;
		});
	};

	const deleteAnswer = (index) => {
		if (questions[activeQuestion].options.length > 2) {

			setQuestions((prevQuestions) => {
				const updatedQuestions = [...prevQuestions];
				const updatedOptions = [...updatedQuestions[activeQuestion].options];
				
				// Remove the option at the specified index
			updatedOptions.splice(index, 1);

			updatedQuestions[activeQuestion] = {
				...updatedQuestions[activeQuestion],
				options: updatedOptions,
			};
			
			return updatedQuestions;
		});
		if (index < questions[activeQuestion].correctOption)
			setCorrectAnswer(questions[activeQuestion].correctOption - 1);
		else if (index === questions[activeQuestion].correctOption)
			setCorrectAnswer(null);
		}
	};
	const setCorrectAnswer = (index) => {
		setQuestions((prevQuestions) => {
			const updatedQuestions = [...prevQuestions];
			updatedQuestions[activeQuestion].correctOption = index;
			return updatedQuestions;
		});
	};

	return (
		<div className="flex flex-col gap-1">
			<div className="flex gap-1">
				<InputC
					type="text"
					value={questions[activeQuestion].text}
					onChange={(e) => updateQuestionText(e.target.value)}
					placeholder="Pytanie"
					className="w-full"
					variant="dashed"
				/>
				<ButtonC className="text-[#a8a8a8] aspect-square h-[38px] flex justify-center items-center">
					<Image02 />
				</ButtonC>
			</div>
			<AnimatePresence>
				<div className="flex gap-1.5">
					<div className="flex gap-2 flex-col w-full">
						{questions[activeQuestion].options.map((value, index) => (
							<motion.div
								key={index}
								initial={{ scale: 0.9, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0.9, opacity: 0 }}
								transition={{ type: "spring" }}
								layout>
								<QuestionCardRow
									key={index}
									index={index}
									isCorrect={
										index === parseInt(questions[activeQuestion].correctOption)
											? true
											: false
									}
									value={questions[activeQuestion].options[index]}
									setCorrectAnswer={setCorrectAnswer}
									deleteAnswer={deleteAnswer}
									updateAnswer={handleUpdateAnswer}
									isDisabled={questions[activeQuestion].options.length > 2 ? false : true}
								/>{" "}
							</motion.div>
						))}
					</div>
				</div>
			</AnimatePresence>
		</div>
	);
}

const QuestionCardRow = ({
	value,
	index,
	deleteAnswer,
	isCorrect,
	setCorrectAnswer,
	updateAnswer,
	isDisabled
}) => {
	const [popoverIsOpen, setPopoverIsOpen] = useState(false);
	const handleInputChange = (e) => {
		updateAnswer(index, e.target.value);
	};
	return (
		<div className="flex gap-1 relative">
			{value.trim() === "" ? (
				<ButtonC
					className="text-[#a8a8a8] aspect-square h-[38px] flex justify-center items-center"
					isDisabled={isDisabled}
					onClick={() => {
						deleteAnswer(index);
					}}>
					<Trash04 />
				</ButtonC>
			) : (
				<Popover
					showArrow
					placement="bottom-start"
					isOpen={popoverIsOpen}
					onOpenChange={(open) => setPopoverIsOpen(open)}>
					<PopoverTrigger>
						<ButtonC isIconOnly isDisabled={isDisabled} className="text-[#a8a8a8] aspect-square h-[38px] flex justify-center items-center">
							<Trash04 />
						</ButtonC>
					</PopoverTrigger>
					<PopoverContent>
						<div className="p-2">
							<h1 className="text-lg font-bold">Potwierdź usunięcie</h1>
							<p className="mt-3">Jesteś pewny, aby usunąć tą odpowiedź?</p>
							<div className="flex gap-2 justify-end mt-2">
								<button
									className="px-3 py-2 text-white underline text-sm rounded-md font-semibold hover:bg-black/[0.2] hover:shadow-lg"
									onClick={() => setPopoverIsOpen(false)}>
									Anuluj
								</button>
								<button
									isDisabled={isDisabled}
									className="px-3 py-2 text-danger-500 underline text-sm rounded-md font-semibold hover:bg-black/[0.2] hover:shadow-lg disabled:text-danger-200"
									onClick={() => {
										deleteAnswer(index);
										setPopoverIsOpen(false);
									}}>
									Usuń
								</button>
							</div>
						</div>
					</PopoverContent>
				</Popover>
			)}
			<InputC placeholder="Odpowiedź" value={value} onChange={handleInputChange} type="text" className="w-full" isCorrect={isCorrect}/>
			<ButtonC
				// color="warning"
				// variant="ghost"
				// isIconOnly
				className="text-[#a8a8a8] aspect-square h-[38px] flex justify-center items-center"
				isCorrect={isCorrect}
				onClick={() => setCorrectAnswer(index)}>
				{isCorrect ? <Check /> : <X />}
			</ButtonC>
		</div>
	);
};
