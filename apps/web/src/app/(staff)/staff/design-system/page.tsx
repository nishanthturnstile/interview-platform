import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Design system | BU Interview Studio",
};

const statuses = [
  { label: "Saved", variant: "success", usage: "Completed operation" },
  { label: "Action needed", variant: "warning", usage: "Requires follow-up" },
  { label: "Pending", variant: "info", usage: "Scheduled or in progress" },
  { label: "Failed", variant: "error", usage: "Operational failure" },
  { label: "Unassessed", variant: "muted", usage: "Awaiting an assessment" },
] as const;

export default function DesignSystemPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <h1>Design system</h1>
        <p className="text-muted-foreground">
          Try the shared controls and status colors in the current theme.
        </p>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>
              <h2>Form controls</h2>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="example-name">Example name</FieldLabel>
                <Input id="example-name" placeholder="Enter a name" />
              </Field>
              <Field>
                <FieldLabel htmlFor="example-role">Workspace role</FieldLabel>
                <Select defaultValue="panelist">
                  <SelectTrigger id="example-role" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="director">Director</SelectItem>
                      <SelectItem value="hr">HR coordinator</SelectItem>
                      <SelectItem value="panelist">Panelist</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="include-archived" />
                <FieldLabel
                  htmlFor="include-archived"
                  className="min-h-11 md:min-h-10"
                >
                  Include archived records
                </FieldLabel>
              </Field>
            </FieldGroup>
            <div className="flex flex-wrap gap-3 border-t pt-5">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Open dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader className="pe-11">
                    <DialogTitle>Dialog example</DialogTitle>
                    <DialogDescription>
                      Use dialogs for decisions that need focused attention.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Open sheet</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader className="pe-14">
                    <SheetTitle>Sheet example</SheetTitle>
                    <SheetDescription>
                      Use sheets for details that sit alongside the current
                      task.
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </div>
          </CardContent>
        </Card>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>
              <h2>Status indicators</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table aria-label="Status indicators">
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead scope="col">Status</TableHead>
                  <TableHead scope="col">Use</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statuses.map(({ label, variant, usage }) => (
                  <TableRow key={variant} className="h-11">
                    <TableCell>
                      <Badge variant={variant}>{label}</Badge>
                    </TableCell>
                    <TableCell className="whitespace-normal text-muted-foreground">
                      {usage}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
