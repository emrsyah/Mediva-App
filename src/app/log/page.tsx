import BottomNav from "@/components/BottomNav";
// import { supabaseClient } from "@/utils/supabase/client";
// import { createClient } from "@/utils/supabase/server";
// import { cookies } from "next/headers";

export default async function MedivaLog() {
  // const { data: drugs } = await supabaseClient.from("drugs").select();
  // console.log(drugs);

  return (
    <main className="max-w-md mx-auto min-h-screen px-4 pt-10 pb-24 flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Mediva Log</h1>
      <p className="text-muted-foreground text-sm">
        Catatan obat dan gejala akan ditampilkan di sini.
      </p>
      <BottomNav active="log" />
    </main>
  );
}
