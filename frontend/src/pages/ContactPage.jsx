import { Clock3, Mail, MapPin, PhoneCall } from "lucide-react";

function ContactPage() {
  return (
    <div className="section-shell py-14">
      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[36px] bg-hero-grid p-8 text-white shadow-soft sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-white/70">Contact us</p>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl">Talk to our appliance experts.</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-slate-200">
            Reach out for product comparisons, installation support, order tracking, warranty guidance, or large-order assistance.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex items-start gap-4 rounded-[24px] bg-white/10 p-4">
              <MapPin className="mt-1 text-gold" />
              <div>
                <p className="font-bold text-white">Store Address</p>
                <p className="text-sm text-slate-200">12, Anna Salai, Coimbatore, Tamil Nadu 641001</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-[24px] bg-white/10 p-4">
              <PhoneCall className="mt-1 text-gold" />
              <div>
                <p className="font-bold text-white">Phone</p>
                <p className="text-sm text-slate-200">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-[24px] bg-white/10 p-4">
              <Mail className="mt-1 text-gold" />
              <div>
                <p className="font-bold text-white">Email</p>
                <p className="text-sm text-slate-200">support@sripalaniandavan.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-[24px] bg-white/10 p-4">
              <Clock3 className="mt-1 text-gold" />
              <div>
                <p className="font-bold text-white">Business Hours</p>
                <p className="text-sm text-slate-200">Monday to Sunday, 9:30 AM to 9:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[36px] bg-white p-8 shadow-soft sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-coral">Need a recommendation?</p>
          <h2 className="mt-4 font-display text-3xl font-bold text-ink">Tell us what appliance you’re planning to buy.</h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            For now, the fastest way to get help inside the app is the built-in assistant at the bottom-right corner.
            You can also use the contact details here for sales and support follow-up.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] bg-slate-50 p-5">
              <p className="text-sm font-bold text-ink">Best for pre-sales</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Compare features, brand value, and appliance size before you order.
              </p>
            </div>
            <div className="rounded-[24px] bg-slate-50 p-5">
              <p className="text-sm font-bold text-ink">Best for post-order help</p>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Get help with delivery, installation, warranty claims, and returns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
