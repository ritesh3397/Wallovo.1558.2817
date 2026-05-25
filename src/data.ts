import { Testimonial } from './types';

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    clientName: 'Alex Sterling',
    clientRole: 'Founding Partner',
    clientCompany: 'Sterling & Co.',
    text: 'Wallovo turned our static social proof into a dynamic high-converting machine. It is an absolute game-changer for high-ticket agencies looking to stand out instantly.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop',
    stars: 5,
    verified: true,
    source: 'linkedin',
    date: '2026-05-20',
    category: 'Agency Growth',
    conversionLift: '+38%'
  },
  {
    id: 't-2',
    clientName: 'Chloe Mercer',
    clientRole: 'CEO & Founder',
    clientCompany: 'Bloom Software',
    text: 'The automatic capture rate is unreal. We collected 18 beautiful video testimonials in our first week without chasing clients, and the inline player feels premium and smooth.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop',
    stars: 5,
    verified: true,
    source: 'video',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-woman-working-on-a-laptop-in-a-cafe-43111-large.mp4',
    date: '2026-05-22',
    category: 'Product SaaS',
    conversionLift: '+41%'
  },
  {
    id: 't-3',
    clientName: 'Marcus Vance',
    clientRole: 'Head of Brand',
    clientCompany: 'Arcana Labs',
    text: 'As developers, we are highly critical of external scripts. Wallovo is the first testimonial embedding widget that actually honors our strict design values: matte textures, fluid states, zero lag.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop',
    stars: 5,
    verified: true,
    source: 'twitter',
    date: '2026-05-18',
    category: 'Developer Tools',
    conversionLift: '+22%'
  },
  {
    id: 't-4',
    clientName: 'Sophia Lin',
    clientRole: 'Growth Lead',
    clientCompany: 'Horizon Media',
    text: 'Integrating this testimonial grid elevated our landing page trust score immediately. Our checkout page conversion rates shot up by 32% within two weeks of deployment.',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=256&auto=format&fit=crop',
    stars: 4,
    verified: false,
    source: 'custom',
    date: '2026-05-15',
    category: 'Conversion Suite',
    conversionLift: '+32%'
  },
  {
    id: 't-5',
    clientName: 'Derrick Wu',
    clientRole: 'VP of Product',
    clientCompany: 'Aetheric Systems',
    text: 'Its extremely simple to manage reviews here. Usually, client quotes are rambling and disorganized. Wallovo AI helps polish drafts into clean, punchy sales copy in one click.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=256&auto=format&fit=crop',
    stars: 5,
    verified: true,
    source: 'linkedin',
    date: '2026-05-12',
    category: 'Product SaaS',
    conversionLift: '+28%'
  }
];

export const GENERAL_FAQ = [
  {
    question: "What makes Wallovo different from basic review carousels?",
    answer: "Wallovo is built from the ground up for elite visual polish and conversion psychology. Unlike flat corporate plugins, we employ native video parsing engines, subtle parallax float transitions, and automatic AI-powered copywriting rewrite tools. This ensures client love actually reads like persuasive marketing material."
  },
  {
    question: "How does the AI Polish Rewrite engine work?",
    answer: "Our engine uses specialized intelligence to take messy, run-on client statements (e.g. from Slack screenshots or casual emails) and restructures them into high-conversion assets. It preserves authentic feedback while tightening structure, placing the value proposition upfront, and improving readable flow."
  },
  {
    question: "Is there support for custom subdomains and branding?",
    answer: "Absolutely. With our Pro and Enterprise plans, you can host your intake forms on custom DNS CNAME subdomains with fully white-labeled layouts. All styles, fonts, and dark textures are fully interactive and adaptable to match your distinct brand values."
  },
  {
    question: "Can we automate notifications directly to our team?",
    answer: "Yes. Wallovo premium integrations connect directly to your Slack, Discord, or Notion workspaces. The moment a high-value customer submits a five-star testimonial, your chosen team channels are alerted with a rich layout card."
  }
];
