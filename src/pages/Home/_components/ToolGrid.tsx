import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const tools = [
  {
    id: "subdomain",
    name: "Subdomains",
    cmd: "subdomain",
    desc: "Brute-force, CT logs, passive sources",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "hover:border-cyan-500/40",
    glow: "hover:shadow-cyan-500/10",
  },
  {
    id: "portscan",
    name: "Port Scanner",
    cmd: "portscan",
    desc: "SYN, TCP, UDP — service detection",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "hover:border-emerald-500/40",
    glow: "hover:shadow-emerald-500/10",
  },
  {
    id: "whois",
    name: "Whois Lookup",
    cmd: "whois",
    desc: "Registrar, creation date, name servers",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
    color: "text-violet-400",
    bg: "bg-violet-500/10",
    border: "hover:border-violet-500/40",
    glow: "hover:shadow-violet-500/10",
  },
  {
    id: "techcheck",
    name: "Tech Profiler",
    cmd: "techcheck",
    desc: "Frameworks, CMS, server fingerprint",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "hover:border-amber-500/40",
    glow: "hover:shadow-amber-500/10",
  },
  {
    id: "email-harvest",
    name: "Email Harvest",
    cmd: "email-harvest",
    desc: "Scrape emails from pages and headers",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "hover:border-orange-500/40",
    glow: "hover:shadow-orange-500/10",
  },
  {
    id: "dns",
    name: "DNS Recon",
    cmd: "dns",
    desc: "Records, zone transfer, resolution",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "hover:border-rose-500/40",
    glow: "hover:shadow-rose-500/10",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05 },
  },
} as const;

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

export default function ToolGrid() {
  const navigate = useNavigate();

  return (
    <section>
      <motion.div
        className="flex items-center justify-between mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h2 className="text-sm font-medium text-dark-200 uppercase tracking-wider">Tools</h2>
      </motion.div>
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {tools.map((tool) => (
          <motion.button
            key={tool.id}
            variants={item}
            onClick={() => navigate(`/tools/${tool.cmd}`)}
            className={`group flex items-center gap-2.5 sm:items-start sm:gap-3 p-2.5 sm:p-3 rounded-xl border border-dark-500/40 bg-dark-800/50 ${tool.border} ${tool.glow} text-left hover:bg-dark-700/50 hover:shadow-lg`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg ${tool.bg} ${tool.color} flex items-center justify-center shrink-0 transition-transform group-hover:scale-110`}
            >
              {tool.icon}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">{tool.name}</span>
                <span className="hidden sm:inline text-[10px] font-mono text-dark-300 bg-dark-700 px-1.5 py-0.5 rounded">
                  {tool.cmd}
                </span>
              </div>
              <p className="hidden sm:block text-xs text-dark-200 mt-0.5 leading-relaxed">
                {tool.desc}
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </section>
  );
}
