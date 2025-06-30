import LeftSidebar from '@/components/dashboard/left-sidebar'
import React from 'react'

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <LeftSidebar />

      {/* Main content */}
      <div className="flex-1 bg-muted p-4 overflow-auto">
        {children}
      </div>
    </div>
  )
}

export default layout
