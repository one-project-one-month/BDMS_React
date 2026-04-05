import { useParams } from "react-router-dom";

export default function RequestDetailPage() {

  const { requestId } = useParams<{ requestId: string }>();

  return (
    <div>RequestDetailPage - {requestId}</div>
  )
}
