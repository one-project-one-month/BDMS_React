import type { AnnouncementDetailTypes } from '@/types/AnnouncementTypes'
import { useDeleteAnnouncement } from '../../hooks/useAnnouncement';
import { TableCell, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';

type Props = {
  announcement: AnnouncementDetailTypes & { id: number };  
}

const AnnouncementTableRow = ({announcement}: Props) => {

  const { mutate: deleteAnnouncement, isPending: isDeleting} = useDeleteAnnouncement(); 

  const navigate = useNavigate(); 

  const handleDelete = () => {
    deleteAnnouncement(announcement.id); 
  }

  return (
     <TableRow> 
      {/* No */}
      <TableCell>1</TableCell>

      {/* Title */}
      <TableCell>{announcement.title}</TableCell> 

      {/* Content */}
      <TableCell className="max-w-[300px] truncate">
        {announcement.content}
      </TableCell>

      {/* Active */}
      <TableCell>
        <p 
          className={`px-2 py-1 text-sm text-white ${announcement.isActive ? "bg-green-600" : "bg-red-600"}`}> 
            {announcement.isActive ? "Active" : "Not Active"}
        </p>
      </TableCell>

      {/* Expired Date */}
      <TableCell>
        {announcement.expiredAt.year}-
        {announcement.expiredAt.month}-
        {announcement.expiredAt.day}
      </TableCell>

      {/* Actions */}
      <TableCell className="flex gap-2">
        <button
          onClick={() => navigate(`/announcements/${announcement.id}/edit`)}
          className="px-2 py-1 text-sm bg-blue-500 text-white rounded"
        >
          Edit
        </button>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-2 py-1 text-sm bg-red-500 text-white rounded"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      </TableCell>
    </TableRow>
  )
}

export default AnnouncementTableRow