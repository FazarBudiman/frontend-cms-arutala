import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { IconBrandWhatsappFilled, IconListDetails } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { statusColor } from "./columns";
import { Field, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatedDate } from "@/shared/utils/date";
import { InputGroup, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";

import { generateWhatsAppMessage, generateWhatsAppNumber } from "@/shared/utils/whatsapp";
import { useUpdateMessageStatus } from "../hook";
import { Message, MessageStatus, messageStatusEnum } from "../type";

export function MessageDetailDialog({ message }: { message: Message }) {
  const [open, setOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<MessageStatus>(message.message_status);

  const { mutateAsync, isPending } = useUpdateMessageStatus();

  const messageStatus = messageStatusEnum.options.map((status) => ({
    label: status,
    value: status,
  }));

  const handleUpdate = async () => {
    if (statusMessage === message.message_status) {
      toast.info("Status tidak berubah");
      return;
    }

    toast.promise(
      mutateAsync({
        messageId: message.message_id,
        status: statusMessage,
      }),
      {
        loading: "Menyimpan perubahan…",
        success: () => {
          setOpen(false);
          return "Memperbarui pesan berhasil";
        },
        error: (err) => {
          setStatusMessage(message.message_status);
          return err.message || "Gagal memperbarui status";
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <IconListDetails className="mr-2 size-4" />
          Detail
        </DropdownMenuItem>
      </DialogTrigger>

      {/* Content */}
      <DialogContent className="sm:max-w-3xl max-h-max h-11/12 ">
        {/* Header */}
        <DialogHeader>
          <DialogTitle>Message Detail</DialogTitle>
          <DialogDescription>Make changes here. Click save when you&apos;re done</DialogDescription>
        </DialogHeader>

        {/* Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2 no-scrollbar -mx-4 max-h-max overflow-y-auto px-4">
          <Field className="gap-1 md:col-span-2">
            <FieldLabel>
              <Badge className="px-4 py-1"> {formatedDate(message.created_date)}</Badge>
            </FieldLabel>
          </Field>

          {/* Name */}
          <Field className="gap-1">
            <FieldLabel>Name</FieldLabel>
            <Input value={message.sender_name} disabled />
          </Field>

          {/* Email */}
          <Field className="gap-1">
            <FieldLabel>Email</FieldLabel>
            <Input value={message.sender_email} disabled />
          </Field>

          {/* Institution */}
          <Field className="gap-1">
            <FieldLabel>Institution</FieldLabel>
            <Input value={message.organization_name} disabled />
          </Field>

          {/* Phone */}
          <Field className="gap-1">
            <FieldLabel>Phone Number</FieldLabel>
            <InputGroup>
              <InputGroupInput value={message.sender_phone} disabled />
              <InputGroupButton variant="ghost" size="icon-sm">
                <a href={`https://wa.me/${generateWhatsAppNumber(message.sender_phone)}?text=${generateWhatsAppMessage(message.sender_phone)}`} target="_blank" rel="noopener noreferrer">
                  <IconBrandWhatsappFilled />
                </a>
              </InputGroupButton>
            </InputGroup>
            {/* <Input value={message.sender_phone} disabled /> */}
          </Field>

          {/* Subject */}
          <Field className="md:col-span-2 gap-1">
            <FieldLabel>Subject</FieldLabel>
            <Input value={message.subject} disabled />
          </Field>

          {/* Message */}
          <Field className="md:col-span-2 gap-1">
            <FieldLabel>Message</FieldLabel>
            <Textarea value={message.message_body} disabled className="h-fit" />
          </Field>

          {/* Status */}
          <Field>
            <FieldLabel>Status</FieldLabel>
            <Select value={statusMessage} onValueChange={(v: MessageStatus) => setStatusMessage(v)} disabled={isPending}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  {messageStatus.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      <Badge className={statusColor[status.value]}>{status.label}</Badge>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </div>

        {/* Footer */}
        <DialogFooter className="flex w-full justify-between">
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" size="sm" onClick={handleUpdate} disabled={isPending}>
            {isPending ? "Saving" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
