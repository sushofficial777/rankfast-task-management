import type { Metadata } from 'next'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Task Management App',
  description: 'Created with Task Management',
  generator: 'Task Management.dev',
}

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
   
      <>{children}</>
    
  )
}
