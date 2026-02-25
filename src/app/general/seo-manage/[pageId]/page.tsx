"use client";

import { useParams, useRouter } from "next/navigation";
import { usePage } from "@/features/seo-manage/page";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useChangeStatusSeo, useSeos, SeoAddDialog, SeoEditDialog, SeoDeleteDialog } from "@/features/seo-manage/seo";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { CheckCircle, XCircle } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { toast } from "sonner";
import { SkeletonDetailCard } from "@/components/shared/skeleton-detail-card";
import { EmptyState } from "@/components/shared/empty-state";
import { IconCircleArrowLeft, IconWorldSearch } from "@tabler/icons-react";
import { useSetBreadcrumbLabel } from "@/providers";
import { cn } from "@/shared/lib/cn";
import { Separator } from "@/components/ui/separator";

export default function SeoManageDetailPage() {
  const params = useParams();
  const pageId = params.pageId as string;

  const { data } = usePage(pageId);
  const { data: seos, isLoading } = useSeos(pageId);
  const { mutateAsync } = useChangeStatusSeo();
  const router = useRouter();

  useSetBreadcrumbLabel(`/general/seo-manage/${pageId}`, data?.page_title);

  const handleChangeStatus = async (pageId: string, seoId: string) => {
    toast.promise(mutateAsync({ pageId, seoId }), {
      loading: "Mengubah status SEO...",
      success: "Mengubah Status SEO berhasil",
      error: "Gagal Mengubah status SEO",
    });
  };

  if (isLoading) {
    return <SkeletonDetailCard />;
  }

  if (!data) {
    return <EmptyState title="No Seo" description="No SEO added yet" icon={<IconWorldSearch />} />;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 lg:px-6 flex flex-col gap-4">
        <div className=" flex items-start gap-3">
          <Button variant="outline" size="icon-sm" onClick={() => router.back()}>
            <IconCircleArrowLeft className="size-5" />
          </Button>
          <div className="flex flex-col items-start gap-1">
            <h6 className="text-lg font-medium">{data.page_title}</h6>
            <p className="text-xs text-muted-foreground">{data.page_slug}</p>
          </div>
        </div>
        <Separator />
        <Card>
          <CardHeader>
            <CardTitle>SEO</CardTitle>
            <CardDescription>
              Dibawah merupakan daftar SEO yang pernah ditambahkan pada halaman <strong>{data.page_title}</strong>
            </CardDescription>
            <CardAction>
              <SeoAddDialog />
            </CardAction>
          </CardHeader>
          <CardContent className="space-y-3">
            {seos?.length === 0 ? (
              <EmptyState title="No SEO" description="No SEO added yet" icon={<IconWorldSearch />} />
            ) : (
              seos?.map((seo) => (
                <Item key={seo.seo_id} className={cn("py-2 transition-all hover:bg-muted/40", seo.is_active && "border-green-500 bg-green-50")} variant="outline">
                  <ItemMedia variant="icon">{seo.is_active ? <CheckCircle className="text-green-600" /> : <XCircle className="text-red-500" />}</ItemMedia>
                  <ItemContent>
                    <ItemTitle className="text-sm leading-tight">{seo.meta_title}</ItemTitle>
                    <ItemDescription className="text-xs text-muted-foreground leading-tight">{seo.meta_description}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <ButtonGroup>
                      <Button size="sm" variant="secondary" onClick={() => handleChangeStatus(data.page_id, seo.seo_id)}>
                        {seo.is_active ? "Non Aktifkan" : "Aktifkan"}
                      </Button>
                      <SeoEditDialog seo={{ metaTitle: seo.meta_title, metaDescription: seo.meta_description }} seoId={seo.seo_id} />
                      <SeoDeleteDialog pageId={pageId} seoId={seo.seo_id} />
                    </ButtonGroup>
                  </ItemActions>
                </Item>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
