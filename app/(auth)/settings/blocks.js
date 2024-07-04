import React from 'react'
import { useStore } from '@/app/_hooks/useStore'
import BlockedUser from '@/app/(auth)/settings/blockedUser'

export default function Blocks() {
  const { userData } = useStore()
    return (
    <div className='flex flex-col gap-8 w-full'>
        <label className='text-xl'>Blocks</label>
        <div className='flex flex-col gap-6 w-full children-border'>
            {userData?.blocks?.map((block) => (
                <BlockedUser key={block} uid={block} />
            ))}
            {userData?.blocks?.length === 0 && (
              <h1>No blocked users</h1>
            )}
        </div>
    </div>
  )
}
