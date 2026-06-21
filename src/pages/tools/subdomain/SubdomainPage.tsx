import ToolPage from '../ToolPage'

const subdomains = [
  'www', 'api', 'mail', 'dev', 'staging', 'admin', 'cdn', 'beta',
  'git', 'jenkins', 'vpn', 'test', 'shop', 'blog', 'docs', 'status',
  'grafana', 'kibana', 'elastic', 's3', 'ns1', 'ns2', 'mx', 'ftp',
]

export default function SubdomainPage() {
  return (
    <ToolPage
      tool="subdomain"
      color="text-cyan-400"
      mockScan={(target) => {
        const found = subdomains.slice(0, 12 + Math.floor(Math.random() * 8))
        const terminal = [
          `$ bitrecon subdomain ${target}`,
          `[*] Starting subdomain enumeration on ${target}`,
          `[*] Sources: DNS brute-force, CT logs, passive DNS`,
          ...found.map((s, i) => `[+] [${i + 1}/${found.length}] ${s}.${target} — found`),
          `[*] Deduplicating results...`,
          `[+] ${found.length} unique subdomains discovered`,
        ]
        const delays = terminal.map((_, i) => i < 3 ? i * 300 : 300 + (i - 3) * 180)
        const results = found.map((s) => ({ label: `${s}.${target}`, value: `${104 + Math.floor(Math.random() * 2)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${30 + Math.floor(Math.random() * 20)}` }))
        return { terminal, results, delays }
      }}
    />
  )
}
