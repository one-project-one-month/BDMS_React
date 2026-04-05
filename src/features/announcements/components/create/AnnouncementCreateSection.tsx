import React from 'react'
import CreateAnnouncementForm from './AnnouncementCreateForm'


type Props = {}

const AnnouncementCreateSection = (props: Props) => {
  return (
    <div className='max-w-2xl flex flex-col px-24 py-10 mx-auto '>
      <h3 className='font-semibold text-primary px-4 mb-12 text-2xl'>Create your announcement</h3> 
      <CreateAnnouncementForm mode='create'/>
    </div>
  )
}

export default AnnouncementCreateSection