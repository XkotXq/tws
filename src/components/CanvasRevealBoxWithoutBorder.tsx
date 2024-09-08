"use client";
import React from "react";

import { AnimatePresence, motion } from "framer-motion";
import { CanvasRevealEffect } from "@/components/ui/canvas-reveal-effect";

export function CanvasRevealBoxWithoutBorder({children, colors}) {
  return (
    <div
      className="flex flex-col lg:flex-row overflow-hidden items-center bg-black w-full gap-4 mx-auto px-8 relative"
    >
        <div className="text-white z-10 w-full">
            {
                children
            }
        </div>
      <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full w-full absolute inset-0"
          >
            <CanvasRevealEffect
              animationSpeed={5}
              containerClassName="bg-transparent"
              colors={colors}
              opacities={[0.2, 0.2, 0.2, 0.2, 0.2, 0.4, 0.4, 0.4, 0.4, 1]}
              dotSize={2}
            />
          </motion.div>
      </AnimatePresence>
    </div>
  );
}
