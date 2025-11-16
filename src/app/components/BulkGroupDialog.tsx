"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
      <DialogContent className="max-w-md max-h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Move to Group</DialogTitle>
        </DialogHeader>
        <Command className="rounded-lg border-none">
          <CommandInput placeholder="Search groups..." />
          <CommandList className="max-h-[60vh]">
            <CommandEmpty>No groups found.</CommandEmpty>
            <CommandGroup>
              {groupsQuery.data?.map((group) => (
                <CommandItem
                  key={group.id}
                  onSelect={() => handleSelect(group.id)}
                  className="cursor-pointer"
                >
                  {group.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
