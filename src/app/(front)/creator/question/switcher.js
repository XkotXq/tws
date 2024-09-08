"use client"

import { Tooltip } from "@nextui-org/react";
import { Check, Save01 } from "@untitled-ui/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function Switcher() {
	const [isSaved, setIsSaved] = useState(false);

	return (
       <div className="w-full flex">
        <div>

        <SaveSwitch isSaved={isSaved} setIsSaved={setIsSaved}/>
        </div>
        <div>

        <button onClick={() => setIsSaved(!isSaved)}>przełącz</button>
        </div>
       </div>
	);
}

const SaveSwitch = ({isSaved, setIsSaved}) => {



    const handleSave = () => {
		setIsSaved(!isSaved);
	};

	return (
        <div className="relative z-20 group/canvas-card cursor-pointer w-10 h-10" onClick={handleSave}>
      <AnimatePresence initial={true}>
        {!isSaved ? (
          <motion.div
            key="save"
            initial={{ opacity: 0, y: 24, rotateX: 90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -24, rotateX: 90}}
            transition={{ duration: 0.4 }}
            className="absolute"
          >
            <div className="inline-flex gap-1 justify-center items-center">

            <Save01 className="w-10 h-10" />
            </div>
          </motion.div>
        ): (
          <motion.div
            key="saved"
            initial={{ opacity: 0, y: 24, rotateX: 90 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, y: -24, rotateX: 90 }}
            transition={{ duration: 0.4 }}
            className="absolute"
          >
                <Tooltip content="zapisano w pamięci lokalnej">
            <div className="inline-flex gap-1 justify-center items-center">
                    
            <Check className="w-10 h-10" />
            </div>
                    </Tooltip>   
          </motion.div>
        )}
      </AnimatePresence>
    </div>
	);
}
