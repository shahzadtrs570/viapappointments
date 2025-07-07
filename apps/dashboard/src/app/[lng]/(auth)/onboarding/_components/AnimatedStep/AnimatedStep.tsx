import { motion } from "framer-motion"

import type { Variants } from "framer-motion"

import { useAnimatedStep } from "../../_hooks/useAnimatedStep"

const variants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 200 : -200,
    opacity: 0,
  }),
}

type AnimatedStepProps = {
  previousStep: React.MutableRefObject<number>
  children: React.ReactNode
}

export function AnimatedStep({
  children,
  previousStep: previousStepIndex,
}: AnimatedStepProps) {
  const { activeStep } = useAnimatedStep(previousStepIndex)

  return (
    <motion.div
      animate="center"
      className="w-full"
      custom={activeStep - previousStepIndex.current}
      exit="exit"
      initial="enter"
      variants={variants}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 1,
      }}
    >
      {children}
    </motion.div>
  )
}
