import { notFound } from "next/navigation";
import { getShoeById } from "@/lib/services/shoe-service";
import ShoeForm from "@/components/admin/ShoeForm";
import type { CreateShoeInput } from "@/lib/validations/admin-shoe-schema";

const ATLASSIAN_COLORS = {
  text: "#172b4d",
};

export default async function AdminEditShoePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shoe = await getShoeById(id);

  if (!shoe) {
    notFound();
  }

  const initialData: CreateShoeInput = {
    brand: shoe.brand,
    model: shoe.model,
    version: shoe.version ?? undefined,
    year: shoe.year ?? undefined,
    price: shoe.price,
    weightG: shoe.weightG ?? undefined,
    dropMm: shoe.dropMm ?? undefined,
    stackHeightHeel: shoe.stackHeightHeel ?? undefined,
    stackHeightFore: shoe.stackHeightFore ?? undefined,
    cushionType: (shoe.cushionType as CreateShoeInput["cushionType"]) ?? undefined,
    cushionMaterial: shoe.cushionMaterial ?? undefined,
    outsoleMaterial: shoe.outsoleMaterial ?? undefined,
    upperMaterial: shoe.upperMaterial ?? undefined,
    widthOptions: shoe.widthOptions,
    surfaceType: shoe.surfaceType,
    pronationType: (shoe.pronationType as CreateShoeInput["pronationType"]) ?? "neutral",
    category: shoe.category as CreateShoeInput["category"],
    durabilityKm: shoe.durabilityKm ?? undefined,
    officialUrl: shoe.officialUrl ?? "",
    imageUrl: shoe.imageUrl ?? "",
    description: shoe.description ?? undefined,
    dailyJog: shoe.trainingFit?.dailyJog ?? 3,
    paceRun: shoe.trainingFit?.paceRun ?? 3,
    interval: shoe.trainingFit?.interval ?? 3,
    longRun: shoe.trainingFit?.longRun ?? 3,
    race: shoe.trainingFit?.race ?? 3,
    recovery: shoe.trainingFit?.recovery ?? 3,
  };

  return (
    <div>
      <h1
        style={{
          color: ATLASSIAN_COLORS.text,
          fontSize: "24px",
          fontWeight: 700,
          marginBottom: "24px",
        }}
      >
        シューズ編集: {shoe.brand} {shoe.model}
      </h1>
      <ShoeForm mode="edit" shoeId={id} initialData={initialData} />
    </div>
  );
}
