import { NavLink } from "react-router-dom";
import styled from "styled-components";

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

function Header() {
  return (
    <SiteHeader>
      <HeaderContent>
        <Brand to="/" end>
          Timbertop United
        </Brand>
        <Navigation aria-label="Main navigation">
          <NavigationLink to="/" end>
            Home
          </NavigationLink>
          <NavigationLink to="/products">Products</NavigationLink>
          <NavigationLink to="/news">News</NavigationLink>
          <NavigationLink to="/about">About</NavigationLink>
          <NavigationLink to="/contact">Contact</NavigationLink>
        </Navigation>
      </HeaderContent>
    </SiteHeader>
  );
}

export default Header;
