import styled from "styled-components";

const SiteFooter = styled.footer`
  padding: 1rem 2rem;
  background: #8f0d17;
  color: white;
  text-align: center;
`;

function Footer() {
  return (
    <SiteFooter>
      <small>© 2026 Timbertop United</small>
    </SiteFooter>
  );
}

export default Footer;
