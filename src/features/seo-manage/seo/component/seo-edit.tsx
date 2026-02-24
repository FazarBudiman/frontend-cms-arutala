import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useUpdateDetailSeo } from "../hook";
import { SeoInput, seoInputSchema } from "../type";
import { Textarea } from "@/components/ui/textarea";
import { useParams } from "next/navigation";
import { IconListDetails } from "@tabler/icons-react";
import { EntityDialog } from "@/components/shared/entity-dialog";

export function SeoEditDialog({ seo, seoId }: { seo: SeoInput; seoId: string }) {
  const [open, setOpen] = useState(false);
  const { mutateAsync, isPending } = useUpdateDetailSeo();
  const params = useParams();
  const pageId = params.pageId as string;

  const handleSubmit = async (values: SeoInput) => {
    toast.promise(mutateAsync({ pageId: pageId, seoId: seoId, body: values }), {
      loading: "Mengubah SEO pada Page...",
      success: () => "Mengubah SEO berhasil",
      error: (err) => err.message || "Failed to edit SEO",
    });
    setOpen(false);
  };

  const form = useForm<SeoInput>({
    resolver: zodResolver(seoInputSchema),
    defaultValues: {
      metaTitle: seo.metaTitle,
      metaDescription: seo.metaDescription,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        metaTitle: seo.metaTitle,
        metaDescription: seo.metaDescription,
      });
    }
  }, [open, seo, form]);

  return (
    <EntityDialog
      open={open}
      onOpenChange={setOpen}
      title="Edit SEO"
      description="Make changes here. Click save when you're done"
      isPending={isPending}
      saveLabel="Save Changes"
      onSubmit={form.handleSubmit(handleSubmit)}
      trigger={
        <Button variant="outline" size="icon-sm">
          <IconListDetails />
        </Button>
      }
    >
      <Controller
        name="metaTitle"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="md:col-span-2 gap-1" data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="metaTitle">Meta Title</FieldLabel>
            <Input {...field} id="metaTitle" aria-invalid={fieldState.invalid} autoComplete="off" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="metaDescription"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field className="md:col-span-2 gap-1" data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="metaDescription">Meta Description</FieldLabel>
            <Textarea {...field} id="metaDescription" aria-invalid={fieldState.invalid} autoComplete="off" className="min-h-20" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </EntityDialog>
  );
}
