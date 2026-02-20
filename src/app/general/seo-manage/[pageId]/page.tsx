"use client";

import { useParams } from "next/navigation";
import { SkeletonCourseDetail } from "@/components/skeleton-detail-card";
import { usePage } from "@/features/seo-manage/page/hook";
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useChangeStatusSeo, useSeos } from "@/features/seo-manage/seo/hook";
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
import { CheckCircle, XCircle } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { toast } from "sonner";
import { SeoAddlDialog } from "@/features/seo-manage/seo/component/seo-add";
import { SeoEditlDialog } from "@/features/seo-manage/seo/component/seo-edit";
import { SeoDeleteDialog } from "@/features/seo-manage/seo/component/seo-delete";

export default function CourseDetailPage() {
  const params = useParams();
  const pageId = params.pageId as string;

  const { data, isLoading, isError, error } = usePage(pageId);
  const { data: seos } = useSeos(pageId);
  const { mutateAsync } = useChangeStatusSeo();

  const handleChangeStatus = async (pageId: string, seoId: string) => {
    toast.promise(mutateAsync({ pageId, seoId }), {
      loading: "Mengubah status SEO...",
      success: "Mengubah Status SEO berhasil",
      error: "Gagal Mengubah status SEO",
    });
  };

  if (isLoading) {
    return <SkeletonCourseDetail />;
  }

  if (isError) {
    return <div>Error: {(error as Error).message}</div>;
  }

  if (!data) {
    return <div>Course not found</div>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="p-4 lg:px-6 flex flex-col gap-10">
        <Card>
          <CardHeader>
            <CardTitle>{data.page_title}</CardTitle>
            <CardDescription>{data.page_slug}</CardDescription>
          </CardHeader>

          <CardContent>
            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
                <CardDescription>
                  Dibawah merupakan daftar SEO yang pernah ditambahkan pada halaman <strong>{data.page_title}</strong>
                </CardDescription>
                <CardAction>
                  <SeoAddlDialog />
                </CardAction>
              </CardHeader>
              <CardContent className="space-y-3">
                {seos?.map((seo, index) => (
                  <Item key={index} className="py-2" variant="outline">
                    <ItemMedia variant="icon">{seo.is_active ? <CheckCircle className="text-green-600" /> : <XCircle className="text-red-500" />}</ItemMedia>
                    <ItemContent>
                      <ItemTitle className="text-sm leading-tight">{seo.meta_title}</ItemTitle>
                      <ItemDescription className="text-xs text-muted-foreground leading-tight">{seo.meta_description}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <ButtonGroup>
                        <Button size="sm" variant="outline" onClick={() => handleChangeStatus(data.page_id, seo.seo_id)}>
                          Change Status
                        </Button>
                        <SeoEditlDialog seo={{ metaTitle: seo.meta_title, metaDescription: seo.meta_description }} seoId={seo.seo_id} />
                        <SeoDeleteDialog pageId={pageId} seoId={seo.seo_id} />
                      </ButtonGroup>
                    </ItemActions>
                  </Item>
                ))}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
