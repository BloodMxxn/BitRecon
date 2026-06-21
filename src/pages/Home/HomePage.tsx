import PageTransition from '../../components/PageTransition'
import TargetInput from './_components/TargetInput'
import ToolGrid from './_components/ToolGrid'
import RecentScans from './_components/RecentScans'

export default function HomePage() {
  return (
    <PageTransition>
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-3 sm:pt-6 pb-3 sm:pb-6 h-dvh overflow-hidden space-y-3 sm:space-y-5">
        <TargetInput />
        <ToolGrid />
        <RecentScans />
      </main>
    </PageTransition>
  )
}
