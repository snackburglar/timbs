import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { clearAuthSession, getStoredUser } from "../../api";

const SiteHeader = styled.header`
  padding: 1rem 2rem;
  background: #c1121f;
  color: white;
`;

const HeaderContent = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Brand = styled(NavLink)`
  color: white;
  font-size: 1.25rem;
  font-weight: 700;
  text-decoration: none;
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavigationLink = styled(NavLink)`
  color: white;
  text-decoration: none;

  &:hover,
  &.active {
    text-decoration: underline;
  }
`;

const ProfileMenu = styled.details`
  position: relative;
`;

const ProfileButton = styled.summary`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.25rem;
  color: white;
  cursor: pointer;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }

  &:hover,
  &:focus-visible {
    color: #fdf0d5;
  }
`;

const AccountIcon = styled.svg`
  width: 1.25rem;
  height: 1.25rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 0.75rem);
  right: 0;
  z-index: 1;
  min-width: 8rem;
  padding: 0.35rem;
  border-radius: 0.35rem;
  background: white;
  box-shadow: 0 0.35rem 1rem rgb(0 0 0 / 20%);
`;

const DropdownLink = styled(NavLink)`
  display: block;
  padding: 0.55rem 0.7rem;
  border-radius: 0.2rem;
  color: #333;
  text-decoration: none;

  &:hover,
  &:focus-visible {
    background: #fdf0d5;
  }
`;

const LogoutButton = styled.button`
  display: block;
  width: 100%;
  padding: 0.55rem 0.7rem;
  border: 0;
  border-radius: 0.2rem;
  background: transparent;
  color: #333;
  cursor: pointer;
  font: inherit;
  text-align: left;

  &:hover,
  &:focus-visible {
    background: #fdf0d5;
  }
`;

function Header() {
  const [user, setUser] = useState(getStoredUser);
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogout() {
    clearAuthSession();
    if (
      location.pathname === "/profile" ||
      location.pathname.startsWith("/admin")
    ) {
      navigate("/login", { replace: true });
    }
  }

  useEffect(() => {
    const updateUser = () => setUser(getStoredUser());
    window.addEventListener("timbertop-auth-change", updateUser);
    return () =>
      window.removeEventListener("timbertop-auth-change", updateUser);
  }, []);

  return (
    <SiteHeader>
      <HeaderContent>
        <Brand to="/" end>
          Timbertop United
        </Brand>
        <Navigation aria-label="Main navigation">
          <NavigationLink to="/products">Products</NavigationLink>
          <NavigationLink to="/news">News</NavigationLink>
          <NavigationLink to="/about">About</NavigationLink>
          <NavigationLink to="/contact">Contact</NavigationLink>
          <ProfileMenu>
            <ProfileButton aria-label="Open account menu">
              <AccountIcon viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 20c.8-3.4 3.2-5 7-5s6.2 1.6 7 5" />
              </AccountIcon>
            </ProfileButton>
            <DropdownMenu>
              {user ? (
                <>
                  <DropdownLink to="/profile">Profile</DropdownLink>
                  {user.role === "admin" && (
                    <DropdownLink to="/admin">Admin dashboard</DropdownLink>
                  )}
                  <LogoutButton type="button" onClick={handleLogout}>
                    Log out
                  </LogoutButton>
                </>
              ) : (
                <>
                  <DropdownLink to="/login">Login</DropdownLink>
                  <DropdownLink to="/register">Register</DropdownLink>
                </>
              )}
            </DropdownMenu>
          </ProfileMenu>
        </Navigation>
      </HeaderContent>
    </SiteHeader>
  );
}

export default Header;
