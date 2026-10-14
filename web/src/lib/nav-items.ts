import { FileText, LayoutDashboard, Library, ScanSearch, Settings, WandSparkles } from "lucide-react";
import type { ComponentType, SVGProps } from "react";

// Single source of truth for the app's primary destinations — shared by the
// desktop sidebar and the mobile nav so they can never drift.
export type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  chip?: string;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/cv", label: "Master Resume", icon: FileText },
  { href: "/analyzer", label: "Job Analyzer", icon: ScanSearch },
  { href: "/tailor", label: "Tailor Resume", icon: WandSparkles },
  { href: "/resume-library", label: "Resume Library", icon: Library },
  { href: "/config", label: "Settings", icon: Settings },
];

export function isActivePath(href: string, pathname: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}
