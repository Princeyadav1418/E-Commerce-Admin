"use client";

import { motion } from "framer-motion";
import { BarChart3, PackageOpen, ShieldCheck, Sparkles, Zap } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative grid min-h-screen overflow-hidden bg-[#070A12] text-white lg:grid-cols-[1.05fr_0.95fr]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(68,127,255,0.24),transparent_34%),radial-gradient(circle_at_88%_18%,rgba(35,222,160,0.16),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_38%)]" />
      <section className="relative hidden min-h-screen flex-col justify-between p-10 lg:flex">
        <div className="flex items-center gap-2">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-white text-black">
            <PackageOpen className="size-5" />
          </div>
          <span className="text-lg font-semibold">StoreSync OS</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-sm text-white/70">
            <Sparkles className="size-4 text-emerald-200" />
            Premium ecommerce control center
          </div>
          <h1 className="text-5xl font-semibold leading-tight tracking-normal">
            Run products, orders, customers, and analytics from one polished command layer.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/60">
            A cinematic admin workspace for teams that need faster decisions, cleaner workflows, and sharper operational visibility.
          </p>
        </motion.div>

        <div className="grid max-w-2xl grid-cols-3 gap-3">
          {[
            { icon: BarChart3, label: "Live analytics" },
            { icon: ShieldCheck, label: "Secure sessions" },
            { icon: Zap, label: "Fast actions" },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-xl">
              <item.icon className="mb-4 size-5 text-emerald-200" />
              <p className="text-sm text-white/72">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative flex min-h-screen items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-white text-black">
              <PackageOpen className="size-5" />
            </div>
            <span className="text-lg font-semibold">StoreSync OS</span>
          </div>
          {children}
        </div>
      </section>
    </div>
  );
}
