import React from 'react'
import {Outlet} from 'react-router-dom'
import Header from '../components/Header.jsx'


const MainLayout = () => {
  return (
    <div className = 'min-h-screen min-w-screen flex flex-col bg-gray-50 p-0'>
      <Header />
      <main className = 'flex-1 p-4 md:p-6'>
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout