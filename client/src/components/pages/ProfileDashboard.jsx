import { Navigate, Link } from "react-router-dom";
import styled from "styled-components";

import { getStoredUser } from "../../api";
import useApiResource from "../../hooks/useApiResource";

const Panel = styled.section`
  max-width: 760px;
  margin: 0 auto;
  padding: 1rem 0 4rem;
`;

const Details = styled.dl`
  display: grid;
  grid-template-columns: 10rem 1fr;
  gap: 0.8rem 1rem;
  margin: 2rem 0;
  padding: 1.5rem;
  border: 1px solid #eadfe1;
  border-radius: 0.6rem;

  dt {
    color: #70565a;
    font-weight: 700;
  }
  dd {
    margin: 0;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.2rem;
  }
`;

function ProfileDashboard() {
  const storedUser = getStoredUser();
  const resource = useApiResource("/users/me");
  if (!storedUser) return <Navigate to="/login" replace />;
  if (resource.loading)
    return (
      <Panel>
        <p>Loading your profile...</p>
      </Panel>
    );
  if (resource.error)
    return (
      <Panel>
        <p role="alert">Your session has expired. Please log in again.</p>
        <Link to="/login">Log in</Link>
      </Panel>
    );

  const user = resource.data.user;
  return (
    <Panel>
      <h1>Your profile</h1>
      <p>Manage your Timbertop United account details.</p>
      <Details>
        <dt>Name</dt>
        <dd>{user.name}</dd>
        <dt>Email</dt>
        <dd>{user.email}</dd>
        <dt>Account type</dt>
        <dd>{user.role === "admin" ? "Administrator" : "Supporter"}</dd>
      </Details>
      {user.role === "admin" && (
        <p>
          <Link to="/admin">Open the admin dashboard</Link>
        </p>
      )}
    </Panel>
  );
}

export default ProfileDashboard;
