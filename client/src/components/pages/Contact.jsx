import { useState } from "react";
import styled from "styled-components";

import { apiRequest } from "../../api";

const ContactPage = styled.section`
  max-width: 700px;
  margin: 0 auto;
  padding: 1rem 0 4rem;
`;

const ContactForm = styled.form`
  display: grid;
  gap: 1rem;
  margin-top: 2rem;
  label {
    display: grid;
    gap: 0.35rem;
    font-weight: 700;
    color: #5f2027;
  }
  input,
  textarea {
    padding: 0.7rem;
    border: 1px solid #cdbcc0;
    border-radius: 0.25rem;
    font: inherit;
  }
  textarea {
    min-height: 9rem;
    resize: vertical;
  }
  button {
    width: fit-content;
    padding: 0.75rem 1.4rem;
    border: 0;
    border-radius: 0.25rem;
    background: #c1121f;
    color: white;
    cursor: pointer;
    font: inherit;
    font-weight: 700;
  }
`;

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(false);

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function submit(event) {
    event.preventDefault();
    setFeedback("");
    setError(false);
    try {
      const response = await apiRequest("/contact", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setFeedback(response.message);
      setForm({ name: "", email: "", message: "" });
    } catch (requestError) {
      setFeedback(requestError.message);
      setError(true);
    }
  }

  return (
    <ContactPage>
      <h1>Contact</h1>
      <p>Have a question about the club or merchandise? Send us a message.</p>
      <ContactForm onSubmit={submit}>
        <label htmlFor="contact-name">
          Name
          <input
            id="contact-name"
            name="name"
            value={form.name}
            onChange={updateField}
            required
          />
        </label>
        <label htmlFor="contact-email">
          Email
          <input
            id="contact-email"
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            required
          />
        </label>
        <label htmlFor="contact-message">
          Message
          <textarea
            id="contact-message"
            name="message"
            value={form.message}
            onChange={updateField}
            required
          />
        </label>
        <button type="submit">Send message</button>
      </ContactForm>
      {feedback && <p role={error ? "alert" : "status"}>{feedback}</p>}
    </ContactPage>
  );
}

export default Contact;
