import { Building2Icon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function StaffPage() {
  return (
    <div className="grid gap-6">
      <h1>Staff workspace</h1>
      <Card>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Building2Icon aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>No business units configured</EmptyTitle>
            <EmptyDescription>
              Business units and interview queues will appear here as they are
              set up.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button variant="outline" asChild>
              <Link href="/candidate">Open candidate preview</Link>
            </Button>
          </EmptyContent>
        </Empty>
      </Card>
    </div>
  );
}
