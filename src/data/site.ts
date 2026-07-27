export const STUDIO = {
  name: "Kloche Interiors",
  tagline: "Interiors that feel like home",
  phoneDisplay: "+254 712 480 335",
  whatsapp: "254712480335",
  email: "hello@klocheinteriors.co.ke",
  address: "Riverside Drive, Westlands, Nairobi, Kenya",
  hours: [
    { day: "Monday – Friday", time: "9:00 – 18:00" },
    { day: "Saturday", time: "10:00 – 15:00" },
    { day: "Sunday & Public Holidays", time: "By appointment" },
  ],
  instagram: "https://instagram.com",
};

export const whatsappLink = (
  message = "Hello Kloche Interiors, I'd like to book a consultation.",
) => `https://wa.me/${STUDIO.whatsapp}?text=${encodeURIComponent(message)}`;

const u = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMAGES = {
  hero: u("1618221195710-dd6b41faaea6", 2000),
  aboutFounder: u("1573496359142-b8d87734a5a2", 1000),
  studio1: u("1600585154340-be6161a56a0c"),
  studio2: u("1524758631624-e2822e304c36"),
  studio3: u("1567016432779-094069958ea5"),
  studio4: u("1615529182904-14819c35db37"),
};

export type Category = "Residential" | "Commercial" | "Kitchens" | "Living Spaces";

export interface Project {
  id: string;
  name: string;
  location: string;
  style: string;
  categories: Category[];
  cover: string;
  gallery: string[];
  description: string;
  scope: string[];
  duration: string;
  year: string;
  beforeAfter?: { before: string; after: string };
}

export const PROJECTS: Project[] = [
  {
    id: "karen-villa",
    name: "Karen Garden Villa",
    location: "Karen, Nairobi",
    style: "Warm Contemporary",
    categories: ["Residential", "Living Spaces"],
    cover: u("1600607687939-ce8a6c25118c"),
    gallery: [
      u("1600607687939-ce8a6c25118c"),
      u("1600566753086-00f18fb6b3ea"),
      u("1615873968403-89e068629265"),
      u("1616594039964-ae9021a400a0"),
    ],
    description:
      "A five-bedroom family home reimagined around light, texture and slow living. We opened up the ground floor, layered raw plaster with olive-toned joinery and commissioned local artisans for the woven lighting throughout.",
    scope: [
      "Full home interior design",
      "Structural reconfiguration of ground floor",
      "Custom joinery & cabinetry",
      "Furniture sourcing & styling",
      "Art curation with Nairobi makers",
    ],
    duration: "7 months",
    year: "2024",
    beforeAfter: {
      before: u("1503174971373-b1f69850bded"),
      after: u("1600607687939-ce8a6c25118c"),
    },
  },
  {
    id: "westlands-penthouse",
    name: "Westlands Penthouse",
    location: "Westlands, Nairobi",
    style: "Quiet Luxury",
    categories: ["Residential", "Living Spaces"],
    cover: u("1600210492486-724fe5c67fb0"),
    gallery: [
      u("1600210492486-724fe5c67fb0"),
      u("1618221195710-dd6b41faaea6"),
      u("1560448204-e02f11c3d0e2"),
      u("1616486338812-3dadae4b4ace"),
    ],
    description:
      "A skyline apartment for a returning-diaspora couple. Muted travertine, bouclé and brushed brass create a calm envelope, while a sunken lounge frames the Ngong Hills view.",
    scope: [
      "Space planning & lighting design",
      "Bespoke sunken lounge seating",
      "Imported & locally made furniture mix",
      "Window treatments & soft furnishings",
    ],
    duration: "5 months",
    year: "2025",
  },
  {
    id: "kilimani-kitchen",
    name: "Kilimani Kitchen Renewal",
    location: "Kilimani, Nairobi",
    style: "Earthy Minimal",
    categories: ["Kitchens", "Residential"],
    cover: u("1556909212-d5b604d0c90d"),
    gallery: [
      u("1556909212-d5b604d0c90d"),
      u("1556911220-bff31c812dba"),
      u("1600489000022-c2086d79f9d4"),
      u("1565538810643-b5bdb714032a"),
    ],
    description:
      "A compact galley kitchen rebuilt as the social heart of the apartment. Fluted oak fronts, honed granite from Machakos and an island that doubles as a breakfast bar.",
    scope: [
      "Kitchen space planning",
      "Custom cabinetry in fluted oak",
      "Local stone worktop sourcing",
      "Appliance specification & install oversight",
    ],
    duration: "11 weeks",
    year: "2025",
  },
  {
    id: "gigiri-offices",
    name: "Gigiri Studio Offices",
    location: "Gigiri, Nairobi",
    style: "Soft Modern Workplace",
    categories: ["Commercial"],
    cover: u("1497366754035-f200968a6e72"),
    gallery: [
      u("1497366754035-f200968a6e72"),
      u("1524758631624-e2822e304c36"),
      u("1568992687947-868a62a9f521"),
      u("1503387762-592deb58ef4e"),
    ],
    description:
      "A 640 sqm workplace for a creative agency, designed to feel more like a members' club than an office — acoustic felt ceilings, a library nook and a terrace for Friday reviews.",
    scope: [
      "Workplace strategy & zoning",
      "Acoustic and lighting design",
      "Bespoke workstation joinery",
      "Contract furniture procurement",
    ],
    duration: "9 months",
    year: "2024",
  },
  {
    id: "lavington-living",
    name: "Lavington Living Room",
    location: "Lavington, Nairobi",
    style: "Layered Neutrals",
    categories: ["Living Spaces", "Residential"],
    cover: u("1567767292278-a4f21aa2d36e"),
    gallery: [
      u("1567767292278-a4f21aa2d36e"),
      u("1616137466211-f939a420be84"),
      u("1493663284031-b7e3aefcae8e"),
      u("1583847268964-b28dc8f51f92"),
    ],
    description:
      "A single-room refresh proving you don't need a full renovation to change how a home feels. New layout, one bold sofa, and Kenyan textiles doing the heavy lifting.",
    scope: [
      "Room layout & flow",
      "Furniture sourcing",
      "Textile and art styling",
      "Two-day install",
    ],
    duration: "6 weeks",
    year: "2025",
  },
  {
    id: "runda-family-home",
    name: "Runda Family Home",
    location: "Runda, Nairobi",
    style: "Classic Warm",
    categories: ["Residential"],
    cover: u("1600585154526-990dced4db0d"),
    gallery: [
      u("1600585154526-990dced4db0d"),
      u("1600121848594-d8644e57abab"),
      u("1616627561950-9f746e330187"),
      u("1617103996702-96ff29b1c467"),
    ],
    description:
      "A generous family house balancing formality for hosting with genuinely liveable, child-proof materials. Deep green cabinetry anchors the shared spaces.",
    scope: [
      "Full home design",
      "Renovation consulting",
      "Custom cabinetry & wardrobes",
      "Outdoor terrace styling",
    ],
    duration: "8 months",
    year: "2023",
  },
];

export const CATEGORIES: Category[] = [
  "Residential",
  "Commercial",
  "Kitchens",
  "Living Spaces",
];

export interface Service {
  id: string;
  icon: string;
  title: string;
  short: string;
  description: string;
  includes: string[];
  image: string;
}

export const SERVICES: Service[] = [
  {
    id: "full-home-design",
    icon: "Home",
    title: "Full Home Design",
    short: "End-to-end design for new builds and whole-home transformations.",
    description:
      "From empty shell to fully styled home. We take responsibility for the entire interior — layout, materials, joinery, lighting, furniture and the final styling — so you make decisions once and live with them for years.",
    includes: [
      "Site survey and detailed brief",
      "Concept direction and mood boards",
      "Full 3D visuals of every key room",
      "Material, finish and lighting schedules",
      "Contractor coordination and site visits",
      "Final install, styling and handover",
    ],
    image: u("1616594039964-ae9021a400a0", 1200),
  },
  {
    id: "space-planning",
    icon: "Ruler",
    title: "Space Planning",
    short: "Layouts that fix how a home actually works day to day.",
    description:
      "Most homes don't need more square metres — they need better ones. We re-plan circulation, storage and sightlines, then hand you drawings your contractor can build from.",
    includes: [
      "Measured survey and existing plan",
      "Two to three layout options",
      "Furniture and storage planning",
      "Lighting and socket positions",
      "Technical drawing pack",
    ],
    image: u("1503174971373-b1f69850bded", 1200),
  },
  {
    id: "furniture-sourcing",
    icon: "Armchair",
    title: "Furniture Sourcing & Styling",
    short: "A curated mix of Kenyan makers and imported pieces.",
    description:
      "We work with a trusted network of Nairobi workshops, weavers and stone yards, complemented by selected imports — then handle procurement, delivery and the styling day.",
    includes: [
      "Furniture and lighting schedule",
      "Custom pieces with local artisans",
      "Procurement and delivery management",
      "Textiles, rugs and window treatments",
      "Art curation and full styling day",
    ],
    image: u("1493663284031-b7e3aefcae8e", 1200),
  },
  {
    id: "renovation-consulting",
    icon: "HardHat",
    title: "Renovation Consulting",
    short: "Design guidance and site oversight through the messy part.",
    description:
      "For clients already renovating who need a designer's eye on the decisions that are expensive to reverse — structure, finishes, joinery detailing and budget sequencing.",
    includes: [
      "Feasibility and budget review",
      "Finish and material specification",
      "Joinery detailing and shop drawings",
      "Fortnightly site inspections",
      "Snagging and close-out report",
    ],
    image: u("1581858726788-75bc0f6a952d", 1200),
  },
];

export const PROCESS = [
  {
    step: "01",
    title: "Consultation",
    body: "A two-hour visit to your space. We listen to how you live, take measurements and agree on budget and scope before anything is drawn.",
  },
  {
    step: "02",
    title: "Concept & Mood Board",
    body: "Layouts, material palettes and 3D visuals. You see and approve the whole direction before a single order is placed.",
  },
  {
    step: "03",
    title: "Sourcing & Execution",
    body: "We procure, commission and coordinate — managing artisans, contractors and deliveries with weekly updates from site.",
  },
  {
    step: "04",
    title: "The Reveal",
    body: "Install, style and hand over. You walk into a finished home, complete with a care guide for every material we used.",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "Kloche understood our home better than we did. Six months on, we still notice small details they got exactly right.",
    name: "Wanjiru & Kevin M.",
    detail: "Karen Garden Villa",
  },
  {
    quote:
      "They managed contractors, budget and our indecision with complete calm. The reveal genuinely made my mother cry.",
    name: "Aisha O.",
    detail: "Westlands Penthouse",
  },
  {
    quote:
      "Our office finally feels like the studio we tell clients we are. Staff arrive earlier — that's the review.",
    name: "Daniel Kimani",
    detail: "Founder, Gigiri Studio Offices",
  },
];

export const TIERS = [
  {
    name: "Essential",
    price: "From KES 180,000",
    unit: "per room",
    blurb: "For one space that needs direction — a living room, bedroom or kitchen refresh.",
    features: [
      "Single-room scope",
      "Layout and mood board",
      "Shopping list with sourcing links",
      "One revision round",
      "Two-week turnaround",
    ],
    highlighted: false,
  },
  {
    name: "Signature",
    price: "From KES 950,000",
    unit: "per project",
    blurb: "Our most-chosen package: multi-room design with sourcing and install handled for you.",
    features: [
      "Up to five rooms",
      "3D visuals of every key room",
      "Full material & lighting schedule",
      "Procurement and delivery management",
      "Styling and install day",
      "Two revision rounds",
    ],
    highlighted: true,
  },
  {
    name: "Bespoke",
    price: "From KES 2.8M",
    unit: "per project",
    blurb: "Whole-home or commercial projects with custom joinery and full site oversight.",
    features: [
      "Unlimited rooms or commercial floors",
      "Custom joinery and millwork",
      "Contractor coordination and site visits",
      "Art and artisan commissions",
      "Unlimited revisions within scope",
      "12-month aftercare",
    ],
    highlighted: false,
  },
];

export const COMPARISON: { label: string; values: [string, string, string] }[] = [
  { label: "Rooms covered", values: ["1", "Up to 5", "Unlimited"] },
  { label: "Consultation visit", values: ["Virtual", "On-site", "On-site"] },
  { label: "Mood board & palette", values: ["Yes", "Yes", "Yes"] },
  { label: "3D visuals", values: ["—", "Key rooms", "All rooms"] },
  { label: "Technical drawing pack", values: ["—", "Yes", "Yes"] },
  { label: "Custom joinery design", values: ["—", "Limited", "Full"] },
  { label: "Procurement handled", values: ["—", "Yes", "Yes"] },
  { label: "Site supervision", values: ["—", "Milestone visits", "Fortnightly"] },
  { label: "Styling & install day", values: ["—", "Yes", "Yes"] },
  { label: "Aftercare", values: ["30 days", "6 months", "12 months"] },
];

export const FAQS = [
  {
    q: "How are payments structured?",
    a: "A 50% design fee secures your slot in the studio calendar, 30% falls due at concept approval and the remaining 20% at handover. Furniture and construction costs are quoted and settled separately, always at supplier cost with our margin shown transparently.",
  },
  {
    q: "How long does a typical project take?",
    a: "A single-room Essential project runs two to four weeks. Signature projects average four to six months, and Bespoke whole-home work typically runs seven to nine months depending on structural scope and lead times on imported pieces.",
  },
  {
    q: "What is not included in the packages?",
    a: "Construction and contractor labour, statutory approvals, structural engineering, appliances and the furniture itself are outside the design fee. We quote these separately so you can see exactly where your budget goes.",
  },
  {
    q: "Do you work outside Nairobi?",
    a: "Yes. We regularly work in Naivasha, Nanyuki, Diani and Kisumu, and have completed projects for clients based abroad. Travel and accommodation are billed at cost for sites beyond 60km from the studio.",
  },
  {
    q: "Can you work with my existing furniture?",
    a: "Almost always. Part of our first visit is identifying which pieces are worth keeping, reupholstering or rehoming — it is usually the fastest way to protect your budget.",
  },
  {
    q: "What if I only need advice?",
    a: "Book a paid two-hour consultation. You get a written direction summary and a shopping list, and the fee is credited if you go on to book a full package within 90 days.",
  },
];

export const TEAM = [
  {
    name: "Cheryl Kloche",
    role: "Founder & Principal Designer",
    photo: u("1573496359142-b8d87734a5a2", 800),
  },
  {
    name: "Brian Otieno",
    role: "Project & Site Manager",
    photo: u("1507003211169-0a1dd7228f2d", 800),
  },
  {
    name: "Nadia Hassan",
    role: "Sourcing & Styling Lead",
    photo: u("1580489944761-15a19d654956", 800),
  },
  {
    name: "Tim Mwangi",
    role: "Technical Designer",
    photo: u("1500648767791-00dcc994a43e", 800),
  },
];

export const STATS = [
  { value: "60+", label: "Projects delivered" },
  { value: "8", label: "Years in practice" },
  { value: "40+", label: "Kenyan artisans engaged" },
  { value: "Nairobi", label: "& beyond" },
];
