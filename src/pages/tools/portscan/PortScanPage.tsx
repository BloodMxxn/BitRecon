import ToolPage from '../ToolPage'

const ports = [
  { port: 21, service: 'ftp', banner: 'vsftpd 3.0.5' },
  { port: 22, service: 'ssh', banner: 'OpenSSH 8.9p1' },
  { port: 25, service: 'smtp', banner: 'Postfix smtpd' },
  { port: 53, service: 'dns', banner: 'ISC BIND 9.18' },
  { port: 80, service: 'http', banner: 'nginx 1.24.0' },
  { port: 110, service: 'pop3', banner: 'Dovecot pop3d' },
  { port: 143, service: 'imap', banner: 'Dovecot imapd' },
  { port: 443, service: 'https', banner: 'nginx 1.24.0' },
  { port: 993, service: 'imaps', banner: 'Dovecot imapd' },
  { port: 3306, service: 'mysql', banner: 'MySQL 8.0.36' },
  { port: 5432, service: 'postgres', banner: 'PostgreSQL 16.2' },
  { port: 6379, service: 'redis', banner: 'Redis 7.2.4' },
  { port: 8080, service: 'http-proxy', banner: 'Node.js Express' },
  { port: 8443, service: 'https-alt', banner: '—' },
  { port: 9090, service: 'prometheus', banner: 'Prometheus 2.50' },
  { port: 27017, service: 'mongodb', banner: 'MongoDB 7.0' },
]

export default function PortScanPage() {
  return (
    <ToolPage
      tool="portscan"
      color="text-emerald-400"
      mockScan={(target) => {
        const open = ports.slice(0, 6 + Math.floor(Math.random() * 5))
        const terminal = [
          `$ bitrecon portscan ${target}`,
          `[*] Initializing multi-threaded port scanner`,
          `[*] Target: ${target} | Threads: 100 | Timeout: 2000ms`,
          `[*] Scanning ports 1-65535...`,
          ...Array.from({ length: 30 }, () => {
            const p = 1 + Math.floor(Math.random() * 10000)
            return `[~] Probing port ${p}... ${open.some(o => o.port === p % 65535) ? 'OPEN' : 'closed'}`
          }).filter((_, i) => i < 20 || open.some((_, j) => j === i - 20)),
          ...open.map((o) => `[+] Port ${o.port}/${o.service} — OPEN — ${o.banner}`),
          `[*] Scan complete — ${open.length} open ports found`,
        ]
        const delays = terminal.map((_, i) => i < 4 ? i * 350 : 1200 + (i - 4) * 100)
        const results = open.map((o) => ({ label: `${o.port}/${o.service}`, value: o.banner }))
        return { terminal, results, delays }
      }}
    />
  )
}
