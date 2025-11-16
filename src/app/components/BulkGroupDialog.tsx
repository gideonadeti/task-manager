"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import useGroups from "@/hooks/use-groups";

interface BulkGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectGroup: (groupId: string) => void;
}

export default function BulkGroupDialog({
  open,
  onOpenChange,
  onSelectGroup,
}: BulkGroupDialogProps) {
  const { groupsQuery } = useGroups();

  const handleSelect = (groupId: string) => {
    onSelectGroup(groupId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Move to Group</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[68vh] pr-4">
          <div className="space-y-2 py-4">
            {groupsQuery.data?.map((group) => (
              <Button
                key={group.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleSelect(group.id)}
              >
                {group.name}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
