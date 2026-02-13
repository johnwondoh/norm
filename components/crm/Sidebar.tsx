"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bell,
  Users,
  Calendar,
  FileText,
  ClipboardList,
  FolderOpen,
  Shield,
  UserCog,
  DollarSign,
  BarChart3,
  Wallet,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LucideIcon,
  TriangleAlert,
  Clock
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  children?: { label: string; href: string }[];
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface SidebarProps {
  sections?: NavSection[];
  user?: UserProfile;
  currentPath?: string;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  logoText?: string;
  logoSubtext?: string;
}

const defaultSections: NavSection[] = [
  {
    title: "NOTIFICATIONS",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Alerts & Messages", href: "/alerts", icon: Bell, badge: "Preview" },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      { label: "Participants", href: "/participants", icon: Users },
      {
        label: "Scheduling",
        href: "/schedules",
        icon: Calendar,
        children: [
          { label: "Service Schedules", href: "/schedules" },
          { label: "Shift Management", href: "/shift-management" },
        ],
      },
      { label: "Care Plans", href: "/care-plans", icon: FileText },
      { label: "Progress Notes", href: "/progress-notes", icon: ClipboardList },
      { label: "Documents", href: "/documents", icon: FolderOpen },
      {
        label: "Incidents & Feedback",
        href: "/incident-reports",
        icon: TriangleAlert,
        children: [
          { label: "Incident Reports",    href: "/incident-reports" },
          { label: "Feedback & Complaints", href: "/feedback" },
        ],
      },
      { label: "Compliance & Audits", href: "/compliance", icon: Shield },
    ],
  },
  {
    title: "HR & FINANCE",
    items: [
      {
        label: "Staff Management",
        href: "/employees",
        icon: UserCog,
        children: [
          { label: "All Staff", href: "/employees" },
          { label: "Roles & Permissions", href: "/employees/roles" },
        ],
      },
      { label: "Timesheets", href: "/timesheets", icon: Clock },
      { label: "Invoicing & Billing", href: "/invoicing", icon: DollarSign },
      {
        label: "Reports & Analytics",
        href: "/reports",
        icon: BarChart3,
        children: [
          { label: "Overview", href: "/reports" },
          { label: "Financial Reports", href: "/reports/financial" },
        ],
      },
      { label: "Payroll Management", href: "/payroll", icon: Wallet },
    ],
  },
];

const defaultUser: UserProfile = {
  name: "Admin User",
  email: "admin@ndis.com",
};

export function Sidebar({
  sections = defaultSections,
  user = defaultUser,
  currentPath = "",
  collapsed = false,
  onCollapsedChange,
  logoText = "NDIS CRM",
  logoSubtext = "Care Management System",
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(collapsed);
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const handleCollapse = () => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  };

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string, children?: { label: string; href: string }[]) => {
    if (currentPath === href) return true;
    if (children) {
      return children.some((child) => currentPath === child.href);
    }
    return false;
  };

  return (
    <aside
      className={cn(
        "flex flex-col min-h-screen sticky top-0 bg-slate-900 text-white transition-all duration-300",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        {!isCollapsed && (
          <div>
            <h1 className="text-xl font-bold">{logoText}</h1>
            <p className="text-xs text-slate-400">{logoSubtext}</p>
          </div>
        )}
        <button
          onClick={handleCollapse}
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {sections.map((section) => (
          <div key={section.title} className="mb-6">
            {!isCollapsed && (
              <h2 className="px-4 mb-2 text-xs font-semibold text-slate-400 tracking-wider">
                {section.title}
              </h2>
            )}
            <ul className="space-y-1 px-2">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href, item.children);
                const expanded = expandedItems.includes(item.label);
                const hasChildren = item.children && item.children.length > 0;

                return (
                  <li key={item.label}>
                    {hasChildren ? (
                      <button
                        onClick={() => toggleExpanded(item.label)}
                        className={cn(
                          "flex items-center w-full gap-3 px-3 py-2.5 rounded-lg transition-colors",
                          active
                            ? "bg-blue-600 text-white"
                            : "text-slate-300 hover:bg-slate-800"
                        )}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 text-left text-sm font-medium">
                              {item.label}
                            </span>
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform",
                                expanded && "rotate-180"
                              )}
                            />
                          </>
                        )}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                          active
                            ? "bg-blue-600 text-white"
                            : "text-slate-300 hover:bg-slate-800"
                        )}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 text-sm font-medium">
                              {item.label}
                            </span>
                            {item.badge && (
                              <span className="px-2 py-0.5 text-xs bg-slate-700 rounded">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </Link>
                    )}
                    {hasChildren && expanded && !isCollapsed && (
                      <ul className="mt-1 ml-8 space-y-1">
                        {item.children!.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={cn(
                                "block px-3 py-2 text-sm rounded-lg transition-colors",
                                currentPath === child.href
                                  ? "text-blue-400"
                                  : "text-slate-400 hover:text-white"
                              )}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}

        <div className="px-2 mt-4 pt-4 border-t border-slate-700">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
              currentPath === "/settings"
                ? "bg-blue-600 text-white"
                : "text-slate-300 hover:bg-slate-800"
            )}
          >
            <Settings className="h-5 w-5 flex-shrink-0" />
            {!isCollapsed && (
              <span className="text-sm font-medium">Settings</span>
            )}
          </Link>
        </div>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <div className="relative">
              {user.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
              <div className="h-10 w-10 rounded-full bg-slate-600 flex items-center justify-center">
                <span className="text-sm font-medium">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-slate-900" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.email}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
