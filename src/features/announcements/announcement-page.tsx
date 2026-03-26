import Announcements from "./components/announcements";
import CategoryList from "./components/category-list";

const AnnouncementPage = () => {
  return (
    <div className="flex items-center justify-between bg-accent">
      <h1 className="text-2xl text-primary">This is announcement page!</h1>
      <CategoryList/>
      <Announcements/>
    </div>
  )
}

export default AnnouncementPage;