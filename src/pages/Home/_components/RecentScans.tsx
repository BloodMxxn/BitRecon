import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

const allScans = [
  { target: "example.com", tool: "subdomain", time: "2 min ago", status: "done", findings: 47 },
  { target: "192.168.1.0/24", tool: "portscan", time: "18 min ago", status: "done", findings: 12 },
  { target: "target.io", tool: "dns", time: "1 hr ago", status: "done", findings: 8 },
  { target: "api.example.com", tool: "whois", time: "3 hr ago", status: "done", findings: 1 },
  {
    target: "staging.example.com",
    tool: "techcheck",
    time: "5 hr ago",
    status: "done",
    findings: 6,
  },
  {
    target: "dev.internal.co",
    tool: "email-harvest",
    time: "6 hr ago",
    status: "done",
    findings: 23,
  },
  { target: "blog.example.com", tool: "subdomain", time: "8 hr ago", status: "done", findings: 15 },
  { target: "10.0.0.0/8", tool: "portscan", time: "12 hr ago", status: "done", findings: 34 },
];

const PAGE_SIZE = 5;

export default function RecentScans() {
  const navigate = useNavigate();
  const [scans, setScans] = useState(allScans);
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(scans.length / PAGE_SIZE);
  const paged = scans.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <section>
      <div className="flex items-center justify-between mb-2 h-6">
        <h2 className="text-sm font-medium text-dark-200 uppercase tracking-wider">Recent Scans</h2>
        <div className={`flex items-center gap-2 ${scans.length === 0 ? "hidden" : ""}`}>
          {totalPages > 1 && (
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg border border-dark-500/40 bg-dark-800/50">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-0.5 rounded text-dark-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] text-dark-200 font-mono min-w-7 text-center">
                {page}/{totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-0.5 rounded text-dark-300 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
          <button
            onClick={() => {
              setScans([]);
              setPage(1);
            }}
            className="flex items-center justify-center h-7 w-7 sm:w-fit gap-1 p-1 sm:px-2 rounded-lg border border-dark-500/40 bg-dark-800/50 text-dark-300 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all"
          >
            <Trash2 size={16} />
            <p className="text-xs hidden sm:inline">Clear</p>
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-dark-500/40 bg-dark-800/30 overflow-hidden">
        {/* Desktop table header */}
        <div className="hidden sm:grid grid-cols-[1fr_100px_120px_80px_80px] gap-4 px-4 py-2 border-b border-dark-500/30 text-[11px] font-medium text-dark-300 uppercase tracking-wider">
          <span>Target</span>
          <span>Tool</span>
          <span>Time</span>
          <span>Status</span>
          <span className="text-right">Found</span>
        </div>
        {scans.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-sm text-dark-300">No scans yet</p>
          </div>
        ) : (
          <div>
            <AnimatePresence mode="popLayout">
              {paged.map((scan, i) => (
                <motion.div
                  key={scan.target + scan.tool}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: i * 0.04 } }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() =>
                    navigate(
                      `/scan/summary?target=${encodeURIComponent(scan.target)}&tool=${scan.tool}`,
                    )
                  }
                  className="border-b border-dark-500/20 last:border-0 transition-colors hover:bg-dark-700/30 cursor-pointer"
                >
                  {/* Desktop row */}
                  <div className="hidden sm:grid grid-cols-[1fr_100px_120px_80px_80px] gap-4 px-4 py-2.5 items-center">
                    <span className="font-mono text-sm text-white truncate">{scan.target}</span>
                    <span className="font-mono text-xs text-dark-100">{scan.tool}</span>
                    <span className="text-xs text-dark-200">{scan.time}</span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span className="text-xs text-emerald-400">{scan.status}</span>
                    </span>
                    <span className="text-sm text-white font-medium text-right">
                      {scan.findings}
                    </span>
                  </div>
                  {/* Mobile row */}
                  <div className="sm:hidden px-4 py-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-sm text-white truncate mr-2">
                        {scan.target}
                      </span>
                      <span className="text-xs text-white font-medium shrink-0">
                        {scan.findings}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-dark-200">
                      <span className="font-mono">{scan.tool}</span>
                      <span>·</span>
                      <span>{scan.time}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        <span className="text-emerald-400">{scan.status}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
}
