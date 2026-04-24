import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { History, Map as MapIcon, Trophy, Globe, X, Sparkles, Activity } from 'lucide-react';
import { HistoryMini } from './HistoryMini';
import { MapMini } from './MapMini';
import { QuizMini } from './QuizMini';
import { StoryMini } from './StoryMini';
import { cn } from '../lib/utils';

export const PulseSidebar = () => {
  const [activeFeature, setActiveFeature] = useState<'history' | 'map' | 'quiz' | 'diaspora' | null>(null);

  const features = [
    { id: 'history', icon: History, label: "L'Histoire", color: "bg-slate-900", text: "Ce jour dans l'histoire" },
    { id: 'map', icon: MapIcon, label: "La Carte", color: "bg-amber-500", text: "Carte interactive" },
    { id: 'quiz', icon: Trophy, label: "Le Quiz", color: "bg-emerald-600", text: "Défiez vos connaissances" },
    { id: 'diaspora', icon: Globe, label: "Diaspora", color: "bg-indigo-600", text: "Sucess Stories" },
  ];

  return (
    <>
      {/* Floating Buttons */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-3 pointer-events-none">
        {features.map((f, i) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.1 }}
            className="pointer-events-auto"
          >
            <button
              onClick={() => setActiveFeature(f.id as any)}
              className={cn(
                "w-12 h-12 rounded-[20px] flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-all group relative",
                f.color
              )}
              title={f.text}
            >
              <f.icon size={20} />
              <div className="absolute right-full mr-4 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-2xl border border-white/10 hidden lg:block">
                 {f.text}
                 <div className="absolute top-1/2 -translate-y-1/2 -right-1.5 border-4 border-transparent border-l-slate-900" />
              </div>
            </button>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeFeature && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 md:p-10 pointer-events-none">
             <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm pointer-events-auto"
               onClick={() => setActiveFeature(null)}
             />
             <div className="relative z-10 w-full max-w-md pointer-events-auto">
                <AnimatePresence mode="wait">
                  {activeFeature === 'history' && <HistoryMini key="h" onClose={() => setActiveFeature(null)} />}
                  {activeFeature === 'map' && <MapMini key="m" onClose={() => setActiveFeature(null)} />}
                  {activeFeature === 'quiz' && <QuizMini key="q" onClose={() => setActiveFeature(null)} />}
                  {activeFeature === 'diaspora' && <StoryMini key="d" onClose={() => setActiveFeature(null)} />}
                </AnimatePresence>
             </div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Activity Pulse Indicator */}
      <div className="fixed left-6 bottom-6 z-50 pointer-events-none hidden lg:block">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-white/80 backdrop-blur-md border border-slate-100 px-4 py-2.5 rounded-full flex items-center gap-3 shadow-lg"
         >
            <div className="relative">
               <Activity size={14} className="text-emerald-500" />
               <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kassiri Pulse <span className="text-emerald-500 ml-1">Live</span></span>
         </motion.div>
      </div>
    </>
  );
};
