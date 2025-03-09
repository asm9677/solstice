import { toast } from "sonner";

interface IToast {
  message: string;
  type?: "success" | "error" | "warning" | "info";
}

export const useToast = () => {
  const toaster = ({ message, type = "success" }: IToast) => {
    if (type === "success")
      toast.success(message, { style: { width: "370px" } });
    if (type === "error") toast.error(message);
    if (type === "warning") toast.warning(message);
    if (type === "info") toast.info(message);
  };

  return { toaster };
};
