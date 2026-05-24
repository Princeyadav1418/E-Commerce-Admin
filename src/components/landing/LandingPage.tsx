"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import {
  ArrowRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  Cloud,
  Lock,
  PackageSearch,
  Radar,
  ShoppingCart,
  Sparkles,
  Users,
  Workflow,
  Zap,
} from "lucide-react";

const features = [
  { icon: BarChart3, title: "Realtime Analytics", text: "Revenue, orders, customers, and product health in one control plane." },
  { icon: PackageSearch, title: "Product Management", text: "Create, edit, search, archive, and monitor catalog performance." },
  { icon: ShoppingCart, title: "Order Tracking", text: "Track fulfillment status and inspect customer orders quickly." },
  { icon: Users, title: "Customer Insights", text: "Understand buyer value, history, and engagement patterns." },
  { icon: Boxes, title: "Inventory Visibility", text: "Catch low stock and draft listings before they slow operations." },
  { icon: Lock, title: "Secure Cloud Auth", text: "Supabase-backed sessions, protected APIs, and scalable data access." },
];

const useCases = ["Ecommerce Brands", "Startup Founders", "Digital Stores", "Small Businesses", "Operations Teams", "Product Managers"];

export function LandingPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-reveal]", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
      });
      gsap.to("[data-float]", {
        y: -14,
        duration: 3.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.25,
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={rootRef} className="min-h-screen overflow-hidden bg-[#070A12] text-white">
      <section className="relative min-h-screen px-5 py-6 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(78,142,255,0.28),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(39,224,163,0.18),transparent_32%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_35%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40" />

        <nav data-reveal className="relative z-10 mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-wide">
            <span className="flex size-8 items-center justify-center rounded-xl bg-white text-black">
              <Sparkles className="size-4" />
            </span>
            StoreSync OS
          </Link>
          <div className="hidden items-center gap-6 text-sm text-white/68 md:flex">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#workflow" className="hover:text-white">Workflow</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="inline-flex h-9 items-center rounded-lg px-3 text-sm font-medium text-white/76 transition hover:bg-white/10 hover:text-white">
              Login
            </Link>
            <Link href="/signup" className="inline-flex h-9 items-center rounded-lg bg-white px-3 text-sm font-medium text-black transition hover:bg-white/90">
              Start free <ArrowRight className="ml-1 size-4" />
            </Link>
          </div>
        </nav>

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 py-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <div data-reveal className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-sm text-white/72">
              <Zap className="size-4 text-emerald-300" />
              Built for modern brands and growing online businesses
            </div>
            <h1 data-reveal className="max-w-4xl text-balance text-5xl font-semibold leading-[1.02] tracking-normal sm:text-6xl lg:text-7xl">
              The Modern Operating System for Ecommerce Businesses
            </h1>
            <p data-reveal className="mt-6 max-w-2xl text-lg leading-8 text-white/68">
              Manage inventory, track orders, monitor analytics, understand customers, and centralize store operations from one intelligent dashboard.
            </p>
            <div data-reveal className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/signup" className="inline-flex h-11 items-center justify-center rounded-lg bg-white px-5 text-sm font-medium text-black transition hover:bg-white/90">
                Launch your control center <ArrowRight className="ml-1 size-4" />
              </Link>
              <Link href="/login" className="inline-flex h-11 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] px-5 text-sm font-medium text-white transition hover:bg-white/10">
                Open dashboard
              </Link>
            </div>
          </div>

          <div data-reveal className="relative min-h-[520px] perspective-dramatic">
            <div data-float className="absolute right-0 top-2 w-full max-w-2xl rounded-[2rem] border border-white/12 bg-[#101522]/85 p-4 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl lg:rotate-[2deg]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/50">Realtime revenue</p>
                  <p className="text-3xl font-semibold">$128,420</p>
                </div>
                <div className="rounded-full bg-emerald-400/15 px-3 py-1 text-sm text-emerald-200">+18.4%</div>
              </div>
              <div className="grid grid-cols-12 items-end gap-2 rounded-2xl bg-white/[0.04] p-4">
                {[42, 56, 38, 72, 64, 88, 70, 96, 82, 110, 92, 124].map((height, index) => (
                  <div key={index} className="rounded-t-lg bg-gradient-to-t from-sky-400/30 to-emerald-300" style={{ height }} />
                ))}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {["Orders", "Inventory", "Customers"].map((label, index) => (
                  <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.05] p-3">
                    <p className="text-xs text-white/48">{label}</p>
                    <p className="mt-1 text-xl font-semibold">{[1248, 342, 890][index]}</p>
                  </div>
                ))}
              </div>
            </div>
            <div data-float className="absolute bottom-10 left-0 max-w-xs rounded-3xl border border-white/12 bg-white/[0.08] p-4 shadow-2xl shadow-black/30 backdrop-blur-2xl">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-300/15 text-emerald-200">
                  <Workflow className="size-5" />
                </div>
                <div>
                  <p className="font-medium">Automated workflow</p>
                  <p className="text-sm text-white/55">Low stock alert routed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-emerald-200">Why it exists</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-normal sm:text-5xl">Scattered tools slow down serious commerce teams.</h2>
            </div>
            <div className="grid gap-4 text-white/68 sm:grid-cols-2">
              {["Outdated admin systems", "Weak inventory visibility", "Poor analytics", "Fragmented workflows"].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-xl">
                  <CheckCircle2 className="mb-4 size-5 text-emerald-200" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-sky-200">Platform</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-normal">Everything your store needs to move faster.</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="group rounded-2xl border border-white/10 bg-white/[0.045] p-6 shadow-2xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07]">
                <feature.icon className="mb-6 size-7 text-emerald-200" />
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/60">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          {["Ingest orders", "Monitor operations", "Act instantly"].map((step, index) => (
            <div key={step} className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.025] p-6">
              <p className="text-sm text-white/45">0{index + 1}</p>
              <h3 className="mt-6 text-2xl font-semibold">{step}</h3>
              <p className="mt-3 text-white/60">A focused workflow layer for teams that need clear signals, fast decisions, and fewer scattered tabs.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-4xl font-semibold tracking-normal">Built for the people running the business.</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {useCases.map((useCase) => (
              <div key={useCase} className="rounded-2xl border border-white/10 bg-white/[0.045] p-5 transition hover:-translate-y-1 hover:bg-white/[0.07]">
                <Radar className="mb-4 size-5 text-sky-200" />
                <p className="font-medium">{useCase}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-3">
          {["Starter", "Growth", "Scale"].map((tier, index) => (
            <div key={tier} className="rounded-3xl border border-white/10 bg-white/[0.055] p-6">
              <p className="text-sm text-white/50">{tier}</p>
              <p className="mt-4 text-4xl font-semibold">{index === 0 ? "$0" : index === 1 ? "$29" : "$79"}</p>
              <p className="mt-2 text-sm text-white/55">Premium admin tooling for stores at every stage.</p>
              <Link href="/signup" className="mt-6 inline-flex h-9 w-full items-center justify-center rounded-lg bg-white px-3 text-sm font-medium text-black transition hover:bg-white/90">
                Choose {tier}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="px-5 pb-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-white/[0.06] p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-2xl sm:p-12">
          <Cloud className="mx-auto mb-5 size-8 text-emerald-200" />
          <h2 className="text-4xl font-semibold tracking-normal">Manage your entire store from one intelligent dashboard.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/62">Launch a modern operating layer for products, orders, customers, analytics, and team decisions.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/signup" className="inline-flex h-9 items-center justify-center rounded-lg bg-white px-3 text-sm font-medium text-black transition hover:bg-white/90">
              Create account
            </Link>
            <Link href="/login" className="inline-flex h-9 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] px-3 text-sm font-medium text-white transition hover:bg-white/10">
              Login
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
