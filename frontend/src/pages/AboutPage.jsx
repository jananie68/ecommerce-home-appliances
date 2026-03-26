import { Award, Cpu, ShieldCheck, Store } from "lucide-react";

const highlights = [
  {
    icon: Store,
    title: "Trusted local shop roots",
    description: "Sri Palani Andavar Electronics brings the confidence of an in-store appliance expert to a digital shopping experience."
  },
  {
    icon: Cpu,
    title: "Modern product discovery",
    description: "Search, sort, compare specifications, and use our Groq assistant to find the right appliance faster."
  },
  {
    icon: ShieldCheck,
    title: "Warranty-first buying",
    description: "We surface warranty coverage, product specs, and order visibility clearly so buyers can make informed decisions."
  },
  {
    icon: Award,
    title: "Built for production",
    description: "Responsive UI, protected admin and user dashboards, secure JWT auth, and Razorpay-ready checkout are all baked in."
  }
];

function AboutPage() {
  return (
    <div className="section-shell py-14">
      <div className="rounded-[36px] bg-white p-8 shadow-soft sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-coral">About the shop</p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold text-ink sm:text-5xl">
          A modern electronics storefront inspired by the trust and clarity of the best retail showrooms.
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-slate-600">
          Sri Palani Andavar Electronics is designed for customers who want more than a product grid. It combines
          deep appliance information, secure checkout, responsive support, and a beautifully guided browsing
          experience across mobile and desktop.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {highlights.map((item) => (
          <div key={item.title} className="rounded-[28px] bg-white p-7 shadow-soft">
            <item.icon className="text-coral" />
            <h2 className="mt-4 font-display text-2xl font-bold text-ink">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AboutPage;
