import ToolPage from '../ToolPage'

export default function DnsPage() {
  return (
    <ToolPage
      tool="dns"
      color="text-rose-400"
      mockScan={(target) => {
        const records = [
          { label: 'A', value: '104.21.12.34' },
          { label: 'AAAA', value: '2606:4700::6815:0c22' },
          { label: 'MX (10)', value: 'gmail-smtp-in.l.google.com' },
          { label: 'MX (20)', value: 'alt1.gmail-smtp-in.l.google.com' },
          { label: 'NS', value: 'ns1.cloudflare.com' },
          { label: 'NS', value: 'ns2.cloudflare.com' },
          { label: 'TXT', value: 'v=spf1 include:_spf.google.com ~all' },
          { label: 'TXT', value: 'google-site-verification=abc123def' },
          { label: 'CAA', value: '0 issue "letsencrypt.org"' },
          { label: 'SOA', value: 'ns1.cloudflare.com dns.cloudflare.com' },
        ]
        const terminal = [
          `$ bitrecon dns ${target}`,
          `[*] Resolving DNS records for ${target}`,
          `[*] Querying A, AAAA, MX, NS, TXT, CAA, SOA...`,
          ...records.map((r) => `[+] ${r.label}: ${r.value}`),
          `[*] Attempting zone transfer from ns1.cloudflare.com...`,
          `[!] Zone transfer refused (expected)`,
          `[+] ${records.length} records found`,
        ]
        const delays = terminal.map((_, i) => i < 3 ? i * 300 : 800 + (i - 3) * 180)
        return { terminal, results: records, delays }
      }}
    />
  )
}
