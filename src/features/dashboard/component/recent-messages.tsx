"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatedDate } from "@/shared/utils/date";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { IconBrandWhatsappFilled, IconMessage2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { generateWhatsAppMessage, generateWhatsAppNumber } from "@/shared/utils/whatsapp";
import Link from "next/link";

type RecentMessagesProps = {
  messages: {
    message_id: string;
    sender_name: string;
    sender_email: string;
    sender_phone: string;
    subject: string[];
    created_date: string;
  }[];
};

export function RecentMessages({ messages }: RecentMessagesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Messages</CardTitle>
        <CardDescription>Latest incoming messages</CardDescription>
      </CardHeader>

      <CardContent className="space-y-1">
        {messages.length ? (
          messages.map((message) => {
            const WaPhone = generateWhatsAppNumber(message.sender_phone);
            const messageWa = generateWhatsAppMessage(message.sender_name);
            return (
              <div key={message.message_id} className="p-3 border rounded-md flex flex-col">
                <div className="flex justify-between">
                  <p className="text-xs text-muted-foreground">Dikirim pada: {formatedDate(message.created_date)}</p>
                  <Link href={`https://wa.me/${WaPhone}?text=${messageWa}`} target="_blank" rel="noopener noreferrer">
                    <Button size="icon-xs">
                      <IconBrandWhatsappFilled />
                    </Button>
                  </Link>
                </div>
                <div className="space-y-1.5">
                  <p className="font-medium text-sm">{message.sender_name}</p>
                  <div className="flex flex-wrap gap-1">
                    {message.subject.map((subj, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {subj}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <Empty className="border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconMessage2 />
              </EmptyMedia>
              <EmptyTitle className="text-sm">No messages</EmptyTitle>
              <EmptyDescription className="text-xs">No messages received yet.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </CardContent>
    </Card>
  );
}
