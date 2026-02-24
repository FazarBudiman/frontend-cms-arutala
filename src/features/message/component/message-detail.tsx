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
import { formatedDate } from "@/shared/utils/date";
import { InputGroup, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { generateWhatsAppMessage, generateWhatsAppNumber } from "@/shared/utils/whatsapp";
import { useUpdateMessageStatus } from "../hook";
import { Message, MessageStatus, messageStatusEnum } from "../type";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

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
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* Trigger */}
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="icon-sm">
          <IconListDetails />
        </Button>
      </AlertDialogTrigger>

      {/* Content */}
      <AlertDialogContent className="sm:max-w-3xl max-h-max h-fit">
        {/* Header */}
        <AlertDialogHeader>
          <AlertDialogTitle>Message Detail</AlertDialogTitle>
          <AlertDialogDescription>Make changes here. Click save when you&apos;re done</AlertDialogDescription>
        </AlertDialogHeader>
        <Separator />

        {/* Detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-4 no-scrollbar -mx-4 max-h-max overflow-y-auto px-4">
          {/* Tanggal */}
          <div className="flex items-end col-span-2">
            <Field className="gap-1 col-span-1">
              <FieldLabel>
                <Badge className="px-4 py-1 w-fit"> {formatedDate(message.created_date)}</Badge>
              </FieldLabel>
            </Field>
            {/* Status */}
            <Field className="md:col-span-1 gap-1">
              <FieldLabel>Status</FieldLabel>
              <Select value={statusMessage} onValueChange={(v: MessageStatus) => setStatusMessage(v)} disabled={isPending}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectGroup>
                    {messageStatus.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <Badge className={statusColor[status.value]}>
                          {status.label
                            .toLowerCase()
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (c) => c.toUpperCase())}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Separator className="col-span-2" />

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

            <div className="flex flex-wrap gap-2.5">
              {message.subject.map((item) => (
                <Badge key={item} variant="secondary" className="flex items-center gap-1.5">
                  {item}
                </Badge>
              ))}
            </div>
          </Field>

          {/* Message */}
          <Field className="md:col-span-2 gap-1">
            <FieldLabel>Message</FieldLabel>
            <Textarea value={message.message_body} disabled className="h-fit" />
          </Field>
        </div>

        {/* Footer */}
        <AlertDialogFooter className="flex w-full justify-between">
          <AlertDialogCancel asChild size="sm">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </AlertDialogCancel>
          <Button type="submit" size="sm" onClick={handleUpdate} disabled={isPending}>
            {isPending ? "Saving" : "Save Changes"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
