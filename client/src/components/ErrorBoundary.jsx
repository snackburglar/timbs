import { Component } from "react";

import ServerError from "./pages/ServerError";

// Catches unexpected render errors so users receive the designed server-error view.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // switch to the fallback on the next render after a child throws.
    return { hasError: true };
  }

  componentDidCatch(error) {
    // keep a useful trace in the console while showing a friendly page.
    console.error(error.message);
  }

  render() {
    return this.state.hasError ? <ServerError /> : this.props.children;
  }
}

export default ErrorBoundary;
