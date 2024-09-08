"use client";
import React from "react";

import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";

export function CanvasRevealEffectBox({children, colors, dotSize=2, className}) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={"flex flex-col lg:flex-row overflow-hidden border border-white/[0.2] items-center justify-center bg-black gap-4 mx-auto px-8 relative " + className}
    >
        <Icon className="absolute h-6 w-6 -top-3 -left-3 dark:text-[#a8a8a8] text-black z-10" />
			<Icon className="absolute h-6 w-6 -bottom-3 -left-3 dark:text-[#a8a8a8] text-black z-10" />
			<Icon className="absolute h-6 w-6 -top-3 -right-3 dark:text-[#a8a8a8] text-black z-10" />
			<Icon className="absolute h-6 w-6 -bottom-3 -right-3 dark:text-[#a8a8a8] text-black z-10" />
      {/* <p className="md:text-2xl text-2xl font-medium text-center text-white relative z-20 max-w-2xl mx-auto ">
        With insomnia, nothing&apos;s real. Everything is far away. Everything
        is a copy, of a copy, of a copy
      </p> */}
      {children}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full absolute inset-0"
          >
            <CanvasRevealEffect
                showGradient={0}
              animationSpeed={5}
              containerClassName="bg-transparent"
              colors={colors}
              opacities={[0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.4, 0.4, 0.4, 1]}
              dotSize={dotSize}
            />
          </motion.div>
        )}
      </AnimatePresence>
      {/* Radial gradient for the cute fade */}
      <div className="absolute inset-0 [mask-image:radial-gradient(400px_at_center,white,transparent)] bg-black/50 dark:bg-black/80" />
    </div>
  );
}

export const Icon = ({ className, ...rest }: any) => {
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
