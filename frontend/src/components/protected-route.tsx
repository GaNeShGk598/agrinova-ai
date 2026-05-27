import { Redirect } from "wouter";
import { api } from "@/lib/api";

export function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  if (!api.auth.isAuthenticated()) {
    return <Redirect to="/login" />;
  }
  return <Component />;
}
