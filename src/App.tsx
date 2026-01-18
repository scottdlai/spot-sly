import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import Bunny from './components/bunny'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <main className='flex flex-col items-center justify-center min-w-screen min-h-screen'>
        <div className='h-[120px] flex gap-3 w-full items-center justify-center'>
          <Bunny />
          <span className='font-serif text-2xl text-on font-medium leading-none'>appName</span>
        </div>

        {/* SCOTT DO STUFF HERE */}
        <Tabs defaultValue="account flex flex-col w-full items-center justify-center">
          <TabsList className='bg-surface-med w-full'>
            <TabsTrigger value="account">File</TabsTrigger>
            <TabsTrigger value="password">Text</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className=''>This is the upload stuff</TabsContent>
          <TabsContent value="password" className=''>Change your password here.</TabsContent>
        </Tabs>
      </main>
    </>
  )
}

export default App
