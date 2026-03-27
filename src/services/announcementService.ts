import { ANNOUNCEMENT_ENDPOINTS } from "@/api/endpoints/announcement.endpoints"

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAnnouncements = async () => {

  const res = await fetch(`${BASE_URL}${ANNOUNCEMENT_ENDPOINTS.LIST}`); 

  if (!res.ok) {
    throw new Error("Failed to fetch announcements"); 
  }

  return res.json(); 
}

export const getAnnouncementById = async (id: number) => {

  const res = await fetch(`${BASE_URL}${ANNOUNCEMENT_ENDPOINTS.DETAIL(id)}`); 

  if (!res.ok) {
    throw new Error("Failed to fetch announcement"); 
  } 

  return res.json(); 
}


//temporarily used any for data 
//must fix later
export const createAnnouncement = async (data: any) => {

  const res = await fetch(`${BASE_URL}${ANNOUNCEMENT_ENDPOINTS.CREATE}`, {
    method: "POST", 
    headers: {"Content-Type": "application/json"}, 
    body: JSON.stringify(data), 
  }); 

   if (!res.ok) {
    throw new Error("Failed to create an announcement"); 
  } 

  return res.json(); 
}

export const updateAnnouncement = async (id: number, data: any) => {

  const res = await fetch(`${BASE_URL}${ANNOUNCEMENT_ENDPOINTS.UPDATE(id)}`, {
    method: "PUT", 
    headers: {"Content-Type": "application/json"}, 
    body: JSON.stringify(data), 
  })

  if (!res.ok) {
    throw new Error("Failed to update the announcement"); 
  } 

  return res.json(); 
}

export const deleteAnnouncement = async (id: number) => {

  const res = await fetch(`${BASE_URL}/${ANNOUNCEMENT_ENDPOINTS.DELETE(id)}`, {
    method: "DELETE", 
  })

  if (!res.ok) {
    throw new Error("Failed to delete the announcement"); 
  } 

  return res.json(); 
}