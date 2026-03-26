import { Button } from "@/components/ui/button"; 


const CategoryList = () => { 

  const categories = [{id: 1, title: "emergency"}, {id: 2, title: "emergency"}, {id: 3, title: "awareness"}]

  return (
    <div>
      <Button>All</Button>
      <Button variant="secondary">All</Button>
      <Button variant="outline">News</Button>
      <Button variant="ghost">Awareness</Button>
    </div>
  )
}

export default CategoryList;