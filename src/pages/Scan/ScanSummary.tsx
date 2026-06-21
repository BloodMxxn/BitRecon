import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "../../components/PageTransition";

const toolLabels: Record<string, string> = {
  subdomain: "Subdomain Enumeration",
  portscan: "Port Scanner",
  whois: "Whois Lookup",
  techcheck: "Tech Profiler",
  "email-harvest": "Email Harvest",
  dns: "DNS Recon",
};

const toolColors: Record<string, string> = {
  subdomain: "text-cyan-400",
  portscan: "text-emerald-400",
  dns: "text-rose-400",
  whois: "text-violet-400",
  techcheck: "text-amber-400",
  "email-harvest": "text-orange-400",
};

const mockResults: Record<string, { label: string; value: string }[]> = {
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
    { label: "admin", value: "admin@example.com" },
    { label: "info", value: "info@example.com" },
    { label: "support", value: "support@example.com" },
    { label: "contact", value: "contact@example.com" },
    { label: "dev", value: "dev@example.com" },
  ],
};

export default function ScanSummary() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const tool = params.get("tool") || "subdomain";
  const target = params.get("target") || "target.com";

  const results = mockResults[tool] || [];
  const label = toolLabels[tool] || tool;
  const color = toolColors[tool] || "text-white";

  return (
    <PageTransition>
      <div className="min-h-dvh w-full">
        <main className="max-w-4xl mx-auto px-6 pt-24 pb-16">
          <button
            onClick={() => navigate("/")}
            className="group mb-5 flex items-center gap-2 w-fit px-3 py-1.5 rounded-lg border border-dark-500/40 bg-dark-800/50 text-dark-300 hover:text-white hover:border-cyan-500/40 hover:bg-dark-700/50 transition-all text-sm animate-[fadeIn_0.3s_ease-out]"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>

          <div className="mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <span className={`text-lg font-bold ${color}`}>{label}</span>
              <span className="text-dark-400">→</span>
              <span className="font-mono text-sm text-white bg-dark-700 px-2 py-0.5 rounded">
                {target}
              </span>
            </div>
          </div>

          <motion.div
            className="rounded-xl border border-dark-500/40 bg-dark-800/50 overflow-hidden"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="px-4 py-3 border-b border-dark-500/30 bg-dark-700/30 flex items-center justify-between">
              <span className="text-[11px] font-medium text-dark-200 uppercase tracking-wider">
                Results
              </span>
              <span className="text-[11px] text-dark-300">{results.length} found</span>
            </div>
            <div className="divide-y divide-dark-500/20">
              {results.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="flex items-baseline gap-4 px-4 py-3 font-mono text-sm hover:bg-dark-700/20 transition-colors"
                >
                  <span className="text-dark-300 text-xs w-28 shrink-0">{r.label}</span>
                  <span className="text-white">{r.value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => navigate(`/tools/${tool}?target=${encodeURIComponent(target)}`)}
              className="px-4 py-2 rounded-lg border border-dark-500/40 bg-dark-800/50 text-dark-100 text-sm hover:bg-dark-700/50 hover:text-white transition-all"
            >
              Re-run this tool
            </button>
            <button
              onClick={() => navigate(`/scan?target=${encodeURIComponent(target)}`)}
              className="px-4 py-2 rounded-lg border border-dark-500/40 bg-dark-800/50 text-dark-100 text-sm hover:bg-dark-700/50 hover:text-white transition-all"
            >
              Full scan on this target
            </button>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
