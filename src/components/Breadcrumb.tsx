"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import {
  Breadcrumb as ShadcnBreadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

export function Breadcrumb() {
  const pathname = usePathname() || "";
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;

  const roleBase = segments[0] || "";
  const rolePath = `/${roleBase}`;

  return (
    <ShadcnBreadcrumb>
      <BreadcrumbList className="flex-wrap text-sm font-medium">
        <BreadcrumbItem>
          <BreadcrumbLink
            render={
              <Link
                href={rolePath}
                className="flex items-center gap-1.5 text-on-surface-variant hover:text-on-surface transition-colors"
              />
            }
          >
            <Home className="h-3.5 w-3.5" />
            <span className="capitalize">{roleBase}</span>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.slice(1).map((segment, index) => {
          const path = `/${roleBase}/${segments.slice(1, index + 2).join("/")}`;
          const isLast = index === segments.length - 2;
          const label = segment
            .replace(/-/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());

          return (
            <React.Fragment key={path}>
              <BreadcrumbSeparator className="text-outline">
                <ChevronRight className="h-3.5 w-3.5" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-semibold text-on-surface">
                    {label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={
                      <Link
                        href={path}
                        className="text-on-surface-variant hover:text-on-surface transition-colors"
                      />
                    }
                  >
                    {label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </ShadcnBreadcrumb>
  );
}

export default Breadcrumb;
