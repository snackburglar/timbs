import styled from "styled-components";

const AboutPage = styled.section`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 0 4rem;
  text-align: center;
`;

const Intro = styled.p`
  max-width: 620px;
  margin: 0 auto;
  color: #70565a;
  font-size: 1.1rem;
  line-height: 1.7;
`;

const StoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
  margin-top: 4rem;
  text-align: left;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const Story = styled.div`
  padding-top: 1rem;
  border-top: 3px solid #c1121f;
`;

const StoryTitle = styled.h2`
  margin: 0 0 0.75rem;
  font-size: 1.25rem;
`;

const StoryText = styled.p`
  margin: 0;
  color: #70565a;
  line-height: 1.7;
`;

function About() {
  return (
    <AboutPage>
      <h1>More than a football team.</h1>
      <Intro>
        Timbertop United is a community club built on teamwork, passion, and
        pride. We bring players and supporters together on and off the pitch.
      </Intro>
      <StoryGrid>
        <Story>
          <StoryTitle>Our story</StoryTitle>
          <StoryText>
            From weekend matches to the biggest moments of the season, we are
            proud to represent the Timbertop community.
          </StoryText>
        </Story>
        <Story>
          <StoryTitle>Our colours</StoryTitle>
          <StoryText>
            Every shirt, scarf, and cap is a way to show your support for the
            team we all share.
          </StoryText>
        </Story>
      </StoryGrid>
    </AboutPage>
  );
}

export default About;
