import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function TargetInput() {
  const [target, setTarget] = useState("");
  const navigate = useNavigate();

  const handleScan = () => {
    if (!target.trim()) return;
    navigate(`/scan?target=${encodeURIComponent(target.trim())}`);
  };

  return (
    <section>
      <h2 className="text-sm font-medium text-dark-200 uppercase tracking-wider mb-3">
        Quick Scan
      </h2>
      <div className="flex items-stretch gap-2">
        <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-dark-800 border border-dark-500/50 focus-within:border-cyan-500/50 transition-colors min-w-0">
          <span className="text-emerald-400 font-mono text-sm font-semibold">$</span>
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleScan()}
            placeholder="example.com / 192.x.x.x"
            className="flex-1 bg-transparent text-white font-mono text-sm outline-none placeholder:text-dark-300 min-w-0"
          />
        </div>
        <motion.button
          onClick={handleScan}
          className="px-3 sm:px-6 py-2.5 rounded-xl bg-linear-to-r from-cyan-500 to-emerald-500 text-dark-900 font-semibold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 shrink-0"
          whileHover={{ scale: 1.03, boxShadow: "0 0 24px rgba(6,182,212,0.35)" }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Search size={18} />
          <span className="hidden sm:inline">Full Recon</span>
        </motion.button>
      </div>
    </section>
  );
}
