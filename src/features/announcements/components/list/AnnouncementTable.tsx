import React, { useState } from 'react'
import { deleteAnnouncementMutationOptions, getAnnouncementQueryOptions } from '../../queries/useAnnouncement'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SearchIcon } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import TableSkeleton from '@/components/table-skeleton'
import type { AnnouncementResponseTypes } from '../../types/AnnouncementTypes'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { confirmDelete } from '../../utils/confirmDelete'
import { toast } from 'sonner'


const AnnouncementTable = () => {
  const navigate = useNavigate(); 

  const {data, isLoading} = useQuery(getAnnouncementQueryOptions); 

  const { mutateAsync: deleteAnnouncement, isPending: isDeleting} = useMutation(deleteAnnouncementMutationOptions);

  const [pagination, setPagination] = useState({pageIndex: 0, pageSize: 10}); 

  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<AnnouncementResponseTypes>[] = [
    {
      header: "No.", 
      cell: ({ row }) => row.index + 1 + pagination.pageIndex * pagination.pageSize, 
    }, 
    {
      header: "Title", 
      accessorKey: "title",
    }, 
    {
      header: "Category",
      accessorKey: "category",
    },
    {
      header: "Content",
      accessorKey: "content",
      cell: ({ getValue }) => (
        <p className="max-w-[300px] truncate">{getValue<string>()}</p>
      ),
    }, 
    {
      header: "Status", 
      accessorKey: "isActive", 
      cell: ({getValue}) => (
        <p
          className={`px-2 py-1 text-sm text-white ${
            getValue<boolean>() ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {getValue<boolean>() ? "Active" : "Not Active"}
        </p>
      )
    }, 
    {
      header: "Expiry Date", 
      accessorFn: (row) => `${row.expiredAt.year}-${row.expiredAt.month}-${row.expiredAt.day}`, 
    }, 
    {
      header: "Actions", 
      accessorKey: "id", 
      cell: ({row}) => {
        const announcement = row.original;

        const handleDelete = () => {
          confirmDelete({
            message: "Are you sure you want to delete?",
            onConfirm: () => deleteAnnouncement(announcement.id, {
              onSuccess: () => toast.success("Announcement deleted"),
            }),
            toastMessage: "Announcement deleted",
          });
        }; 

        return (
          <div className="flex gap-2">
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
          </div>
        );
      }
    },
  ]; 

  const table = useReactTable({
    data: data || [], 
    columns, 
    state: {pagination}, 
    onPaginationChange: setPagination, 
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  }); 

  if (isLoading) return <TableSkeleton columns={7} rows={10} />; 

  return (
    <div className="space-y-6 p-6 bg-gray-100 rounded-sm border border-gray-200 w-full">
      
      {/* Search */}
      <div className="flex justify-between items-center">
        <InputGroup className="max-w-sm">
          <InputGroupInput 
            placeholder="Search announcements..." 
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
          <InputGroupAddon align="inline-start">
            <SearchIcon className="text-muted-foreground w-4 h-4" />
          </InputGroupAddon>
        </InputGroup>
      </div>

      {/* Table */}
        <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-gray-50">
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={columns.length} className="text-right">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table> 

      {/* pagination  */} 
      <div className="flex items-center justify-between px-4 py-3">
        <button
          className="px-3 py-1 border rounded"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <button
          className="px-3 py-1 border rounded"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
    

  )
}

export default AnnouncementTable