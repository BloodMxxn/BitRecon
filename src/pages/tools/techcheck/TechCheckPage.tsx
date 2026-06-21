import ToolPage from '../ToolPage'

export default function TechCheckPage() {
  return (
    <ToolPage
      tool="techcheck"
      color="text-amber-400"
      mockScan={(target) => {
        const techs = [
          { label: 'Server', value: 'nginx/1.24.0' },
          { label: 'Framework', value: 'React 18.2' },
          { label: 'Language', value: 'TypeScript 5.3' },
          { label: 'Bundler', value: 'Vite 5.0' },
          { label: 'CSS', value: 'Tailwind CSS 3.4' },
          { label: 'CMS', value: 'Custom' },
          { label: 'Analytics', value: 'Google Analytics 4' },
          { label: 'CDN', value: 'Cloudflare' },
          { label: 'WAF', value: 'Cloudflare WAF' },
          { label: 'SSL', value: "Let's Encrypt" },
          { label: 'Cache', value: 'Redis 7.2' },
          { label: 'Search', value: 'Elasticsearch 8.12' },
        ]
        const terminal = [
          `$ bitrecon techcheck ${target}`,
          `[*] Probing ${target} for technology signatures`,
          `[*] Checking HTTP headers...`,
          `[*] Analyzing HTML meta tags...`,
          `[*] Checking JavaScript globals...`,
          `[*] Fingerprinting server software...`,
          ...techs.map((t) => `[+] ${t.label}: ${t.value}`),
          `[*] ${techs.length} technologies detected`,
        ]
        const delays = terminal.map((_, i) => i < 5 ? i * 280 : 1400 + (i - 5) * 160)
        return { terminal, results: techs, delays }
      }}
    />
  )
}
