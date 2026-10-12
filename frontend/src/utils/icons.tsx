import React from 'react';
import {
  Utensils,
  ShoppingCart,
  Car,
  ShoppingBag,
  Home,
  Zap,
  HeartPulse,
  GraduationCap,
  Film,
  Plane,
  Sparkles,
  Repeat,
  HelpCircle,
  Briefcase,
  Laptop,
  Building2,
  TrendingUp,
  Gift,
  PlusCircle,
  Wallet,
  Coffee,
  Fuel,
  Receipt,
  PiggyBank,
  type LucideProps
} from 'lucide-react';

const iconMap: Record<string, React.FC<LucideProps>> = {
  Utensils,
  ShoppingCart,
  Car,
  ShoppingBag,
  Home,
  Zap,
  HeartPulse,
  GraduationCap,
  Film,
  Plane,
  Sparkles,
  Repeat,
  HelpCircle,
  Briefcase,
  Laptop,
  Building2,
  TrendingUp,
  Gift,
  PlusCircle,
  Wallet,
  Coffee,
  Fuel,
  Receipt,
  PiggyBank,
};

export function getCategoryIcon(name: string, props?: LucideProps): React.ReactElement {
  const IconComponent = iconMap[name] || HelpCircle;
  return <IconComponent {...props} />;
}

export const availableCategoryIcons = Object.keys(iconMap);
