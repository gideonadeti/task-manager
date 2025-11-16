import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-dvh p-4">
      <Empty className="max-w-md">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <FileQuestion className="size-12 text-muted-foreground" />
          </EmptyMedia>
          <EmptyTitle>Page Not Found</EmptyTitle>
          <EmptyDescription>
            The page you're looking for doesn't exist or has been moved. Let's
            get you back on track.
          </EmptyDescription>
        </EmptyHeader>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/groups/today">Go to Today</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </Empty>
    </div>
  );
}

