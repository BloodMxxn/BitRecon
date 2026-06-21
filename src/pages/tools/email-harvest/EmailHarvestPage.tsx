import ToolPage from '../ToolPage'

export default function EmailHarvestPage() {
  return (
    <ToolPage
      tool="email-harvest"
      color="text-orange-400"
      mockScan={(target) => {
        const emails = [
          { label: 'admin', value: `admin@${target}` },
          { label: 'info', value: `info@${target}` },
          { label: 'support', value: `support@${target}` },
          { label: 'contact', value: `contact@${target}` },
          { label: 'sales', value: `sales@${target}` },
          { label: 'dev', value: `dev@${target}` },
          { label: 'security', value: `security@${target}` },
          { label: 'hr', value: `hr@${target}` },
        ]
        const terminal = [
          `$ bitrecon email-harvest ${target}`,
          `[*] Harvesting emails from ${target}`,
          `[*] Sources: web pages, headers, robots.txt, common patterns`,
          ...emails.map((e) => `[+] ${e.value}`),
          `[*] Verifying ${emails.length} addresses via SMTP...`,
          ...emails.slice(0, 6).map((e) => `[+] ${e.value} — valid`),
          ...emails.slice(6).map((e) => `[!] ${e.value} — undeliverable`),
          `[+] ${6} valid, ${2} invalid`,
        ]
        const delays = terminal.map((_, i) => i < 3 ? i * 300 : 900 + (i - 3) * 200)
        return { terminal, results: emails, delays }
      }}
    />
  )
}
