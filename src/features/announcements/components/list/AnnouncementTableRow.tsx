import type { AnnouncementDetailTypes, AnnouncementResponseTypes } from '@/features/announcements/types/AnnouncementTypes'
import { useDeleteAnnouncement } from '../../queries/useAnnouncement';
import { TableCell, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { confirmDelete } from '../../utils/confirmDelete';

type Props = {
  announcement: AnnouncementResponseTypes;  
}

const AnnouncementTableRow = ({announcement}: Props) => {

  const { mutateAsync: deleteAnnouncement, isPending: isDeleting} = useDeleteAnnouncement(); 

  const navigate = useNavigate(); 

  const handleDelete = () => {
    confirmDelete({
      message: "Are you sure you want to delete?",
      onConfirm: () => deleteAnnouncement(announcement.id),
      toastMessage: "Announcement deleted"
    })
  }

  return (
     <TableRow> 
      {/* No */}
      <TableCell>1</TableCell>

      {/* Title */}
      <TableCell>{announcement.title}</TableCell> 

      {/* Title */}
      <TableCell>{announcement.category}</TableCell> 

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