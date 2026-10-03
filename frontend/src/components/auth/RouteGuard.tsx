"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/types";

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requirePermission?: string;
}

export function RouteGuard({ children, allowedRoles, requirePermission }: RouteGuardProps) {
  const { user, loading, hasRole, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (allowedRoles && !hasRole(...allowedRoles)) {
      router.replace("/dashboard/unauthorized");
      return;
    }

    if (requirePermission && !hasPermission(requirePermission)) {
      router.replace("/dashboard/unauthorized");
    }
  }, [user, loading, allowedRoles, requirePermission, router, hasRole, hasPermission]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (allowedRoles && !hasRole(...allowedRoles)) return null;
  if (requirePermission && !hasPermission(requirePermission)) return null;

  return <>{children}</>;
}
