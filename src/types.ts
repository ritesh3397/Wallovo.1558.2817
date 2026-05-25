export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  clientCompany: string;
  text: string;
  avatarUrl: string;
  stars: number;
  verified: boolean;
  source: 'twitter' | 'linkedin' | 'custom' | 'video';
  videoUrl?: string;
  date: string;
  category?: string;
  conversionLift?: string;
}

export interface WidgetConfig {
  theme: 'carousel' | 'minimal-glass' | 'midnight-high-contrast';
  columns: number;
  videoOnly: boolean;
}

export interface FormConfig {
  welcomeMessage: string;
  starGoal: number;
  brandLogoUrl: string;
}

export interface MetricCardData {
  title: string;
  value: string;
  trend: string;
  trendType: 'up' | 'down' | 'neutral';
  iconName: string;
}
