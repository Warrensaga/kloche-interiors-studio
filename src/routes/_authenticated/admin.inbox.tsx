import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AdminHeading } from "@/components/admin/fields";

export const Route = createFileRoute("/_authenticated/admin/inbox")({
  component: AdminInbox,
});

const csvCell = (v: string) => `"${String(v ?? "").replace(/"/g, '""')}"`;

function AdminInbox() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "inbox"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", "inbox"] });

  function exportCsv() {
    const rows = data ?? [];
    const header = ["Date", "Name", "Email", "Phone", "Budget", "Property type", "Message"];
    const body = rows.map((r) =>
      [
        new Date(r.created_at).toISOString(),
        r.name,
        r.email,
        r.phone,
        r.budget,
        r.property_type,
        r.message,
      ]
        .map(csvCell)
        .join(","),
    );
    const blob = new Blob([[header.join(","), ...body].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "kloche-enquiries.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  const unread = (data ?? []).filter((d) => !d.read).length;

  return (
    <>
      <AdminHeading
        eyebrow="Dashboard"
        title="Enquiries"
        description={`${data?.length ?? 0} total · ${unread} unread`}
        actions={
          <Button variant="outline" onClick={exportCsv}>
            <Download size={16} /> Export CSV
          </Button>
        }
      />

      <div className="mt-8 space-y-3">
        {(data ?? []).map((r) => (
          <article
            key={r.id}
            className={`rounded-2xl border p-5 ${r.read ? "border-border bg-card" : "border-accent/50 bg-card"}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-display text-lg">{r.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleString()} · {r.email} · {r.phone}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    await supabase.from("contact_submissions").update({ read: !r.read }).eq("id", r.id);
                    refresh();
                  }}
                >
                  Mark {r.read ? "unread" : "read"}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Delete"
                  onClick={async () => {
                    if (!window.confirm("Delete this enquiry?")) return;
                    await supabase.from("contact_submissions").delete().eq("id", r.id);
                    refresh();
                  }}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
            {(r.budget || r.property_type) && (
              <p className="mt-3 text-xs uppercase tracking-[0.14em] text-accent">
                {[r.property_type, r.budget].filter(Boolean).join(" · ")}
              </p>
            )}
            <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">{r.message}</p>
          </article>
        ))}
        {!data?.length && <p className="text-sm text-muted-foreground">No enquiries yet.</p>}
      </div>
    </>
  );
}
