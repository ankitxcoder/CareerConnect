import DashBoardLayout from '@/layouts/DashboardLayout';
import UserLayout from '@/layouts/UserLayout';
import React from 'react'

function MyConnections() {
  return (
    <UserLayout>
        <DashBoardLayout>
            <div>MyConnections</div>
        </DashBoardLayout>
    </UserLayout>
  )
}

export default MyConnections;