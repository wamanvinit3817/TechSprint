import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireCollegeMatch?: boolean;
  requireSocietyMatch?: boolean;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  requireCollegeMatch = false,
  requireSocietyMatch = false,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, role, collegeId, societyId } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-hero bg-mesh">
        <div className="glass-card p-8 flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // Check college ID match from URL params
  if (requireCollegeMatch) {
    const urlCollegeId = location.pathname.split('/')[2];
    if (urlCollegeId && collegeId !== urlCollegeId) {
      return <Navigate to={`/college/${collegeId}`} replace />;
    }
  }

  // Check society ID match from URL params
  if (requireSocietyMatch) {
    const pathParts = location.pathname.split('/');
    const societyIndex = pathParts.indexOf('society');
    if (societyIndex !== -1 && pathParts[societyIndex + 1]) {
      const urlSocietyId = pathParts[societyIndex + 1];
      if (societyId !== urlSocietyId) {
        return <Navigate to={`/college/${collegeId}`} replace />;
      }
    }
  }

  return <>{children}</>;
}
