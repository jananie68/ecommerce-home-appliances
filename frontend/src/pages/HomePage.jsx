import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, BadgePercent, ShieldCheck, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import ProductCard from "../components/ProductCard.jsx";

const categories = [
  {
    title: "Refrigerators",
    description: "Premium cooling solutions for every family size.",
    accent: "from-cyan-200 to-cyan-50",
    to: "/products?category=Refrigerators"
  },
  {
    title: "Washing Machines",
    description: "Front-load and top-load picks with smart wash programs.",
    accent: "from-orange-200 to-orange-50",
    to: "/products?category=Washing%20Machines"
  },
  {
    title: "Televisions",
    description: "4K entertainment with immersive sound and streaming.",
    accent: "from-amber-200 to-amber-50",
    to: "/products?category=Televisions"
  },
  {
    title: "Kitchen Appliances",
    description: "Smarter everyday cooking, heating, and prep appliances.",
    accent: "from-emerald-200 to-emerald-50",
    to: "/products?category=Kitchen%20Appliances"
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
    <div className="pb-20">
      <section className="section-shell pt-8">
        <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-[36px] bg-hero-grid px-8 py-12 text-white shadow-[0_30px_80px_rgba(9,17,34,0.22)] sm:px-10 sm:py-14"
          >
            <div className="max-w-2xl space-y-6">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.28em] text-white/80">
                Modern home appliances, curated beautifully
              </span>
              <div className="space-y-4">
                <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl xl:text-6xl">
                  Upgrade every room with smarter appliances from Sri Palani Andavan Electronics.
                </h1>
                <p className="max-w-xl text-base leading-8 text-slate-200 sm:text-lg">
                  Explore refrigerators, washing machines, smart TVs, kitchen essentials, and energy-saving
                  upgrades with warranty-backed confidence.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-sm font-bold text-ink transition hover:bg-gold"
                >
                  Shop appliances
                  <ArrowRight size={16} />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Talk to our experts
                </Link>
              </div>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="glass-panel rounded-[24px] p-5 text-ink">
                <BadgePercent className="mb-3 text-coral" />
                <p className="font-display text-2xl font-bold">Up to 25% Off</p>
                <p className="mt-2 text-sm text-slate-600">Festival-ready deals on premium cooling and washing picks.</p>
              </div>
              <div className="glass-panel rounded-[24px] p-5 text-ink">
                <Truck className="mb-3 text-coral" />
                <p className="font-display text-2xl font-bold">Fast Delivery</p>
                <p className="mt-2 text-sm text-slate-600">Safe doorstep delivery and installation support across Tamil Nadu.</p>
              </div>
              <div className="glass-panel rounded-[24px] p-5 text-ink">
                <ShieldCheck className="mb-3 text-coral" />
                <p className="font-display text-2xl font-bold">Warranty Protected</p>
                <p className="mt-2 text-sm text-slate-600">Track warranty, specs, and order updates inside your dashboard.</p>
              </div>
            </div>
          </motion.div>

          <div className="grid gap-6">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-[32px] bg-white p-7 shadow-soft"
            >
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-coral">Why customers stay</p>
              <h2 className="mt-4 font-display text-3xl font-bold text-ink">A showroom-grade experience online.</h2>
              <ul className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
                <li>Personalized AI suggestions for budget, family size, and appliance usage.</li>
                <li>Secure JWT-based accounts, Razorpay checkout, and verified payment flow.</li>
                <li>Detailed specifications, honest warranty info, and stock visibility on every product.</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-[32px] bg-gradient-to-br from-coral to-[#ff8b55] p-7 text-white shadow-glow"
            >
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/70">Shop support</p>
              <h3 className="mt-4 font-display text-3xl font-bold">Need help choosing the right appliance?</h3>
              <p className="mt-4 text-sm leading-7 text-white/80">
                Use the built-in Groq assistant to compare warranty, features, and budget recommendations instantly.
              </p>
              <Link
                to="/products"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-coral"
              >
                Explore bestsellers
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="section-shell mt-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-coral">Popular categories</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-ink">Designed around the appliances people actually upgrade first.</h2>
          </div>
          <Link to="/products" className="hidden text-sm font-bold text-coral md:inline-flex">
            See full catalog
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className={`rounded-[30px] bg-gradient-to-br ${category.accent} p-6 shadow-soft`}
            >
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">Category</p>
              <h3 className="mt-3 font-display text-2xl font-bold text-ink">{category.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{category.description}</p>
              <Link to={category.to} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-ink">
                Shop now
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="section-shell mt-16">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-coral">Featured products</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-ink">Top-rated appliances ready for your shortlist.</h2>
          </div>
          <Link to="/products?sort=popularity" className="hidden text-sm font-bold text-coral md:inline-flex">
            Browse trending
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
