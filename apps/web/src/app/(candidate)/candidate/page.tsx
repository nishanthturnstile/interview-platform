import { CalendarIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function CandidatePage() {
  return (
    <>
      <h1>Candidate workspace</h1>
      <Card>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <CalendarIcon aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle>No interview to show</EmptyTitle>
            <EmptyDescription>
              Your interview details and exercise will appear here.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </Card>
    </>
  );
}
