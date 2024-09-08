"use client";

import { useRef, forwardRef } from "react";
import clsx from "clsx";

export const InputC = forwardRef(
	({ onValueChange, className, isCorrect, variant = "default", ...props }, ref) => {
	  const inputRef = ref || useRef(null);
  
	  const handleDivClick = () => {
		if (inputRef.current) {
		  inputRef.current.focus();
		}
	  };
  
	  return (
		<div
		  className={clsx(
			"relative m-1 border border-gray-700 p-1.5 transition-all duration-75 hover:bg-gray-500/20",
			{
			  "bg-success-500/30": isCorrect,
			  "border-dashed": variant === "dashed",
			},
			className
		  )}
		  onClick={handleDivClick}
		>
		  <Icon className="absolute h-4 w-4 -top-2 -left-2 dark:text-[#a8a8a8] text-black z-10" />
		  <Icon className="absolute h-4 w-4 -bottom-2 -left-2 dark:text-[#a8a8a8] text-black z-10" />
		  <Icon className="absolute h-4 w-4 -top-2 -right-2 dark:text-[#a8a8a8] text-black z-10" />
		  <Icon className="absolute h-4 w-4 -bottom-2 -right-2 dark:text-[#a8a8a8] text-black z-10" />
		  <input
			ref={inputRef}
			className="w-full h-full bg-transparent outline-none"
			{...props}
		  />
		</div>
	  );
	}
  );
export const TextAreaC = forwardRef(
	({ onValueChange, className, classNameT = "", isCorrect, variant = "default", ...props }, ref) => {
	  const inputRef = ref || useRef(null);
  
	  const handleDivClick = () => {
		if (inputRef.current) {
		  inputRef.current.focus();
		}
	  };
  
	  return (
		<div
		  className={clsx(
			"relative m-1 border border-gray-700 p-1.5 transition-all duration-75 hover:bg-gray-500/20",
			{
			  "bg-success-500/30": isCorrect,
			  "border-dashed": variant === "dashed",
			},
			className
		  )}
		  onClick={handleDivClick}
		>
		  <Icon className="absolute h-4 w-4 -top-2 -left-2 dark:text-[#a8a8a8] text-black z-10" />
		  <Icon className="absolute h-4 w-4 -bottom-2 -left-2 dark:text-[#a8a8a8] text-black z-10" />
		  <Icon className="absolute h-4 w-4 -top-2 -right-2 dark:text-[#a8a8a8] text-black z-10" />
		  <Icon className="absolute h-4 w-4 -bottom-2 -right-2 dark:text-[#a8a8a8] text-black z-10" />
		  <textarea
			ref={inputRef}
			className={clsx("w-full h-full bg-transparent outline-none", classNameT)}
			{...props}
		  />
		</div>
	  );
	}
  );
export const ButtonC = ({
	className,
	children,
	isCorrect,
	isDisabled,
	variant = "default",
	...props
}) => {
	return (
		<button
			className={clsx(
				"relative m-1 border border-gray-700 p-1 transition-all duration-75 disabled:opacity-40 hover:bg-gray-500/20 box-border",
				{
					"bg-success-500/30": isCorrect,
					"border-dashed": variant === "dashed",
				},
				className
			)}
			{...props}
			disabled={isDisabled}>
			<Icon className="absolute h-4 w-4 -top-2 -left-2 dark:text-[#a8a8a8] text-black z-10" />
			<Icon className="absolute h-4 w-4 -bottom-2 -left-2 dark:text-[#a8a8a8] text-black z-10" />
			<Icon className="absolute h-4 w-4 -top-2 -right-2 dark:text-[#a8a8a8] text-black z-10" />
			<Icon className="absolute h-4 w-4 -bottom-2 -right-2 dark:text-[#a8a8a8] text-black z-10" />
			{children}
		</button>
	);
};
export const CheckBoxC = () => {
	return (
		<input type="checkbox" className="w-7 h-7 rounded-none bg-green-900" />
	);
};
export const BorderedBoxC = ({ children, className, variant = "default" }) => {
	return (
		<div
			className={clsx(
				"relative border-gray-700",
				{
					"border": variant === "default",
					"border-x border-b": variant === "tnone",
				},
				className
			)}>
			{variant === "default" && (
				<>
					<Icon className="absolute h-4 w-4 -top-2 -left-2 dark:text-[#a8a8a8] text-black z-10" />
					<Icon className="absolute h-4 w-4 -top-2 -right-2 dark:text-[#a8a8a8] text-black z-10" />
				</>
			)}
			<Icon className="absolute h-4 w-4 -bottom-2 -left-2 dark:text-[#a8a8a8] text-black z-10" />
			<Icon className="absolute h-4 w-4 -bottom-2 -right-2 dark:text-[#a8a8a8] text-black z-10" />
			{children}
		</div>
	);
};
export const OppositedBoxC = ({ children, className, variant = "default" }) => {
	return (
		<div
			className={clsx(
				"relative border-gray-700",
				{
					"border": variant === "default",
					"border-x border-b": variant === "tnone",
					"border-b border-r": variant === "tb",
					"border-b": variant === "b"
				},
				className
			)}>
			{variant === "default" || variant === "tb" && (
				<>
					<Icon className="absolute h-4 w-4 -top-2 -right-2 dark:text-[#a8a8a8] text-black z-10" />
				</>
			)}
			{
				variant === "b" && (
					<Icon className="absolute h-4 w-4 -bottom-2 -right-2 dark:text-[#a8a8a8] text-black z-10" />
				)
			}
			<Icon className="absolute h-4 w-4 -bottom-2 -left-2 dark:text-[#a8a8a8] text-black z-10" />
			{children}
		</div>
	);
};

export const Icon = ({ className, ...rest }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			strokeWidth="2"
			stroke="currentColor"
			className={className}
			{...rest}>
			<path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
		</svg>
	);
};
