import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import PageTransition from "../../components/PageTransition";
import { toolLabels } from "../Scan/_components/ScanHeader";
import TerminalView from "../Scan/_components/TerminalView";
import OutputPanel from "../Scan/_components/OutputPanel";

interface ToolPageProps {
  tool: string;
  color: string;
  mockScan: (target: string) => {
    terminal: string[];
    results: { label: string; value: string }[];
    delays: number[];
  };
}

export default function ToolPage({ tool, color, mockScan }: ToolPageProps) {
  const [params] = useSearchParams();
  const initialTarget = params.get("target") || "";

  const [target, setTarget] = useState(initialTarget);
  const [running, setRunning] = useState(false);
  const [termLines, setTermLines] = useState<string[]>([]);
  const [results, setResults] = useState<{ label: string; value: string }[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const navigate = useNavigate();
  const timers = useRef<number[]>([]);
  const startedRef = useRef(false);
  const startTime = useRef(0);

  const stopScan = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const runScan = useCallback(
    (tgt: string) => {
      stopScan();
      setRunning(true);
      setTermLines([]);
      setResults([]);
      setTimeLeft(0);
      startTime.current = Date.now();

      const { terminal, results: allResults, delays } = mockScan(tgt);
      const totalDelay = delays[delays.length - 1] ?? terminal.length * 120;

      terminal.forEach((line, i) => {
        const d = delays[i] ?? i * 120;
        const t = window.setTimeout(() => {
          setTermLines((prev) => [...prev, line]);
          const elapsed = Date.now() - startTime.current;
          setTimeLeft(Math.max(0, Math.ceil((totalDelay - elapsed) / 1000)));
        }, d);
        timers.current.push(t);
      });

      allResults.forEach((r, i) => {
        const delay =
          delays[Math.min(i + Math.floor(terminal.length * 0.3), delays.length - 1)] ??
          (i + 1) * 400;
        const t = window.setTimeout(() => {
          setResults((prev) => [...prev, r]);
        }, delay);
        timers.current.push(t);
      });

      const doneT = window.setTimeout(() => {
        setRunning(false);
        setTimeLeft(0);
      }, totalDelay + 200);
      timers.current.push(doneT);
    },
    [mockScan, stopScan],
  );

  useEffect(() => {
    if (initialTarget && !startedRef.current) {
      startedRef.current = true;
      const t = window.setTimeout(() => runScan(initialTarget), 300);
      timers.current.push(t);
    }
    return () => stopScan();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStart = () => {
    if (!target.trim() || running) return;
    runScan(target.trim());
  };

  return (
    <PageTransition>
      <main className="flex flex-col h-dvh overflow-hidden max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6 pb-4">
        <div className="flex items-center gap-3 mb-3 animate-[fadeIn_0.3s_ease-out]">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dark-500/40 bg-dark-800/50 text-dark-300 hover:text-white hover:border-cyan-500/40 hover:bg-dark-700/50 transition-all text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <span className={`text-lg font-bold ${color}`}>{toolLabels[tool] || tool}</span>
        </div>

        <div className="mb-3 flex items-stretch gap-2">
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-dark-800 border border-dark-500/50 focus-within:border-cyan-500/50 transition-colors min-w-0">
            <span className="text-emerald-400 font-mono text-sm font-semibold">$</span>
            <input
              type="text"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
              placeholder="domain.com or IP"
              className="flex-1 bg-transparent text-white font-mono text-sm outline-none placeholder:text-dark-300 min-w-0"
              disabled={running}
            />
          </div>
          <motion.button
            onClick={handleStart}
            disabled={running}
            className="px-3 sm:px-5 py-2.5 rounded-xl bg-linear-to-r from-cyan-500 to-emerald-500 text-dark-900 font-semibold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            whileHover={!running ? { scale: 1.03 } : undefined}
            whileTap={!running ? { scale: 0.97 } : undefined}
          >
            {running ? (
              <>
                <motion.span
                  className="size-4.5 border-2 border-dark-900 border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
                />
                <span className="hidden sm:inline">
                  {timeLeft > 0 ? `~${timeLeft}s` : "Running..."}
                </span>
              </>
            ) : (
              <>
                <Search size={18} />
                <span className="hidden sm:inline">Run</span>
              </>
            )}
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 shrink-0">
          <div style={{ overflow: "hidden" }}>
            <TerminalView lines={termLines} />
          </div>
          <div style={{ overflow: "hidden" }}>
            <OutputPanel title="Results" results={results} running={running} />
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
