import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface ResultItem {
  label: string;
  value: string;
  group?: string;
}

interface OutputPanelProps {
  title: string;
  results: ResultItem[];
  running?: boolean;
  footer?: string;
}

export default function OutputPanel({ title, results, running, footer }: OutputPanelProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [results]);

  const grouped = results.reduce<Record<string, ResultItem[]>>((acc, r) => {
    const key = r.group || "";
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  const hasGroups =
    Object.keys(grouped).length > 1 ||
    (Object.keys(grouped).length === 1 && Object.keys(grouped)[0] !== "");

  return (
    <div className="rounded-xl border border-dark-500/40 bg-dark-800/50 overflow-hidden flex flex-col panel-fixed">
      <div className="flex items-center justify-between px-4 py-2 border-b border-dark-500/30 bg-dark-700/40 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400/60" />
          <span className="text-[11px] font-medium text-dark-200 uppercase tracking-wider">
            {title}
          </span>
        </div>
        {footer && <span className="text-[11px] text-dark-300">{footer}</span>}
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-1.5 min-h-0">
        {results.length === 0 && (
          <p className="text-xs text-dark-300 font-mono">
            {running ? "Scanning..." : "No results yet"}
          </p>
        )}
        {hasGroups
          ? Object.entries(grouped).map(([group, items]) => (
              <div key={group} className="mb-3 last:mb-0">
                {group && (
                  <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider mb-1.5">
                    {group}
                  </div>
                )}
                {items.map((r, i) => (
                  <motion.div
                    key={`${group}-${i}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-baseline gap-3 font-mono text-sm py-0.5"
                  >
                    <span className="text-dark-300 text-xs w-24 shrink-0">{r.label}</span>
                    <span className="text-white">{r.value}</span>
                  </motion.div>
                ))}
              </div>
            ))
          : results.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-baseline gap-3 font-mono text-sm"
              >
                <span className="text-dark-300 text-xs">{r.label}</span>
                <span className="text-white">{r.value}</span>
              </motion.div>
            ))}
      </div>
    </div>
  );
}
