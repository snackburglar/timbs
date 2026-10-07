import { useState } from "react";

import { apiRequest } from "../../api";
import useApiResource from "../../hooks/useApiResource";
import {
  ButtonRow,
  DangerButton,
  Feedback,
  Form,
  Panel,
  Record,
  Records,
  SecondaryButton,
} from "./AdminStyles";

function emptyArticle() {
  return {
    date: "",
    publishedAt: "",
    category: "",
    title: "",
    excerpt: "",
    content: "",
    initials: "",
    colour: "#c1121f",
  };
}

function NewsAdminPanel() {
  const newsResource = useApiResource("/news");
  const [article, setArticle] = useState(emptyArticle);
  const [feedback, setFeedback] = useState("");
  const [feedbackError, setFeedbackError] = useState(false);

  function updateArticle(event) {
    const { name, value } = event.target;
    setArticle((current) => ({
      ...current,
      [name]: value,
      // the api sorts by publishedAt, so keep it aligned with the date input.
      ...(name === "date" ? { publishedAt: value } : {}),
    }));
  }

  function showFeedback(message, isError = false) {
    setFeedback(message);
    setFeedbackError(isError);
  }

  async function saveArticle(event) {
    event.preventDefault();
    const { id, ...payload } = article;

    try {
      const response = await apiRequest(id ? `/news/${id}` : "/news", {
        method: id ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      setArticle(emptyArticle());
      showFeedback(
        `News article ${id ? "updated" : "created"}: ${response.data.title}`,
      );
      newsResource.reload();
    } catch (error) {
      showFeedback(error.message, true);
    }
  }

  async function deleteArticle(id) {
    if (!window.confirm("Delete this news article?")) return;

    try {
      await apiRequest(`/news/${id}`, { method: "DELETE" });
      showFeedback("News article deleted.");
      newsResource.reload();
    } catch (error) {
      showFeedback(error.message, true);
    }
  }

  function editArticle(item) {
    setArticle({ ...item, date: item.publishedAt?.slice(0, 10) || "" });
  }

  return (
    <Panel>
      <h2>{article.id ? "Edit news article" : "New news article"}</h2>
      <Form onSubmit={saveArticle}>
        <label htmlFor="admin-news-title">
          Title
          <input
            id="admin-news-title"
            name="title"
            value={article.title}
            onChange={updateArticle}
            required
          />
        </label>
        <label htmlFor="admin-news-date">
          Published date
          <input
            id="admin-news-date"
            name="date"
            type="date"
            value={article.date}
            onChange={updateArticle}
            required
          />
        </label>
        <label htmlFor="admin-news-category">
          Category
          <input
            id="admin-news-category"
            name="category"
            value={article.category}
            onChange={updateArticle}
            required
          />
        </label>
        <label htmlFor="admin-news-initials">
          Artwork initials
          <input
            id="admin-news-initials"
            name="initials"
            maxLength="4"
            value={article.initials}
            onChange={updateArticle}
            required
          />
        </label>
        <label htmlFor="admin-news-colour">
          Artwork colour
          <input
            id="admin-news-colour"
            name="colour"
            type="color"
            value={article.colour}
            onChange={updateArticle}
            required
          />
        </label>
        <label htmlFor="admin-news-excerpt">
          Excerpt
          <textarea
            id="admin-news-excerpt"
            name="excerpt"
            value={article.excerpt}
            onChange={updateArticle}
            required
          />
        </label>
        <label htmlFor="admin-news-content">
          Article content
          <textarea
            id="admin-news-content"
            name="content"
            value={article.content}
            onChange={updateArticle}
            required
          />
        </label>
        <ButtonRow>
          <button type="submit">
            {article.id ? "Update article" : "Create article"}
          </button>
          {article.id && (
            <SecondaryButton
              type="button"
              onClick={() => setArticle(emptyArticle())}
            >
              Cancel
            </SecondaryButton>
          )}
        </ButtonRow>
      </Form>
      {feedback && (
        <Feedback
          role={feedbackError ? "alert" : "status"}
          $error={feedbackError}
        >
          {feedback}
        </Feedback>
      )}
      <Records>
        {newsResource.data.map((item) => (
          <Record key={item.id}>
            <span>{item.title}</span>
            <ButtonRow>
              <SecondaryButton type="button" onClick={() => editArticle(item)}>
                Edit
              </SecondaryButton>
              <DangerButton
                type="button"
                onClick={() => deleteArticle(item.id)}
              >
                Delete
              </DangerButton>
            </ButtonRow>
          </Record>
        ))}
      </Records>
    </Panel>
  );
}

export default NewsAdminPanel;
