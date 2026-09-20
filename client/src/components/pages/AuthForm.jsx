import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { apiRequest, setAuthSession } from "../../api";

const Panel = styled.section`
  max-width: 30rem;
  margin: 0 auto;
  padding: 2rem 0 4rem;
`;

const Form = styled.form`
  display: grid;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid #eadfe1;
  border-radius: 0.6rem;

  label {
    display: grid;
    gap: 0.35rem;
    font-weight: 700;
    color: #5f2027;
  }
  input {
    padding: 0.7rem;
    border: 1px solid #cdbcc0;
    border-radius: 0.25rem;
    font: inherit;
  }
  button {
    padding: 0.75rem;
    border: 0;
    border-radius: 0.25rem;
    background: #c1121f;
    color: white;
    cursor: pointer;
    font: inherit;
    font-weight: 700;
  }
`;

const Feedback = styled.p`
  color: ${({ $error }) => ($error ? "#a30f1a" : "#286b2a")};
`;

function AuthForm({ isRegister = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [feedback, setFeedback] = useState(location.state?.message || "");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setSubmitting(true);
    setFeedback("");
    setError(false);
    try {
      const path = isRegister ? "/users/register" : "/users/login";
      const response = await apiRequest(path, {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (isRegister) {
        navigate("/login", {
          state: { message: "Account created. You can now log in." },
        });
      } else {
        setAuthSession(response);
        navigate("/");
      }
    } catch (requestError) {
      setFeedback(requestError.message);
      setError(true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Panel>
      <h1>{isRegister ? "Create an account" : "Log in"}</h1>
      <p>
        {isRegister
          ? "Join the Timbertop United community."
          : "Access your Timbertop United account."}
      </p>
      <Form onSubmit={submit}>
        {isRegister && (
          <label htmlFor="name">
            Name
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={updateField}
              autoComplete="name"
              required
            />
          </label>
        )}
        <label htmlFor="email">
          Email
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            autoComplete="email"
            required
          />
        </label>
        <label htmlFor="password">
          Password
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={updateField}
            minLength="8"
            autoComplete={isRegister ? "new-password" : "current-password"}
            required
          />
        </label>
        <button type="submit" disabled={submitting}>
          {submitting
            ? "Please wait..."
            : isRegister
              ? "Create account"
              : "Log in"}
        </button>
      </Form>
      {feedback && (
        <Feedback role={error ? "alert" : "status"} $error={error}>
          {feedback}
        </Feedback>
      )}
      <p>
        {isRegister ? "Already have an account? " : "Need an account? "}
        <Link to={isRegister ? "/login" : "/register"}>
          {isRegister ? "Log in" : "Register"}
        </Link>
      </p>
    </Panel>
  );
}

export default AuthForm;
