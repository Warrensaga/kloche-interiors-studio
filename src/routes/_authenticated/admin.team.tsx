import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminHeading } from "@/components/admin/fields";

export const Route = createFileRoute("/_authenticated/admin/team")({
  component: AdminTeam,
});

function AdminTeam() {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "editor">("editor");

  const { data } = useQuery({
    queryKey: ["admin", "invites"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_invites")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin", "invites"] });

  async function invite() {
    if (!email.includes("@")) return toast.error("Enter a valid email address");
    const { error } = await supabase
      .from("admin_invites")
      .insert({ email: email.trim().toLowerCase(), role });
    if (error) return toast.error(error.message);
    setEmail("");
    toast.success("Invitation added — share the sign-in link with them");
    refresh();
  }

  return (
    <>
      <AdminHeading
        eyebrow="Dashboard"
        title="Team access"
        description="Public sign-up is closed. Add an email here, then send the person the /auth link so they can set a password."
      />

      <div className="mt-8 flex flex-wrap items-end gap-3 rounded-3xl border border-border bg-card p-6">
        <Input
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="max-w-xs"
        />
        <Select value={role} onValueChange={(v) => setRole(v as "admin" | "editor")}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={invite}>
          <Plus size={16} /> Invite
        </Button>
      </div>

      <ul className="mt-6 space-y-3">
        {(data ?? []).map((i) => (
          <li
            key={i.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4"
          >
            <div>
              <p className="text-sm">{i.email}</p>
              <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {i.role} · {i.accepted ? "active" : "pending"}
              </p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Remove"
              onClick={async () => {
                await supabase.from("admin_invites").delete().eq("id", i.id);
                refresh();
              }}
            >
              <Trash2 size={14} />
            </Button>
          </li>
        ))}
        {!data?.length && <p className="text-sm text-muted-foreground">No invitations yet.</p>}
      </ul>
    </>
  );
}
