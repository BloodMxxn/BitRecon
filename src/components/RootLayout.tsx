import Navbar from './Navbar'
import BackgroundAnimation from './BackgroundAnimation'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-dvh overflow-hidden bg-dark-900">
      <BackgroundAnimation />
      <Navbar />
      {children}
    </div>
  )
}
