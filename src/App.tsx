import { useState, useEffect } from 'react';
import { 
  Sparkles, CheckCircle, Info, X, Star, ShieldCheck, Mail 
} from 'lucide-react';
import { Testimonial } from './types';
import { INITIAL_TESTIMONIALS } from './data';
import { supabase, isSupabaseConfigured } from './lib/supabase';

// Component imports
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WidgetBuilder from './components/WidgetBuilder';
import WaitlistHub from './components/WaitlistHub';
import PricingPanel from './components/PricingPanel';
import FaqAccordion from './components/FaqAccordion';
import Footer from './components/Footer';
import DashboardView from './components/DashboardView';
import SubmitReviewModal from './components/SubmitReviewModal';

export default function App() {
  const [activeView, setActiveView] = useState<'marketing' | 'dashboard'>('marketing');
  const [user, setUser] = useState<{ email: string; fullName: string } | null>(null);
  
  // High-value global state: testimonials
  // Storing this at the parent level ensures that newly submitted reviews instantly show up 
  // in BOTH the Widget Builder AND the Dashboard Inbox / Analytics views!
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  
  // Submit modal toggle state
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  // General Notification feedback system
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'info';
    id: number;
  } | null>(null);

  // Trigger quick top-banner toast notifications
  const triggerNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type, id: Date.now() });
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Load session from Supabase on start or fall back to localStorage
  useEffect(() => {
    if (isSupabaseConfigured()) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session && session.user) {
          const u = session.user;
          setUser({
            email: u.email || '',
            fullName: u.user_metadata?.full_name || u.email?.split('@')[0] || 'User'
          });
        } else {
          setUser(null);
        }
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session && session.user) {
          const u = session.user;
          setUser({
            email: u.email || '',
            fullName: u.user_metadata?.full_name || u.email?.split('@')[0] || 'User'
          });
        } else {
          setUser(null);
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      const checkMockUser = () => {
        const mockUserStr = localStorage.getItem('mock_auth_user');
        if (mockUserStr) {
          const mockUser = JSON.parse(mockUserStr);
          setUser({
            email: mockUser.email,
            fullName: mockUser.user_metadata?.full_name || mockUser.email.split('@')[0] || 'User'
          });
        } else {
          setUser(null);
        }
      };

      checkMockUser();
      window.addEventListener('storage', checkMockUser);
      return () => {
        window.removeEventListener('storage', checkMockUser);
      };
    }
  }, []);

  // Redirect to login page if unauthenticated when attempting to view dashboard mode
  useEffect(() => {
    if (activeView === 'dashboard' && !user) {
      window.location.href = '/login.html';
    }
  }, [activeView, user]);

  const handleLogout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('mock_auth_user');
    }
    setUser(null);
    triggerNotification('Handshake disconnected. Active session cleared.', 'info');
    setActiveView('marketing');
  };

  // Scroll to top layout helper
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add review callback
  const handleAddTestimonial = (newReview: Testimonial) => {
    setTestimonials(prev => [newReview, ...prev]);
    triggerNotification(`Testimonial from ${newReview.clientName} synced successfully!`);
  };

  // Handle plan checkout mock selection
  const handlePlanSelect = (planName: string) => {
    triggerNotification(`Secured allocation draft for "${planName}". Contacting accounts...`, 'info');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-brand-soft font-sans relative flex flex-col justify-between selection:bg-[#FFB6C9] selection:text-black">
      {/* Sub-surface grid lines overlaying pages */}
      <div className="absolute inset-0 z-0 subsurface-grid opacity-30 pointer-events-none" />

      {/* Luxury Compact Navbar */}
      <Navbar 
        activeView={activeView} 
        setActiveView={(v) => {
          setActiveView(v);
          handleScrollToTop();
        }}
        onSubmitReviewClick={() => setIsSubmitModalOpen(true)}
        user={user}
        onLogout={handleLogout}
      />

      {/* Floating Interactive Toast Alert */}
      {notification && (
        <div className="fixed top-28 right-6 z-50 animate-bounce">
          <div className="wallovo-glass rounded-2xl p-4 border-[#FFB6C9]/30 flex items-center gap-3 shadow-2xl relative pr-10">
            <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFB6C9] to-transparent" />
            <div className="w-8 h-8 rounded-full bg-pink-500/10 flex items-center justify-center border border-[#FFB6C9]/25 shrink-0">
              {notification.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-[#FFB6C9]" />
              ) : (
                <Info className="w-4 h-4 text-pink-300" />
              )}
            </div>
            <div className="text-left font-sans">
              <span className="text-xs font-bold text-white block">System Dispatch</span>
              <p className="text-[11px] text-zinc-300 pr-2">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification(null)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* PRIMARY RENDER ROUTES */}
      <main className="flex-1 relative z-10">
        {activeView === 'marketing' ? (
          <div className="animate-fade-in">
            {/* Cinematic Hero */}
            <Hero 
              onExploreClick={() => {
                setActiveView('dashboard');
                handleScrollToTop();
              }}
              onSubmitReviewClick={() => setIsSubmitModalOpen(true)}
            />

            {/* Simulated Live Grid custom widget compiler */}
            <div id="widget">
              <WidgetBuilder />
            </div>

            {/* Waitlist callout box */}
            <WaitlistHub />

            {/* Plan pricing tables */}
            <PricingPanel onPlanSelect={handlePlanSelect} />

            {/* Details FAQ list */}
            <FaqAccordion />
          </div>
        ) : (
          /* Multi-Module AI Dashboard Management Back Office */
          <div className="animate-fade-in">
            <DashboardView 
              testimonials={testimonials} 
              setTestimonials={setTestimonials}
            />
          </div>
        )}
      </main>

      {/* Ethereal Footer */}
      <Footer 
        onBackToTop={handleScrollToTop}
        onExploreClick={() => {
          const widgetElem = document.getElementById('widget');
          if (widgetElem) {
            widgetElem.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Global Interactive Submit Testimonial Overlay Modal */}
      <SubmitReviewModal 
        isOpen={isSubmitModalOpen} 
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmit={handleAddTestimonial}
      />
    </div>
  );
}
