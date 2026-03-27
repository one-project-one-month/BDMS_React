import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gray-200 rounded-md ${className}`} />
)

const AnnouncementTableLoader = () => {
  return (
    <div className="space-y-6 p-6 bg-gray-100 rounded-sm border border-gray-200 w-full">
      
      {/* Search Skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-64" />
      </div>

      {/* Table Skeleton */}
      <Table>
        <TableHeader>
          <TableRow>
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
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-6" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-48" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-16 ml-auto" />
              </TableCell>
              <TableCell className="text-right">
                <Skeleton className="h-4 w-24 ml-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default AnnouncementTableLoader