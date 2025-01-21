import { toast } from "sonner";

export function useToast() {
  return {
    toast: (props: { title: string; description: string; variant?: string }) => {
      if (props.variant === "destructive") {
        return toast.error(props.description);
      }
      return toast.success(props.description);
    }
  };
} 