import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AdminHeading, AreaField, TextField } from "@/components/admin/fields";
import { MediaPicker } from "@/components/admin/MediaPicker";
import type { Hour, Socials } from "@/lib/cms";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const { data } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const [form, setForm] = useState<Record<string, string>>({});
  const [hours, setHours] = useState<Hour[]>([]);
  const [socials, setSocials] = useState<Socials>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data) return;
    setForm({
      business_name: data.business_name,
      tagline: data.tagline,
      email: data.email,
      phone_display: data.phone_display,
      phone_link: data.phone_link,
      whatsapp: data.whatsapp,
      address: data.address,
      maps_url: data.maps_url,
      logo_url: data.logo_url,
      favicon_url: data.favicon_url,
      footer_blurb: data.footer_blurb,
      copyright: data.copyright,
      header_cta_label: data.header_cta_label,
    });
    setHours(Array.isArray(data.hours) ? (data.hours as unknown as Hour[]) : []);
    setSocials((data.socials ?? {}) as Socials);
  }, [data]);

  const set = (k: string) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    if (!data) return;
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({ ...form, hours: hours as never, socials: socials as never })
      .eq("id", data.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Settings saved");
  }

  return (
    <>
      <AdminHeading
        eyebrow="Dashboard"
        title="Site settings"
        description="Business details used across the header, footer, contact page and WhatsApp links."
        actions={
          <Button onClick={save} disabled={saving || !data}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="min-w-0 space-y-4 rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-xl">Business</h2>
          <TextField label="Business name" value={form["business_name"] ?? ""} onChange={set("business_name")} />
          <TextField label="Tagline" value={form["tagline"] ?? ""} onChange={set("tagline")} />
          <TextField label="Email" value={form["email"] ?? ""} onChange={set("email")} />
          <TextField
            label="Primary phone (shown)"
            value={form["phone_display"] ?? ""}
            onChange={set("phone_display")}
          />
          <TextField
            label="Primary phone (dial link)"
            value={form["phone_link"] ?? ""}
            onChange={set("phone_link")}
            hint="International format, e.g. +254717634003"
          />
          <TextField
            label="WhatsApp number"
            value={form["whatsapp"] ?? ""}
            onChange={set("whatsapp")}
            hint="Digits only, e.g. 254787068222"
          />
          <TextField label="Address" value={form["address"] ?? ""} onChange={set("address")} />
          <TextField label="Google Maps link" value={form["maps_url"] ?? ""} onChange={set("maps_url")} />
        </section>

        <section className="min-w-0 space-y-4 rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-xl">Branding & footer</h2>
          <MediaPicker label="Logo" value={form["logo_url"] ?? ""} onChange={set("logo_url")} />
          <MediaPicker label="Favicon" value={form["favicon_url"] ?? ""} onChange={set("favicon_url")} />
          <TextField
            label="Header button label"
            value={form["header_cta_label"] ?? ""}
            onChange={set("header_cta_label")}
          />
          <AreaField label="Footer blurb" value={form["footer_blurb"] ?? ""} onChange={set("footer_blurb")} />
          <TextField label="Copyright line" value={form["copyright"] ?? ""} onChange={set("copyright")} />
        </section>

        <section className="min-w-0 space-y-4 rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-xl">Opening hours</h2>
          {hours.map((h, i) => (
            <div key={i} className="flex gap-2">
              <input
                className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm"
                value={h.day}
                onChange={(e) =>
                  setHours((prev) => prev.map((x, j) => (i === j ? { ...x, day: e.target.value } : x)))
                }
              />
              <input
                className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm"
                value={h.time}
                onChange={(e) =>
                  setHours((prev) => prev.map((x, j) => (i === j ? { ...x, time: e.target.value } : x)))
                }
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHours((prev) => prev.filter((_, j) => j !== i))}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => setHours((p) => [...p, { day: "", time: "" }])}>
            Add row
          </Button>
        </section>

        <section className="min-w-0 space-y-4 rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-xl">Social links</h2>
          {(["instagram", "tiktok", "facebook", "linkedin"] as const).map((k) => (
            <TextField
              key={k}
              label={k}
              value={socials[k] ?? ""}
              onChange={(v) => setSocials((s) => ({ ...s, [k]: v }))}
            />
          ))}
        </section>
      </div>
    </>
  );
}
