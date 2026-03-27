import React from 'react'
import AnnouncementTableRow from './AnnouncementTableRow'
import { useAnnouncements } from '../../hooks/useAnnouncement'
import { TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SearchIcon, Table } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'


const AnnouoncementTable = () => {

  const {data, isLoading} = useAnnouncements(); 

  if (isLoading) return <div>Loading... </div>

  return (
    <>
      <div>
        <InputGroup>
          <InputGroupInput id="inline-start-input" placeholder="Search..." />
          <InputGroupAddon align="inline-start">
            <SearchIcon className="text-muted-foreground" />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <Table>
        <TableCaption>Announcements List</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">No.</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Content</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-right">Expiry Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
          data?.map((d : any) => (
            <AnnouncementTableRow announcement={d} key={d.id}/>
          ))
        }
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right"></TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
    

  )
}

export default AnnouoncementTable