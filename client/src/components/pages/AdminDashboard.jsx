import { Navigate } from "react-router-dom";

import { getStoredUser } from "../../api";
import NewsAdminPanel from "../admin/NewsAdminPanel";
import ProductAdminPanel from "../admin/ProductAdminPanel";
import { DashboardGrid, Page } from "../admin/AdminStyles";

function AdminDashboard() {
  // this controls the interface, while admin routes enforce access on the server.
  const user = getStoredUser();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") {
    return (
      <Page>
        <h1>Access denied</h1>
        <p>Only administrators can manage shop content.</p>
      </Page>
    );
  }

  return (
    <Page>
      <h1>Admin dashboard</h1>
      <DashboardGrid>
        <ProductAdminPanel />
        <NewsAdminPanel />
      </DashboardGrid>
    </Page>
  );
}

export default AdminDashboard;
