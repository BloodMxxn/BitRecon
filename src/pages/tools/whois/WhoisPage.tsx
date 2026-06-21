import ToolPage from '../ToolPage'

export default function WhoisPage() {
  return (
    <ToolPage
      tool="whois"
      color="text-violet-400"
      mockScan={(target) => {
        const records = [
          { label: 'Domain Name', value: target.toUpperCase() },
          { label: 'Registrar', value: 'Cloudflare, Inc.' },
          { label: 'Created', value: '2005-03-15T12:00:00Z' },
          { label: 'Expires', value: '2026-03-15T12:00:00Z' },
          { label: 'Updated', value: '2024-02-10T08:30:00Z' },
          { label: 'Name Server 1', value: 'ns1.cloudflare.com' },
          { label: 'Name Server 2', value: 'ns2.cloudflare.com' },
          { label: 'Status', value: 'clientTransferProhibited' },
          { label: 'Registrant Org', value: 'REDACTED FOR PRIVACY' },
          { label: 'DNSSEC', value: 'unsigned' },
        ]
        const terminal = [
          `$ bitrecon whois ${target}`,
          `[*] Querying WHOIS servers for ${target}`,
          `[*] Registrar: registrars.verisign-grs.com`,
          ...records.map((r) => `[+] ${r.label}: ${r.value}`),
          `[*] WHOIS lookup complete`,
        ]
        const delays = terminal.map((_, i) => i < 2 ? i * 300 : 200 + (i - 2) * 200)
        return { terminal, results: records, delays }
      }}
    />
  )
}
