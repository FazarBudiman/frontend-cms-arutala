import { Message, MessageStatus, messageStatusEnum } from "@/types/message";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { IconListDetails } from "@tabler/icons-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { statusColor } from "./columns";
import { Field, FieldLabel } from "../ui/field";

export function MessageDetailSheet({ message }: { message: Message }) {
  const [statusMessage, setStatusMessage] = useState<MessageStatus>(message.message_status);

  const messageStatus = messageStatusEnum.options.map((status) => ({
    label: status,
    value: status,
  }));
  return (
    <Sheet>
      <SheetTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <IconListDetails className="mr-2 size-4" />
          Detail
        </DropdownMenuItem>
      </SheetTrigger>

      <SheetContent side="right" className="w-120">
        <SheetHeader>
          <SheetTitle>Message Detail</SheetTitle>
          <SheetDescription>Make changes here. Click save when you&apos;re done</SheetDescription>
        </SheetHeader>

        <div className="grid flex-1 auto-rows-min gap-6 px-4">
          <Field className="grid gap-3">
            <Label htmlFor="sheet-demo-name">Name</Label>
            <Input id="sheet-demo-name" defaultValue={message.sender_name} disabled />
          </Field>
          <Field className="grid gap-3">
            <Label htmlFor="sheet-demo-phone">Phone Number</Label>
            <Input id="sheet-demo-phone" defaultValue={message.sender_phone} disabled />
          </Field>
          <Field className="grid gap-3">
            <Label htmlFor="sheet-demo-email">Email</Label>
            <Input id="sheet-demo-email" defaultValue={message.sender_email} disabled />
          </Field>
          <Field className="grid gap-3">
            <Label htmlFor="sheet-demo-institution">Institution</Label>
            <Input id="sheet-demo-institution" defaultValue={message.organization_name} disabled />
          </Field>
          <Field className="grid gap-3">
            <Label htmlFor="sheet-demo-subject">Subject</Label>
            <Input id="sheet-demo-subject" defaultValue={message.subject} disabled />
          </Field>
          <Field className="grid gap-3">
            <FieldLabel>Message</FieldLabel>
            <Textarea defaultValue={message.message_body} disabled />
          </Field>
          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select value={statusMessage} onValueChange={(value: MessageStatus) => setStatusMessage(value)}>
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
          </Field>
        </div>

        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose>
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
