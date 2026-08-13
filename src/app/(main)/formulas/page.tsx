import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SavedFormulasList } from "@/components/formula/SavedFormulasList";

export default async function FormulasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: formulas } = await supabase
    .from("saved_formulas")
    .select("id, latex, label, source, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 overflow-y-auto p-4">
      <h1 className="font-display text-heading-md font-semibold text-ink-primary">สูตรของฉัน</h1>
      <SavedFormulasList initialFormulas={formulas ?? []} />
    </div>
  );
}
