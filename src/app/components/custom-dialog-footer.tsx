import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialogFooter,
  AlertDialogCancel,
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
      <AlertDialogFooter className="flex-row justify-end gap-2 sm:space-x-2">
        <AlertDialogCancel
          disabled={isPending}
          onClick={() => handleCancel()}
          className="flex-1 sm:flex-initial sm:w-32 h-11 sm:h-10 min-h-[44px] sm:min-h-0 mt-0"
        >
          Cancel
        </AlertDialogCancel>
        <Button
          disabled={disabled || isPending}
          onClick={() => handleSubmit()}
          className="flex-1 sm:flex-initial sm:w-32 h-11 sm:h-10 min-h-[44px] sm:min-h-0"
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
      </AlertDialogFooter>
    );
  }

  return (
    <DialogFooter className="flex-row justify-end gap-2 sm:space-x-2">
      <Button
        type="button"
        variant="secondary"
        onClick={() => handleCancel()}
        disabled={isPending}
        className="flex-1 sm:flex-initial sm:w-32 h-11 sm:h-10 min-h-[44px] sm:min-h-0"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        onClick={() => handleSubmit()}
        disabled={disabled || isPending}
        className="flex-1 sm:flex-initial sm:w-32 h-11 sm:h-10 min-h-[44px] sm:min-h-0"
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
