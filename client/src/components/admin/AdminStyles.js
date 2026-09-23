import styled from "styled-components";

export const Page = styled.section`
  padding: 1rem 0 4rem;
  color: #241116;
`;

export const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
  }
`;

export const Panel = styled.section`
  min-width: 0;
  padding: 1.5rem;
  border: 1px solid #eadfe1;
  border-radius: 0.6rem;
  background: #ffffff;
  box-shadow: 0 0.6rem 1.5rem rgb(95 32 39 / 7%);
`;

export const Form = styled.form`
  display: grid;
  gap: 0.8rem;
  margin-top: 1rem;

  label {
    display: grid;
    gap: 0.35rem;
    color: #5f2027;
  }

  input:not([type="checkbox"]):not([type="color"]),
  textarea {
    width: 100%;
    padding: 0.7rem;
    border: 1px solid #cdbcc0;
    border-radius: 0.25rem;
    background: #fff;
    font: inherit;
  }

  input:not([type="checkbox"]):not([type="color"]):focus,
  textarea:focus {
    outline: 2px solid #f0a5ab;
    outline-offset: 1px;
    border-color: #c1121f;
  }

  input[type="color"] {
    width: 100%;
    height: 2.8rem;
    padding: 0.25rem;
    border: 1px solid #cdbcc0;
    border-radius: 0.25rem;
    background: #fff;
    cursor: pointer;
  }

  textarea {
    min-height: 5rem;
    resize: vertical;
  }

  button[type="submit"] {
    width: fit-content;
    padding: 0.7rem 1rem;
    border: 0;
    border-radius: 0.25rem;
    background: #c1121f;
    color: white;
    cursor: pointer;
    font: inherit;
    font-weight: 700;
  }
`;

export const CheckLabel = styled.label`
  && {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.55rem;
  }

  input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    margin: 0;
    accent-color: #c1121f;
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const SecondaryButton = styled.button`
  padding: 0.45rem 0.7rem;
  border: 1px solid #c1121f;
  border-radius: 0.25rem;
  background: white;
  color: #a30f1a;
  cursor: pointer;
  font: inherit;
`;

export const DangerButton = styled(SecondaryButton)`
  border-color: #a30f1a;
  color: #a30f1a;
`;

export const Records = styled.ul`
  display: grid;
  gap: 0.75rem;
  margin: 1rem 0 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid #f0e5e7;
`;

export const Record = styled.li`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid #f0e5e7;
  background: #fff7f7;

  @media (max-width: 480px) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const Feedback = styled.p`
  margin: 1rem 0 0;
  color: ${({ $error }) => ($error ? "#a30f1a" : "#286b2a")};
`;
