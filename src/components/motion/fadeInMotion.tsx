import { motion } from "framer-motion";
import { HTMLMotionProps } from "framer-motion";

type FadeInMotionProps = HTMLMotionProps<"div"> & {
  gridKey?: string;
};

const FadeInMotion = ({
  className,
  gridKey,
  children,
  ...props
}: FadeInMotionProps) => {
  return (
    <motion.div
      className={className}
      key={gridKey}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default FadeInMotion;
