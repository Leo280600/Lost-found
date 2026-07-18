"use client";

// Thin wrapper kept so existing `import { useAuth } from "@/hooks/useAuth"`
// call sites don't need to change. The actual state now lives in one shared
// AuthProvider (see context/AuthContext.tsx) mounted at the root layout, so
// every component sees the same, up-to-date session — including the Navbar.
export { useAuthContext as useAuth } from "@/context/AuthContext";
