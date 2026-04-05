import { toast } from "sonner";
import type { ReactNode } from "react";

type ConfirmOptions = {
  onConfirm: () => void;
  message?: string | ReactNode;
  toastMessage: string;
};

export const confirmDelete = ({onConfirm, message = "Are you sure?", toastMessage}: ConfirmOptions): void => {
  const toastId = toast(
    <div className="flex flex-col gap-2">
      <p className="text-sm">{message}</p>

      <div className="flex gap-2 justify-end">
        <button
          onClick={ async () => {
            toast.dismiss(toastId);
            onConfirm();
            
            try {
              await onConfirm(); // ✅ wait for mutation
              toast.success(toastMessage, {
                position: "bottom-right",
              });
            } catch (error) {
              toast.error("Something went wrong", {
                position: "bottom-right",
              });
            }
          }}
          className="px-3 py-1 bg-primary text-white rounded hover:bg-primary-foreground"
        >
          Confirm
        </button>

        <button
          onClick={() => toast.dismiss(toastId)}
          className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>,
    { duration: Infinity }
  );
};