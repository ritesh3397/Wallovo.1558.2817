import { useState } from 'react';
import { CheckCircle2, Sparkles, Terminal, X } from 'lucide-react';

interface PricingProps {
  onPlanSelect: (plan: string) => void;
}

export default function PricingPanel({ onPlanSelect }: PricingProps) {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'starter',
      name: 'Free',
      desc: 'Perfect for side projects looking to get started.',
      price: '₹0',
      periodText: '',
      popular: false,
      features: [
        { text: '10 Testimonials', disabled: false },
        { text: '1 Collection Page', disabled: false },
        { text: 'No Branding Removal', disabled: true },
        { text: 'Analytics', disabled: true }
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      desc: 'Scale your social proof metrics automatically.',
      price: billingPeriod === 'monthly' ? '₹299' : '₹239',
      periodText: '/mo',
      popular: true,
      features: [
        { text: 'Unlimited Testimonials', disabled: false },
        { text: 'Approval Dashboard', disabled: false },
        { text: 'No Branding', disabled: false },
        { text: 'Analytics Dashboard', disabled: false }
      ]
    },
    {
      id: 'enterprise',
      name: 'Business',
      desc: 'For teams and multi-brand agencies.',
      price: billingPeriod === 'monthly' ? '₹999' : '₹799',
      periodText: '/mo',
      popular: false,
      features: [
        { text: 'Multiple Projects', disabled: false },
        { text: 'Team Access', disabled: false },
        { text: 'API Access', disabled: false },
        { text: 'Dedicated Support', disabled: false }
      ]
    }
  ];

  return (
    <section className="relative py-28 px-4 border-t border-[#262626] bg-[#0B0B0B]">
      {/* Spotlight behind cards */}
      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#22D3EE]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto font-sans">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151515] border border-[#262626] text-[10px] font-mono tracking-wider text-[#22D3EE] mb-4">
            <Terminal className="w-3.5 h-3.5" /> FLEXIBLE PRICING OPTIONS
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Invest in verified <em className="italic font-sans text-[#22D3EE] font-normal pr-1">customer trust.</em>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto">
            Select a plan that fits your business velocity. Switch to annual billing to save 20% on your subscription.
          </p>

          {/* Billing Switcher Button capsule */}
          <div className="inline-flex bg-[#151515] border border-[#262626] rounded-full p-1 mt-8 relative">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 pointer-events-auto cursor-pointer ${
                billingPeriod === 'monthly' ? 'bg-white text-black font-bold' : 'text-[#A3A3A3] hover:text-white'
              }`}
            >
              Bill Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 pointer-events-auto cursor-pointer ${
                billingPeriod === 'yearly' ? 'bg-white text-black font-bold' : 'text-[#A3A3A3] hover:text-white'
              }`}
            >
              Bill Annually <span className="text-[9px] text-[#22D3EE] font-mono ml-1 font-bold">-20%</span>
            </button>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-[32px] p-8 flex flex-col justify-between transition-all duration-500 bg-[#151515] ${
                plan.popular
                  ? 'border border-[#22D3EE]/40 shadow-[0_0_40px_rgba(34,211,238,0.07)] md:scale-105 z-10'
                  : 'border border-[#262626] hover:border-[#22D3EE]/20'
              }`}
            >
              {/* Highlight bar inside center */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#22D3EE]/20 to-transparent" />

              {/* Status Header Badge */}
              {plan.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#22D3EE] text-black text-[9px] font-mono font-bold tracking-widest px-3 py-1 rounded-full uppercase shadow">
                  MOST POPULAR
                </span>
              )}

              {/* Title & Desc */}
              <div className="text-left space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="font-display font-semibold text-lg text-white">{plan.name}</h3>
                  {plan.popular && <Sparkles className="w-4 h-4 text-[#22D3EE]" />}
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed min-h-[48px]">
                  {plan.desc}
                </p>

                {/* Price module */}
                <div className="py-2 flex items-baseline gap-1 text-white">
                  <span className="text-4xl font-sans font-bold tracking-tighter">{plan.price}</span>
                  {plan.periodText && <span className="text-xs text-neutral-500">{plan.periodText}</span>}
                </div>

                <div className="w-full h-[1px] bg-white/5 my-4" />

                {/* Benefits */}
                <ul className="space-y-3 pt-2">
                  {plan.features.map((feat, i) => (
                    <li key={i} className={`flex items-start gap-2.5 text-xs ${feat.disabled ? 'text-neutral-600 line-through' : 'text-neutral-300'}`}>
                      {feat.disabled ? (
                        <X className="w-4 h-4 shrink-0 mt-0.5 text-neutral-600" />
                      ) : (
                        <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${plan.popular ? 'text-[#22D3EE]' : 'text-neutral-500'}`} />
                      )}
                      <span>{feat.text}</span>
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
                      ? 'bg-[#22D3EE] text-black hover:opacity-90 shadow-[0_4px_20px_rgba(34,211,238,0.2)]'
                      : 'bg-black/20 hover:bg-black/40 text-white border border-[#262626] hover:border-[#22D3EE]/25'
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
