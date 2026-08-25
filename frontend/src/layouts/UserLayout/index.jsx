import Navbar from '@/Components/Navbar'
import React from 'react'

function UserLayout({children}) {
  return (
    <div>
      <Navbar>
      </Navbar>
        {children}
    </div>
  )
}

export default UserLayout