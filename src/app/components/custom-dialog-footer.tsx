import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Spinner } from "@/components/ui/spinner";

interface CustomDialogFooterProps {
  isPending: boolean;
  disabled?: boolean;
  handleCancel: () => void;
  handleSubmit: () => void;
  submitText?: string;
  variant?: "dialog" | "alert";
}

const CustomDialogFooter = ({
  isPending,
  disabled,
  handleCancel,
  handleSubmit,
  submitText = "Submit",
  variant = "dialog",
}: CustomDialogFooterProps) => {
  if (variant === "alert") {
    return (
      <AlertDialogFooter>
        <AlertDialogCancel
          disabled={isPending}
          onClick={() => handleCancel()}
          className="w-full sm:w-32 min-h-[44px]"
        >
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          disabled={disabled || isPending}
          onClick={() => handleSubmit()}
          className="w-full sm:w-32 min-h-[44px]"
        >
          {isPending ? (
            <>
              <Spinner />
              Submitting...
            </>
          ) : (
            submitText
          )}
        </AlertDialogAction>
      </AlertDialogFooter>
    );
  }

  return (
    <DialogFooter>
      <Button
        type="button"
        variant="secondary"
        onClick={() => handleCancel()}
        disabled={isPending}
        className="w-full sm:w-32 min-h-[44px]"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        onClick={() => handleSubmit()}
        disabled={disabled || isPending}
        className="w-full sm:w-32 min-h-[44px]"
      >
        {isPending ? (
          <>
            <Spinner />
            Submitting...
          </>
        ) : (
          submitText
        )}
      </Button>
    </DialogFooter>
  );
};

export default CustomDialogFooter;
