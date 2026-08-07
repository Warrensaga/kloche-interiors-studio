import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AdminHeading } from "@/components/admin/fields";

export const Route = createFileRoute("/_authenticated/admin/navigation")({
  component: AdminNavigation,
});

type Row = {
  id: string;
  label: string;
  href: string;
  sort_order: number;
  visible: boolean;
  location: string;
};

function AdminNavigation() {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["admin", "nav"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nav_items")
        .select("id, label, href, sort_order, visible, location")
        .order("sort_order");
      if (error) throw error;
      return data as Row[];
    },
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", "nav"] });

  async function update(id: string, patch: Partial<Row>) {
    const { error } = await supabase.from("nav_items").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else refresh();
  }

  async function add(location: string, count: number) {
    const { error } = await supabase
      .from("nav_items")
      .insert({ label: "New link", href: "/", location, sort_order: count });
    if (error) toast.error(error.message);
    else refresh();
  }

  async function remove(id: string) {
    const { error } = await supabase.from("nav_items").delete().eq("id", id);
    if (error) toast.error(error.message);
    else refresh();
  }

  async function move(list: Row[], index: number, dir: -1 | 1) {
    const a = list[index];
    const b = list[index + dir];
    if (!a || !b) return;
    await supabase.from("nav_items").update({ sort_order: b.sort_order }).eq("id", a.id);
    await supabase.from("nav_items").update({ sort_order: a.sort_order }).eq("id", b.id);
    refresh();
  }

  const groups: Array<{ key: "header" | "footer"; title: string }> = [
    { key: "header", title: "Header menu" },
    { key: "footer", title: "Footer menu" },
  ];

  return (
    <>
      <AdminHeading
        eyebrow="Dashboard"
        title="Navigation"
        description="Rename, reorder, hide or add links in the site header and footer."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {groups.map((g) => {
          const list = (data ?? []).filter((d) => d.location === g.key);
          return (
            <section key={g.key} className="rounded-3xl border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl">{g.title}</h2>
                <Button size="sm" variant="outline" onClick={() => add(g.key, list.length)}>
                  <Plus size={14} /> Add
                </Button>
              </div>
              <ul className="mt-5 space-y-3">
                {list.map((item, i) => (
                  <li key={item.id} className="flex flex-wrap items-center gap-2">
                    <Input
                      className="w-32 flex-1"
                      value={item.label}
                      onChange={(e) => update(item.id, { label: e.target.value })}
                    />
                    <Input
                      className="w-32 flex-1"
                      value={item.href}
                      onChange={(e) => update(item.id, { href: e.target.value })}
                    />
                    <Switch
                      checked={item.visible}
                      onCheckedChange={(v) => update(item.id, { visible: v })}
                      aria-label="Visible"
                    />
                    <Button size="icon" variant="ghost" onClick={() => move(list, i, -1)} aria-label="Move up">
                      <ArrowUp size={14} />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => move(list, i, 1)} aria-label="Move down">
                      <ArrowDown size={14} />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(item.id)} aria-label="Delete">
                      <Trash2 size={14} />
                    </Button>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
