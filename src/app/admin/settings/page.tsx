import React from "react";
import { Settings, Shield, Bell, Database, Palette, Globe } from "lucide-react";

const sections = [
  {
    icon: Globe,
    title: "Institution Information",
    description: "Manage your institution's profile, branding, and contact information.",
    fields: [
      { label: "Institution Name", placeholder: "EduCore University", type: "text" },
      { label: "Short Code", placeholder: "ECU", type: "text" },
      { label: "Contact Email", placeholder: "admin@educore.edu", type: "email" },
      { label: "Contact Phone", placeholder: "+1 (555) 0100", type: "text" },
      { label: "Website URL", placeholder: "https://educore.edu", type: "url" },
    ],
  },
  {
    icon: Palette,
    title: "Appearance",
    description: "Customize the look and feel of the portal.",
    fields: [
      { label: "Primary Color", placeholder: "#0058BE", type: "color" },
      { label: "Font Family", placeholder: "Inter", type: "text" },
    ],
    toggles: [
      { label: "Enable Dark Mode by Default", description: "New users will start with dark mode enabled" },
      { label: "Show Logo in Sidebar", description: "Display institution logo in the sidebar header" },
    ],
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Configure system notification behavior.",
    toggles: [
      { label: "Email Notifications", description: "Send email alerts for important events" },
      { label: "Announcement Alerts", description: "Alert faculty and students when new announcements are published" },
      { label: "Exam Reminders", description: "Send exam reminders 24 hours before scheduled exams" },
    ],
  },
  {
    icon: Shield,
    title: "Security & Access",
    description: "Control authentication and role-based access settings.",
    toggles: [
      { label: "Require 2FA for Admins", description: "All admin accounts must enable two-factor authentication" },
      { label: "Session Timeout", description: "Automatically log out users after 60 minutes of inactivity" },
      { label: "Allow Student Self-Registration", description: "Students can create accounts without admin approval" },
    ],
  },
  {
    icon: Database,
    title: "Data & Privacy",
    description: "Manage data retention, exports, and privacy settings.",
    toggles: [
      { label: "Enable Audit Logs", description: "Track all administrative actions in the system" },
      { label: "Allow Data Export", description: "Faculty and admins can export data as CSV/PDF" },
    ],
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2 font-bold tracking-tight text-on-surface">Settings</h1>
        <p className="mt-1 text-body-sm text-on-surface-variant">Manage your institution configuration and system preferences.</p>
      </div>

      <div className="space-y-6">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 border-b border-outline-variant bg-surface-container-low px-6 py-4">
                <div className="rounded-md bg-primary/10 p-2 text-primary"><Icon className="h-4 w-4" /></div>
                <div>
                  <h2 className="text-base font-semibold text-on-surface">{section.title}</h2>
                  <p className="text-xs text-on-surface-variant">{section.description}</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {section.fields && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {section.fields.map((f) => (
                      <div key={f.label}>
                        <label className="mb-1.5 block text-label-sm font-medium text-on-surface-variant">{f.label}</label>
                        <input type={f.type} placeholder={f.placeholder} defaultValue={f.type === "color" ? f.placeholder : ""} className="w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface focus:border-primary focus:outline-none" />
                      </div>
                    ))}
                  </div>
                )}
                {section.toggles && (
                  <div className="space-y-3">
                    {section.toggles.map((t, i) => (
                      <div key={t.label} className="flex items-center justify-between rounded-lg border border-outline-variant p-4">
                        <div>
                          <p className="text-sm font-medium text-on-surface">{t.label}</p>
                          <p className="text-xs text-on-surface-variant mt-0.5">{t.description}</p>
                        </div>
                        <button role="switch" aria-checked={i % 2 === 0} className={`relative h-6 w-11 rounded-full transition-colors ${i % 2 === 0 ? "bg-primary" : "bg-outline-variant"}`}>
                          <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${i % 2 === 0 ? "left-[22px]" : "left-0.5"}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {section.fields && (
                  <div className="flex justify-end pt-2">
                    <button className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary hover:bg-primary/90 transition-colors">Save Changes</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* System Info */}
      <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4"><Settings className="h-4 w-4 text-on-surface-variant" /><h2 className="text-base font-semibold text-on-surface">System Information</h2></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[{ label: "Application Version", value: "v1.0.0" }, { label: "Database", value: "PostgreSQL 15" }, { label: "Framework", value: "Next.js 15" }, { label: "Authentication", value: "Clerk Auth" }].map(item => (
            <div key={item.label} className="rounded-lg bg-surface-container-low p-3">
              <p className="text-xs text-on-surface-variant">{item.label}</p>
              <p className="mt-1 text-sm font-semibold text-on-surface">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
