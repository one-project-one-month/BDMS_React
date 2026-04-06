import React from 'react'

import { useParams } from 'react-router-dom'

import { getAnnouncementByIdQueryOptions } from '../../queries/useAnnouncement';
import AnnouncementCreateFormLoader from '../create/AnnouncementCreateFormLoader';
import CreateAnnouncementForm from '../create/AnnouncementCreateForm';
import { useQuery } from '@tanstack/react-query';


const AnnouncementEditSection = () => { 

  const { id } = useParams(); 
  const numericId = Number(id); 

  const { data, isLoading } = useQuery(getAnnouncementByIdQueryOptions(numericId)); 

  if (isLoading) return <AnnouncementCreateFormLoader/>; 

  if (!data) return <div>No Data Found</div>; 

  return (
     <div className='max-w-2xl flex flex-col px-24 py-10 mx-auto '>
      <h3 className='font-semibold text-primary px-4 mb-12 text-2xl'>Edit your announcement</h3> 
      <CreateAnnouncementForm defaultValues={data} mode='edit'/>
    </div>
  )
}

export default AnnouncementEditSection