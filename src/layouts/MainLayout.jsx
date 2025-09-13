import React from 'react'
import {Outlet} from 'react-router-dom'
import Header from '../components/Header.jsx'


const MainLayout = () => {
  return (
    <div className = 'min-h-screen min-w-screen flex flex-col bg-background p-0'>
      <Header />
      <main className = 'flex-1 p-4'>
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout