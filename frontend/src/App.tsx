import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";

// Pages
import LandingPage from "@/pages/LandingPage";
import AuthCallbackPage from "@/pages/AuthCallbackPage";
import CollegeDashboard from "@/pages/CollegeDashboard";
import StudentSpace from "@/pages/StudentSpace";
import MyItemsPage from "@/pages/MyItemsPage";
import SocietyRoom from "@/pages/SocietyRoom";
import CollegeAdminPanel from "@/pages/CollegeAdminPanel";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />

            {/* Protected Routes with Dashboard Layout */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              {/* College Dashboard */}
              <Route path="/college/:collegeId" element={<CollegeDashboard />} />

              {/* Student Routes */}
              <Route path="/college/:collegeId/student" element={<StudentSpace />} />
              <Route path="/college/:collegeId/student/my-items" element={<MyItemsPage />} />
              <Route path="/college/:collegeId/student/browse" element={<CollegeDashboard />} />
              <Route path="/college/:collegeId/student/report-lost" element={<StudentSpace />} />
              <Route path="/college/:collegeId/student/report-found" element={<StudentSpace />} />

              {/* Society Routes */}
              <Route path="/college/:collegeId/society/:societyId" element={<SocietyRoom />} />
              <Route path="/college/:collegeId/society/:societyId/browse" element={<CollegeDashboard />} />
              <Route path="/college/:collegeId/society/:societyId/my-items" element={<MyItemsPage />} />

              {/* Admin Routes */}
              <Route path="/college/:collegeId/admin" element={<CollegeAdminPanel />} />
              <Route path="/college/:collegeId/admin/items" element={<CollegeDashboard />} />
              <Route path="/college/:collegeId/admin/pending" element={<CollegeAdminPanel />} />
              <Route path="/college/:collegeId/admin/resolved" element={<CollegeDashboard />} />
              <Route path="/college/:collegeId/admin/analytics" element={<CollegeAdminPanel />} />
              <Route path="/college/:collegeId/admin/invites" element={<CollegeAdminPanel />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
