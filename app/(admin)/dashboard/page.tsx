import { CardHeader, CardTitle } from '@/components/ui/card'
import { Gauge } from 'lucide-react'
import React from 'react'

const Dashboard = () => {
  return (
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-xl'><Gauge /> Dashboard</CardTitle>
      </CardHeader>
  )
}

export default Dashboard