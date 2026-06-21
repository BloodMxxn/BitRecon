import { useEffect, useRef } from 'react'

interface TerminalViewProps {
  lines: string[]
}

export default function TerminalView({ lines }: TerminalViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines])

  return (
    <div className="rounded-xl border border-dark-500/40 bg-dark-800/80 overflow-hidden flex flex-col panel-fixed">
      <div className="flex items-center gap-2 px-4 py-2 border-b border-dark-500/30 bg-dark-700/40 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
        </div>
        <span className="text-[11px] font-mono text-dark-300 ml-1">bitrecon — zsh</span>
      </div>
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed space-y-0.5 min-h-0"
      >
        {lines.map((line, i) => (
          <div key={i} className="text-dark-100">
            {line}
          </div>
        ))}
        {lines.length > 0 && (
          <span className="inline-block w-2 h-3.5 bg-emerald-400 ml-0.5 animate-pulse" />
        )}
      </div>
    </div>
  )
}
