import { motion } from "motion/react";
import { Globe, ArrowRight } from "lucide-react";

interface LandingPageProps {
  onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-950 to-slate-950" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center space-y-8"
      >
        <div className="flex justify-center">
          <div className="p-6 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl">
            <Globe className="w-20 h-20 text-blue-500" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-display font-bold tracking-tighter text-white">
            E-world
          </h1>
          <p className="text-xl text-slate-400 font-medium">
            Real-time global news, mapped.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onEnter}
          className="group px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold text-lg flex items-center gap-3 mx-auto transition-all shadow-lg shadow-blue-900/20"
        >
          Enter the Map
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </motion.div>
    </div>
  );
};
