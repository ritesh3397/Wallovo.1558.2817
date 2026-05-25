import { useState } from 'react';
import { ChevronDown, ChevronUp, MessageSquare } from 'lucide-react';
import { GENERAL_FAQ } from '../data';

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-24 px-4 border-t border-white/[0.02]">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-mono tracking-wider text-brand-glow mb-4">
            <MessageSquare className="w-3.5 h-3.5" /> INQUIRIES & RESOLUTIONS
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Frequently Asked <em className="italic font-serif text-[#FFB6C9] font-normal">Details</em>
          </h2>
          <p className="font-sans text-brand-soft text-sm sm:text-base max-w-xl mx-auto">
            Deep technical specifics regarding network latency, markdown parsing, and data encryption.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-1.5 border-t border-white/5">
          {GENERAL_FAQ.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border-b border-white/5 transition-colors duration-300"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full py-6 flex items-center justify-between text-left focus:outline-none group cursor-pointer"
                >
                  <span className="font-display font-semibold text-sm sm:text-base text-white group-hover:text-[#FFB6C9] transition-colors">
                    {item.question}
                  </span>
                  <div className={`p-1.5 rounded-full bg-white/3 border border-white/5 group-hover:border-[#FFB6C9]/25 transition-all duration-300 ${
                    isOpen ? 'rotate-180 bg-[#FFB6C9] text-black border-[#FFB6C9]' : 'text-brand-soft/50'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Smooth transition container */}
                <div
                  className={`grid transition-all duration-300 ease-in-out overflow-hidden text-left ${
                    isOpen ? 'grid-rows-[1fr] opacity-100 pb-6' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="font-sans text-brand-soft/80 text-xs sm:text-sm leading-relaxed max-w-3xl pl-1 text-white/70">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
