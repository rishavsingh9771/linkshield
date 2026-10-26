import React from 'react';
import { motion } from 'framer-motion';

export default function GlassCard({
  children,
  className = '',
  hoverEffect = true,
  glow = false,
  onClick,
  ...props
}) {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -2, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
      className={`
        relative rounded-xl backdrop-blur-xl bg-[#091124]/75
        border border-cyan-500/20
        shadow-xl shadow-black/40
        ${glow ? 'shadow-cyan-950/40 border-cyan-500/40' : ''}
        ${hoverEffect ? 'hover:border-cyan-500/40 hover:shadow-cyan-950/30' : ''}
        transition-all duration-300
        ${className}
      `}
      {...props}
    >
      {/* Subtle corner tech decoration */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-cyan-400/40 rounded-tl pointer-events-none" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-cyan-400/40 rounded-tr pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-cyan-400/40 rounded-bl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-cyan-400/40 rounded-br pointer-events-none" />

      {children}
    </motion.div>
  );
}
