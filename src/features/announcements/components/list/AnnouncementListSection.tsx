import React from 'react'
import AnnouncementTable from './AnnouncementTable'



const AnnouncementListSection = () => {
  return (
    <div className='flex flex-col gap-4 items-start px-24 py-12'>
      <h3 className='font-semibold text-primary px-4 mb-12 text-2xl'>
        Announcements 
      </h3>
      <AnnouncementTable/>
    </div>
  )
}

export default AnnouncementListSection