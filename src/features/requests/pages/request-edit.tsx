import { useParams } from "react-router-dom";

export default function RequestEditPage() {
  const { requestId } = useParams<{ requestId: string }>();

  return <div>RequestEditPage - {requestId}</div>;
}
