import { LoaderCircle  } from "lucide-react";
import { motion } from "framer-motion";

export default function Spinner({ size = 10, color = "text-gray-600" }) {
  return (
    <motion.div
      className={`inline-block   ${color}`}
      animate={{ rotate: 360 }}
      transition={{
        repeat: Infinity,
        ease: "linear",
        duration: 1,
      }}
    >
      <LoaderCircle className={`w-10 h-10 text-yellow-400`} />
    </motion.div>
  );
}
