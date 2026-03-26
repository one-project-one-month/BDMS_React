import { Card } from '@/components/ui/card'

const Announcements = () => {
  const announcementsList = [{id: 1, title: "Urgent need for blood type (B+)", content: "We urgently need B+ blood donors. A patient in critical condition requires immediate transfusion. Please contact us if you can donate.", type: "emergency", time: "2 days ago"}]
  return (
    <div>
      <Card>Hello Announcements</Card>
    </div>
  )
}

export default Announcements