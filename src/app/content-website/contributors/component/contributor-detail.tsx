import { Message, MessageStatus, messageStatusEnum } from "@/types/message";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { IconListDetails } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Field, FieldLabel } from "@/components/ui/field";
import { useUpdateMessageStatus } from "@/hooks/use-message";
import { toast } from "sonner";
import { Contributor } from "@/types/contributor";

export function ContributorDetailSheet({ contributor }: { contributor: Contributor }) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleUpdate = async () => {
    // if (statusMessage === message.message_status) {
    //   toast.info("Status tidak berubah");
    //   return;
    // }
    // toast.promise(
    //   mutateAsync({
    //     messageId: message.message_id,
    //     status: statusMessage,
    //   }),
    //   {
    //     loading: "Menyimpan perubahan…",
    //     success: (res) => {
    //       if (!res.success) {
    //         throw new Error(res.message);
    //       }
    //       setSheetOpen(false);
    //       return res.message;
    //     },
    //     error: (err) => {
    //       setStatusMessage(message.message_status);
    //       return err.message || "Gagal memperbarui status";
    //     },
    //   },
    // );
  };

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <IconListDetails className="mr-2 size-4" />
          Detail
        </DropdownMenuItem>
      </SheetTrigger>

      <SheetContent side="right" className="w-120">
        <SheetHeader>
          <SheetTitle>Contributor Detail</SheetTitle>
          <SheetDescription>Make changes here. Click save when you&apos;re done</SheetDescription>
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <Field className="grid gap-3">
            <Label htmlFor="sheet-demo-name">Name</Label>
            <Input id="sheet-demo-name" defaultValue={contributor.contributor_name} disabled />
          </Field>
          <Field className="grid gap-3">
            <Label htmlFor="sheet-demo-phone">Job Title</Label>
            <Input id="sheet-demo-phone" defaultValue={contributor.contributor_job_title} disabled />
          </Field>
          <Field className="grid gap-3">
            <Label htmlFor="sheet-demo-email">Company Name</Label>
            <Input id="sheet-demo-email" defaultValue={contributor.contributor_company_name} disabled />
          </Field>
          <Field className="grid gap-3">
            <Label htmlFor="sheet-demo-institution">Expertise</Label>
            {contributor.contributor_expertise.map((expert) => (
              <Input id="sheet-demo-institution" defaultValue={expert} key={expert} disabled />
            ))}
          </Field>
          {/* <Field className="grid gap-3">
            <Label htmlFor="sheet-demo-subject">Subject</Label>
            <Input id="sheet-demo-subject" defaultValue={message.subject} disabled />
          </Field>
          <Field className="grid gap-3">
            <FieldLabel>Message</FieldLabel>
            <Textarea defaultValue={message.message_body} disabled />
          </Field>
          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select value={statusMessage} onValueChange={(value: MessageStatus) => setStatusMessage(value)} disabled={isPending}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  {messageStatus.map((status) => {
                    return (
                      <SelectItem value={status.value} key={status.value}>
                        <Badge className={statusColor[status.value as MessageStatus]}>{status.label}</Badge>
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field> */}
        </div>

        <SheetFooter>
          {/* <Button type="submit" onClick={handleUpdate} disabled={isPending}>
            {isPending ? "Saving" : "Save changes"}
          </Button> */}
          <Button type="submit" onClick={handleUpdate}>
            Save changes
          </Button>
          <SheetClose asChild>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
