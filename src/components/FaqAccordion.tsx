import { useState } from 'react';
import { ChevronDown, MessageSquare } from 'lucide-react';
import { GENERAL_FAQ } from '../data';

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-24 px-4 border-t border-[#262626] bg-[#0B0B0B]">
      <div className="max-w-4xl mx-auto font-sans">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#151515] border border-[#262626] text-[10px] font-mono tracking-wider text-[#22D3EE] mb-4">
            <MessageSquare className="w-3.5 h-3.5" /> QUESTIONS & ANSWERS
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Frequently Asked <em className="italic font-sans text-[#22D3EE] font-normal pr-1">Questions.</em>
          </h2>
          <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto">
            Everything you need to know about collecting, organizing, and embedding your testimonials.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-1.5 border-t border-[#262626]">
          {GENERAL_FAQ.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border-b border-[#262626] transition-colors duration-300"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full py-6 flex items-center justify-between text-left focus:outline-none group cursor-pointer"
                >
                  <span className="font-semibold text-sm sm:text-base text-white group-hover:text-[#22D3EE] transition-colors">
                    {item.question}
                  </span>
                  <div className={`p-1.5 rounded-full border transition-all duration-300 ${
                    isOpen 
                      ? 'rotate-180 bg-[#22D3EE] text-black border-[#22D3EE]' 
                      : 'text-neutral-400 bg-white/5 border-[#262626] group-hover:border-[#22D3EE]/30'
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
                    <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-3xl pl-1">
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
