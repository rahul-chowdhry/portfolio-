import { motion } from "framer-motion";

export default function FloatingOrb({
  size = 300,
  top = "10%",
  left = "70%",
}) {
  return (
    <motion.div
      style={{
        width: size,
        height: size,
        top,
        left,
      }}
      className="floating-orb"
      animate={{
        x: [0, 35, -20, 0],
        y: [0, -30, 25, 0],
        scale: [1, 1.08, 0.95, 1],
      }}
      transition={{
        duration: 10,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}