import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '' }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={`relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-xl overflow-hidden ${className}`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 pointer-events-none" />
            <div className="relative z-10 p-6">
                {children}
            </div>
        </motion.div>
    );
};

export const NeonButton = ({ children, onClick, active, className = '', ...props }) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(0, 255, 255, 0.7)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`
        relative px-6 py-3 rounded-lg font-bold text-white transition-all
        bg-transparent border border-cyan-500 shadow-[0_0_10px_rgba(0,255,255,0.5)]
        hover:bg-cyan-500/20 hover:border-cyan-400
        ${active ? 'bg-cyan-500/40 border-cyan-300 shadow-[0_0_20px_rgba(0,255,255,0.8)]' : ''}
        ${className}
      `}
            {...props}
        >
            {children}
        </motion.button>
    );
};
