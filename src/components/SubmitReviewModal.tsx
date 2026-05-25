import { useState, FormEvent } from 'react';
import { Star, Check, Sparkles, Shield, AlertTriangle } from 'lucide-react';
import { Testimonial } from '../types';

interface SubmitReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newTestimonial: Testimonial) => void;
}

export default function SubmitReviewModal({ isOpen, onClose, onSubmit }: SubmitReviewModalProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [source, setSource] = useState<'twitter' | 'linkedin' | 'custom' | 'video'>('linkedin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmitReview = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedNewItem: Testimonial = {
        id: `custom-live-${Date.now()}`,
        clientName: name,
        clientRole: role || 'Founder',
        clientCompany: company || 'Autonomous Startup',
        text: text,
        avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 900000)}?q=80&w=256&auto=format&fit=crop`,
        stars: rating,
        verified: true,
        source: source,
        videoUrl: source === 'video' ? 'https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-a-laptop-in-a-cafe-43111-large.mp4' : undefined,
        date: new Date().toISOString().slice(0, 10),
        category: 'Live User Submission',
        conversionLift: `+${Math.floor(15 + Math.random() * 25)}%`
      };

      onSubmit(generatedNewItem);
      setIsSubmitting(false);
      setSuccess(true);
      
      // Clear inputs
      setName('');
      setRole('');
      setCompany('');
      setRating(5);
      setText('');
      setSource('linkedin');

      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2500);

    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="wallovo-glass rounded-[32px] max-w-lg w-full border-[#FFB6C9]/25 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] animate-fade-in text-left">
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFB6C9] to-transparent" />

        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-300" />
            <h4 className="font-display font-extrabold text-white text-md">Submit Authentic Experience</h4>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white text-xs font-mono cursor-pointer"
          >
            [Dismiss]
          </button>
        </div>

        {success ? (
          <div className="p-12 text-center space-y-4 flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-14 h-14 bg-pink-500/20 border border-[#FFB6C9]/30 rounded-full flex items-center justify-center animate-bounce">
              <Check className="w-7 h-7 text-[#FFB6C9]" />
            </div>
            <h5 className="text-white font-display font-bold text-lg">Testimonial Mapped Successfully</h5>
            <p className="text-white/50 text-xs text-center max-w-sm font-sans leading-relaxed">
              Your feedback was injected instantly into the cloud state manager. Check the <span className="text-[#FFB6C9] font-mono">AI Dashboard Inbox</span> to moderate or polish it using the AI writer!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmitReview} className="p-6 overflow-y-auto space-y-4 flex-1">
            {/* Input Details Grid */}
            <div className="space-y-3.5">
              <div>
                <label className="text-[10px] font-mono text-white/50 block mb-1 uppercase">Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="E.g. Alexander Mercer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#050505] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-300 transition-all font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-[10px] font-mono text-white/50 block mb-1 uppercase">Design Role</label>
                  <input
                    type="text"
                    placeholder="E.g. VP Growth"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#050505] border border-white/5 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-[#FFB6C9]/40 transition-all font-sans"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono text-white/50 block mb-1 uppercase">Company Name</label>
                  <input
                    type="text"
                    placeholder="E.g. Linear"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-[#050505] border border-white/5 rounded-xl px-3.5 py-3 text-xs text-white focus:outline-none focus:border-[#FFB6C9]/40 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Source selections */}
              <div>
                <label className="text-[10px] font-mono text-white/50 block mb-1.5 uppercase">Submission Medium</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'linkedin', label: 'LinkedIn' },
                    { id: 'twitter', label: 'Twitter' },
                    { id: 'video', label: 'Video Proof' },
                    { id: 'custom', label: 'Inbound Form' }
                  ].map((src) => (
                    <button
                      key={src.id}
                      type="button"
                      onClick={() => setSource(src.id as any)}
                      className={`text-[10px] py-2 rounded-xl border text-center font-semibold transition-all cursor-pointer ${
                        source === src.id
                          ? 'bg-[#FFB6C9]/10 border-[#FFB6C9] text-white'
                          : 'bg-black/40 border-white/5 text-brand-soft/60 hover:border-white/10'
                      }`}
                    >
                      {src.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stars ranking picker */}
              <div>
                <label className="text-[10px] font-mono text-white/50 block mb-1 uppercase">Review Stars *</label>
                <div className="flex gap-2 bg-[#050505] border border-white/5 p-3 rounded-xl inline-flex w-auto justify-start">
                  {[1, 2, 3, 4, 5].map((st) => (
                    <button
                      type="button"
                      key={st}
                      onClick={() => setRating(st)}
                      className="focus:outline-none"
                    >
                      <Star 
                        className={`w-5 h-5 cursor-pointer ${
                          st <= rating 
                            ? 'fill-[#FFB6C9] stroke-[#FFB6C9]' 
                            : 'stroke-white/20 fill-transparent'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review detailed text message */}
              <div>
                <label className="text-[10px] font-mono text-white/50 block mb-1 uppercase">Testimonial Content *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Paste your casual, raw client remarks here. Messy phrasing is welcome as our AI engine parses it instantly!"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full bg-[#050505] border border-white/5 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-300 transition-all resize-none font-sans"
                />
              </div>
            </div>

            {/* SLA warning and disclaimer capsules */}
            <div className="bg-[#0D0D0D] border border-white/5 p-3.5 rounded-xl flex items-start gap-2.5 font-mono text-[10px] text-white/50">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>We employ secure proof-verification protocols and SHA-256 validation headers on all customer feedback data assets.</span>
            </div>

            {/* Action Buttons footer */}
            <div className="pt-4 flex gap-3.5 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 hover:bg-white/5 text-white/70 hover:text-white rounded-full text-xs font-semibold cursor-pointer"
              >
                Dismiss
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#FFB6C9] to-pink-500 text-black font-extrabold text-xs shadow-lg flex items-center gap-1.5 cursor-pointer disabled:opacity-55"
              >
                {isSubmitting ? 'Verifying Credentials...' : 'Inject Testimonial Now'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
