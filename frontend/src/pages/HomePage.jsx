import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BadgePercent, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import ParticleBackground from "../components/ParticleBackground.jsx";
import { api } from "../lib/api";
import ProductCard from "../components/ProductCard.jsx";

const categories = [
  {
    title: "Refrigerators",
    description: "Cooling for every home.",
    to: "/products?category=Refrigerators"
  },
  {
    title: "Washing Machines",
    description: "Simple laundry upgrades.",
    to: "/products?category=Washing%20Machines"
  },
  {
    title: "Televisions",
    description: "Smart viewing made easy.",
    to: "/products?category=Televisions"
  },
  {
    title: "Kitchen Appliances",
    description: "Daily kitchen essentials.",
    to: "/products?category=Kitchen%20Appliances"
  }
];

const highlights = [
  {
    icon: BadgePercent,
    title: "Best offers",
    description: "Seasonal savings on trusted brands."
  },
  {
    icon: Truck,
    title: "Fast delivery",
    description: "Doorstep delivery and install support."
  },
  {
    icon: ShieldCheck,
    title: "Warranty support",
    description: "Clear coverage and after-sales help."
  }
];

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    api
      .get("/products?featured=true")
      .then((response) => {
        setFeaturedProducts(response.data.products.slice(0, 4));
      })
      .catch(() => {
        setFeaturedProducts([]);
      });
  }, []);

  return (
    <div className="relative overflow-hidden pb-20">
      <ParticleBackground />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(247,96,59,0.18),transparent_34%),radial-gradient(circle_at_80%_12%,rgba(15,23,42,0.16),transparent_32%),radial-gradient(circle_at_50%_80%,rgba(251,191,36,0.14),transparent_30%)]"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <section className="section-shell pt-8">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[32px] border border-white/70 bg-white/90 px-8 py-10 shadow-soft backdrop-blur sm:px-10 sm:py-12"
            >
              <div className="max-w-2xl space-y-6">

                <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                  Trusted home appliances
                </span>
                <div className="space-y-4">
                  <h1 className="max-w-2xl font-display text-4xl font-bold leading-tight text-ink sm:text-5xl">
                    Home appliances made simple.
                  </h1>
                  <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                    Shop refrigerators, washing machines, TVs, and kitchen essentials with quick delivery and
                    warranty support.
                  </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link
                    to="/products"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-sm font-bold text-white transition hover:bg-coral"
                  >
                    Shop appliances
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-4 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    Contact store
                  </Link>
                </div>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {highlights.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div key={item.title} className="rounded-[24px] bg-slate-50/90 p-5 backdrop-blur">
                      <Icon className="text-coral" size={20} />
                      <p className="mt-3 font-display text-xl font-bold text-ink">{item.title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-[32px] bg-ink p-7 text-white shadow-soft"
            >
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/60">Why shop here</p>
              <h2 className="mt-4 font-display text-3xl font-bold">Less searching, better picks.</h2>
              <div className="mt-6 space-y-4">
                {[
                  "Easy category browsing",
                  "Clear pricing and stock updates",
                  "Quick support when you need it"
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-[22px] bg-white/10 px-4 py-3">
                    <span className="h-2.5 w-2.5 rounded-full bg-gold" />
                    <p className="text-sm font-medium text-white/85">{item}</p>
                  </div>
                ))}
              </div>
              <Link
                to="/products?sort=popularity"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-ink"
              >
                Browse bestsellers
                <ArrowRight size={16} />
              </Link>
            </motion.aside>
          </div>
        </section>

        <section className="section-shell mt-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-coral">Categories</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-ink">Shop by category</h2>
            </div>
            <Link to="/products" className="hidden text-sm font-bold text-coral md:inline-flex">
              See full catalog
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="rounded-[26px] border border-white/70 bg-white/90 p-6 shadow-soft backdrop-blur"
              >
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Category</p>
                <h3 className="mt-3 font-display text-2xl font-bold text-ink">{category.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{category.description}</p>
                <Link to={category.to} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-ink">
                  View products
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="section-shell mt-16">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-coral">Featured products</p>
              <h2 className="mt-3 font-display text-3xl font-bold text-ink">Top picks for your home</h2>
            </div>
            <Link to="/products?sort=popularity" className="hidden text-sm font-bold text-coral md:inline-flex">
              Browse trending
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {featuredProducts.length ? (
              featuredProducts.map((product) => <ProductCard key={product._id} product={product} compact />)
            ) : (
              <div className="rounded-[28px] bg-white p-8 text-sm font-medium text-slate-500 shadow-soft md:col-span-2 xl:col-span-4">
                Featured appliances will appear here soon.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
