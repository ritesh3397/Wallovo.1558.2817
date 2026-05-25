import { useState } from 'react';
import { CheckCircle2, Sparkles, Terminal } from 'lucide-react';

interface PricingProps {
  onPlanSelect: (plan: string) => void;
}

export default function PricingPanel({ onPlanSelect }: PricingProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'starter',
      name: 'Starter Capsule',
      desc: 'Perfect for micro-agencies and single-product builders looking to establish instant proof.',
      price: billingPeriod === 'monthly' ? 29 : 23,
      popular: false,
      features: [
        '1 Embedded Grid Layout',
        'Up to 50 active testimonials',
        'Verify customer signatures',
        'Standard layout styles',
        'Email ticket support'
      ]
    },
    {
      id: 'pro',
      name: 'Pro Growth Suite',
      desc: 'The complete testimonial flywheel. Automatically capture, optimize, and distribute.',
      price: billingPeriod === 'monthly' ? 89 : 71,
      popular: true,
      features: [
        'Unlimited Glass Widgets',
        'Unlimited Testimonial storage',
        'Autonomous AI Polish Rewrite engine',
        'White-labeled DNA Subdomain maps',
        'Slack & Discord direct integrations',
        'Priority high-performance CDN access',
        '24/7 Premium technical SLA'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise Network',
      desc: 'Engineered for multi-brand organizations and high-ticket scaling ventures requiring Custom customizability.',
      price: billingPeriod === 'monthly' ? 349 : 279,
      popular: false,
      features: [
        'All Pro Capabilities included',
        'Dedicated account success architect',
        'Custom SSO security clearance',
        'Contractual 99.9% uptime guarantees',
        'API custom ingestion access',
        'White-globe custom styling setup'
      ]
    }
  ];

  return (
    <section className="relative py-28 px-4 border-t border-white/[0.02]">
      {/* Spotlight behind cards */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-pink-500/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-mono tracking-wider text-brand-glow mb-4">
            <Terminal className="w-3.5 h-3.5" /> THE EXCHANGE RATE OF TRUST
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Invest in compounding <em className="italic font-serif text-[#FFB6C9] font-normal">conversion authority.</em>
          </h2>
          <p className="font-sans text-brand-soft text-sm sm:text-base max-w-2xl mx-auto">
            Select a plan that fits your current startup velocity. Switch to annual billing to protect your growth capital.
          </p>

          {/* Billing Switcher Button capsule */}
          <div className="inline-flex bg-black/40 border border-white/5 rounded-full p-1 mt-8 relative">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 pointer-events-auto cursor-pointer ${
                billingPeriod === 'monthly' ? 'bg-white text-black' : 'text-brand-soft hover:text-white'
              }`}
            >
              Bill Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 pointer-events-auto cursor-pointer ${
                billingPeriod === 'yearly' ? 'bg-white text-black' : 'text-brand-soft hover:text-white'
              }`}
            >
              Bill Annually <span className="text-[9px] text-[#F472B6] font-mono ml-1">-20%</span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-[32px] p-8 flex flex-col justify-between transition-all duration-500 ${
                plan.popular
                  ? 'bg-[#121212] border border-pink-400/35 shadow-[0_0_40px_rgba(244,114,182,0.07)] md:scale-105 z-10'
                  : 'wallovo-glass border-white/5 hover:border-white/10'
              }`}
            >
              {/* Highlight bar inside center */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFB6C9]/40 to-transparent" />

              {/* Status Header Badge */}
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FFB6C9] to-pink-500 text-black text-[9px] font-mono font-bold tracking-widest px-3 py-1 rounded-full uppercase shadow">
                  MOST POPULAR
                </span>
              )}

              {/* Title & Desc */}
              <div className="text-left space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-display font-bold text-lg text-white">{plan.name}</h3>
                  {plan.popular && <Sparkles className="w-4 h-4 text-[#FFB6C9] animate-pulse" />}
                </div>
                <p className="text-xs text-white/50 leading-relaxed min-h-[48px]">
                  {plan.desc}
                </p>

                {/* Price module */}
                <div className="py-2 flex items-baseline gap-1 text-white">
                  <span className="text-4xl font-mono font-bold tracking-tighter">${plan.price}</span>
                  <span className="text-xs text-brand-soft/50">/ month</span>
                </div>

                <div className="w-full h-[1px] bg-white/5 my-4" />

                {/* Benefits */}
                <ul className="space-y-3 pt-2">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-brand-soft/80">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? 'text-[#FFB6C9]' : 'text-neutral-500'}`} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action trigger button */}
              <div className="mt-8">
                <button
                  onClick={() => onPlanSelect(plan.name)}
                  className={`w-full py-3.5 rounded-full font-bold text-xs transition-all duration-300 cursor-pointer ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#FFB6C9] to-pink-500 text-black hover:opacity-95 shadow-[0_4px_20px_rgba(255,182,201,0.2)]'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/5 hover:border-[#FFB6C9]/25'
                  }`}
                >
                  Choose {plan.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
