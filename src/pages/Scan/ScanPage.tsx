import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import PageTransition from "../../components/PageTransition";
import { toolLabels } from "./_components/ScanHeader";
import TerminalView from "./_components/TerminalView";
import OutputPanel from "./_components/OutputPanel";

const tools = ["subdomain", "portscan", "dns", "whois", "techcheck", "email-harvest"] as const;

const toolShortLabels: Record<string, string> = {
  subdomain: "Subdomains",
  portscan: "Ports",
  dns: "DNS",
  whois: "Whois",
  techcheck: "Tech",
  "email-harvest": "Emails",
};

function mockToolOutput(tool: string, target: string) {
  if (tool === "subdomain") {
    return [
      `[*] ─── ${toolShortLabels[tool]} ───`,
      `[*] Starting subdomain enumeration on ${target}`,
      `[+] api.${target} — 104.21.12.34`,
      `[+] mail.${target} — 104.21.12.35`,
      `[+] dev.${target} — 104.21.12.36`,
      `[+] staging.${target} — 104.21.12.37`,
      `[+] admin.${target} — 104.21.12.38`,
      `[+] cdn.${target} — 104.21.12.39`,
      `[+] Found 6 subdomains`,
    ];
  }
  if (tool === "portscan") {
    return [
      `[*] ─── ${toolShortLabels[tool]} ───`,
      `[*] Scanning top ports on ${target}`,
      `[+] 22/tcp   — ssh       — OpenSSH 8.9`,
      `[+] 80/tcp   — http      — nginx 1.24`,
      `[+] 443/tcp  — https     — nginx 1.24`,
      `[+] 3306/tcp — mysql     — MySQL 8.0`,
      `[+] 8080/tcp — http-proxy — Express`,
      `[+] Found 5 open ports`,
    ];
  }
  if (tool === "dns") {
    return [
      `[*] ─── ${toolShortLabels[tool]} ───`,
      `[*] Resolving DNS records for ${target}`,
      `[+] A      104.21.12.34`,
      `[+] AAAA   2606:4700::6815:0c22`,
      `[+] MX     gmail-smtp-in.l.google.com`,
      `[+] NS     ns1.cloudflare.com`,
      `[+] TXT    v=spf1 include:_spf.google.com`,
      `[+] Found 5 records`,
    ];
  }
  if (tool === "whois") {
    return [
      `[*] ─── ${toolShortLabels[tool]} ───`,
      `[*] WHOIS lookup for ${target}`,
      `[+] Registrar: Cloudflare, Inc.`,
      `[+] Created: 2005-03-15`,
      `[+] Expires: 2026-03-15`,
      `[+] Name Servers: ns1.cloudflare.com`,
    ];
  }
  if (tool === "techcheck") {
    return [
      `[*] ─── ${toolShortLabels[tool]} ───`,
      `[*] Fingerprinting ${target}`,
      `[+] Server:    nginx/1.24.0`,
      `[+] Framework: React 18.2`,
      `[+] Language:  TypeScript`,
      `[+] CDN:       Cloudflare`,
      `[+] SSL:       Let's Encrypt`,
      `[+] Found 5 technologies`,
    ];
  }
  return [
    `[*] ─── ${toolShortLabels[tool]} ───`,
    `[*] Harvesting emails from ${target}`,
    `[+] admin@${target}`,
    `[+] info@${target}`,
    `[+] support@${target}`,
    `[+] contact@${target}`,
    `[+] dev@${target}`,
    `[+] Found 5 email addresses`,
  ];
}

function getToolResults(target: string): Record<string, { label: string; value: string }[]> {
  return {
    subdomain: [
      { label: "api", value: "104.21.12.34" },
      { label: "mail", value: "104.21.12.35" },
      { label: "dev", value: "104.21.12.36" },
      { label: "staging", value: "104.21.12.37" },
      { label: "admin", value: "104.21.12.38" },
      { label: "cdn", value: "104.21.12.39" },
    ],
    portscan: [
      { label: "22/tcp", value: "OpenSSH 8.9" },
      { label: "80/tcp", value: "nginx 1.24" },
      { label: "443/tcp", value: "nginx 1.24" },
      { label: "3306/tcp", value: "MySQL 8.0" },
      { label: "8080/tcp", value: "Express" },
    ],
    dns: [
      { label: "A", value: "104.21.12.34" },
      { label: "AAAA", value: "2606:4700::6815:0c22" },
      { label: "MX", value: "gmail-smtp-in.l.google.com" },
      { label: "NS", value: "ns1.cloudflare.com" },
      { label: "TXT", value: "v=spf1 include:_spf.google.com" },
    ],
    whois: [
      { label: "Registrar", value: "Cloudflare, Inc." },
      { label: "Created", value: "2005-03-15" },
      { label: "Expires", value: "2026-03-15" },
      { label: "Name Servers", value: "ns1.cloudflare.com" },
    ],
    techcheck: [
      { label: "Server", value: "nginx/1.24.0" },
      { label: "Framework", value: "React 18.2" },
      { label: "Language", value: "TypeScript" },
      { label: "CDN", value: "Cloudflare" },
      { label: "SSL", value: "Let's Encrypt" },
    ],
    "email-harvest": [
      { label: "admin", value: `admin@${target}` },
      { label: "info", value: `info@${target}` },
      { label: "support", value: `support@${target}` },
      { label: "contact", value: `contact@${target}` },
      { label: "dev", value: `dev@${target}` },
    ],
  };
}

export default function ScanPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [inputTarget, setInputTarget] = useState(params.get("target") || "");
  const [activeTarget, setActiveTarget] = useState(params.get("target") || "");
  const [running, setRunning] = useState(false);
  const [termLines, setTermLines] = useState<string[]>([]);
  const [completedTools, setCompletedTools] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const timers = useRef<number[]>([]);
  const startTime = useRef(0);

  const stopScan = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  const runScan = useCallback(
    (tgt: string) => {
      stopScan();
      setActiveTarget(tgt);
      setRunning(true);
      setTermLines([]);
      setCompletedTools([]);
      setTimeLeft(0);
      startTime.current = Date.now();

      const totalLines = tools.reduce((sum, tool) => sum + mockToolOutput(tool, tgt).length, 0);
      const estimatedTotal = totalLines * 120 + tools.length * 500;

      let lineDelay = 0;
      tools.forEach((tool) => {
        const toolLines = mockToolOutput(tool, tgt);

        toolLines.forEach((line, i) => {
          const t = window.setTimeout(
            () => {
              setTermLines((prev) => [...prev, line]);
              const elapsed = Date.now() - startTime.current;
              const remaining = Math.max(0, Math.ceil((estimatedTotal - elapsed) / 1000));
              setTimeLeft(remaining);
            },
            lineDelay + i * 120,
          );
          timers.current.push(t);
        });

        const toolDoneDelay = lineDelay + toolLines.length * 120 + 200;
        const t = window.setTimeout(() => {
          setCompletedTools((prev) => [...prev, tool]);
        }, toolDoneDelay);
        timers.current.push(t);

        lineDelay = toolDoneDelay + 300;
      });

      const doneT = window.setTimeout(() => {
        setRunning(false);
        setTimeLeft(0);
      }, lineDelay + 100);
      timers.current.push(doneT);

      const countdownT = window.setTimeout(() => setTimeLeft(0), estimatedTotal + 500);
      timers.current.push(countdownT);
    },
    [stopScan],
  );

  useEffect(() => {
    const initial = params.get("target");
    if (initial) {
      setInputTarget(initial);
      const t = window.setTimeout(() => runScan(initial), 300);
      timers.current.push(t);
    }
    return () => stopScan();
  }, [params, runScan, stopScan]);

  const handleStart = () => {
    if (!inputTarget.trim() || running) return;
    runScan(inputTarget.trim());
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
          <span className="text-lg font-bold text-cyan-400">{toolLabels["full"]}</span>
        </div>

        <div className="mb-3 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-dark-800 border border-dark-500/50 focus-within:border-cyan-500/50 transition-colors min-w-0">
            <span className="text-emerald-400 font-mono text-sm font-semibold">$</span>
            <input
              type="text"
              value={inputTarget}
              onChange={(e) => setInputTarget(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleStart()}
              placeholder="domain.com or IP"
              className="flex-1 bg-transparent text-white font-mono text-sm outline-none placeholder:text-dark-300 min-w-0"
              disabled={running}
            />
          </div>
          {running ? (
            <span className="px-3 sm:px-5 py-2.5 rounded-xl bg-dark-700 text-dark-200 font-semibold text-sm flex items-center gap-2 shrink-0">
              <motion.span
                className="size-4 border-2 border-dark-300 border-t-cyan-400 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "linear" }}
              />
              <span className="hidden sm:inline">
                {timeLeft > 0 ? `~${timeLeft}s left` : "Scanning..."}
              </span>
            </span>
          ) : (
            <button
              onClick={handleStart}
              className="px-3 sm:px-5 py-2.5 rounded-xl bg-linear-to-r from-cyan-500 to-emerald-500 text-dark-900 font-semibold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 shrink-0"
            >
              <Search size={18} />
              <span className="hidden sm:inline">{activeTarget ? "Re-run" : "Full Recon"}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 shrink-0">
          <div style={{ overflow: "hidden" }}>
            <TerminalView lines={termLines} />
          </div>
          <div style={{ overflow: "hidden" }}>
            <OutputPanel
              title="Results"
              results={completedTools.flatMap((t) =>
                (getToolResults(activeTarget)[t] || []).map((r) => ({
                  ...r,
                  group: toolLabels[t],
                })),
              )}
              running={running}
              footer={
                completedTools.length > 0
                  ? `${completedTools.length}/${tools.length} modules`
                  : undefined
              }
            />
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
