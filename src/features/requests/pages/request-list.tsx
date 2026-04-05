import { Link } from "react-router-dom";

export default function RequestListPage() {
  return (
    <div>
      <h1>RequestListPage</h1>
      <Link to="/admin/blood-requests/1">Go to Request Detail</Link>
      <br />
      <Link to="/admin/blood-requests/1/edit">Go to Request Edit</Link>
    </div>
  );
}
