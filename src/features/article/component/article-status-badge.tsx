import { Badge } from "@/components/ui/badge";

type ArticleStatusBadgeProps = {
  status: "DRAFT" | "PUBLISHED";
};

export function ArticleStatusBadge({ status }: ArticleStatusBadgeProps) {
  return (
    <Badge variant={status === "PUBLISHED" ? "default" : "secondary"}>
      {status === "PUBLISHED" ? "Published" : "Draft"}
    </Badge>
  );
}
