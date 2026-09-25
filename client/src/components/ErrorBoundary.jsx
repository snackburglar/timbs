import { Component } from "react";

import ServerError from "./pages/ServerError";

// Catches unexpected render errors so users receive the designed server-error view.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error(error.message);
  }

  render() {
    return this.state.hasError ? <ServerError /> : this.props.children;
  }
}

export default ErrorBoundary;
