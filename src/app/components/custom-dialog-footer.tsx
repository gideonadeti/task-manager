import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";

interface CustomDialogFooterProps {
  isPending: boolean;
  disabled?: boolean;
  handleCancel: () => void;
  handleSubmit: () => void;
}

const CustomDialogFooter = ({
  isPending,
  disabled,
  handleCancel,
  handleSubmit,
}: CustomDialogFooterProps) => {
  return (
    <DialogFooter>
      <Button
        variant="secondary"
        onClick={() => handleCancel()}
        disabled={isPending}
        className="w-32"
      >
        Cancel
      </Button>
      <Button
        onClick={() => handleSubmit()}
        disabled={disabled || isPending}
        className="w-32"
      >
        {isPending ? (
          <>
            <Spinner />
            Submitting...
          </>
        ) : (
          "Submit"
        )}
      </Button>
    </DialogFooter>
  );
};

export default CustomDialogFooter;
