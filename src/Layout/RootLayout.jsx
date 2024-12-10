import React from 'react'
import { Sidebar } from '../Components/Sidebar/Sidebar'
import { Outlet } from 'react-router-dom'

export const RootLayout = () => {
  return (
    <div className='h-screen overflow-hidden'>
      <div className='root-grid'>
        <Sidebar />
        <Outlet />
      </div>
    </div>
  )
}
