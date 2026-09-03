import { Outlet } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import styled from "styled-components";

import Header from "./Header";
import Footer from "./Footer";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    min-height: 100%;
    margin: 0;
  }

  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: #ffffff;
  }
`;

const Root = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  width: 100%;
`;

const ContentRegion = styled.div`
  width: min(100% - 2rem, 1200px);
  margin: 0 auto;
  padding: 2rem 0;

  @media (max-width: 600px) {
    padding: 1.5rem 0;
  }
`;

function PageShell() {
  return (
    <>
      <GlobalStyle />
      <Root>
        <Header />
        <MainContent>
          <ContentRegion>
            <Outlet />
          </ContentRegion>
        </MainContent>
        <Footer />
      </Root>
    </>
  );
}

export default PageShell;
