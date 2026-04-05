import React from 'react'
import AnnouncementTableRow from './AnnouncementTableRow'
import { useAnnouncements } from '../../hooks/useAnnouncement'
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SearchIcon } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import TableSkeleton from '@/components/table-skeleton'


const AnnouncementTable = () => {

  const {data, isLoading} = useAnnouncements(); 

  if (isLoading) return <TableSkeleton columns={7} rows={10} />; 

  return (
    <div className="space-y-6 p-6 bg-gray-100 rounded-sm border border-gray-200 w-full">
      
      {/* Search */}
      <div className="flex justify-between items-center">
        <InputGroup className="max-w-sm">
          <InputGroupInput placeholder="Search announcements..." />
          <InputGroupAddon align="inline-start">
            <SearchIcon className="text-muted-foreground w-4 h-4" />
          </InputGroupAddon>
        </InputGroup>
      </div>

      {/* Table */}
      <Table>
        <TableCaption className="text-gray-500">
          Announcements List
        </TableCaption>

        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>No.</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Content</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">Expiry Date</TableHead>
            <TableHead className="text-right">#</TableHead>
            <TableHead className="text-right">#</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data?.map((d: any) => (
            <AnnouncementTableRow
              announcement={d}
              key={d.id}
            />
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Total</TableCell>
            <TableCell className="text-right">
              {data?.length || 0}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
    

  )
}

export default AnnouncementTable