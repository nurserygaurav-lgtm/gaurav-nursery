import { Component } from 'react';
import Button from '../ui/Button.jsx';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error(error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <section className="mx-auto max-w-2xl px-4 py-20 text-center">
          <h1 className="text-3xl font-black text-leaf-900">Something went wrong</h1>
          <p className="mt-3 text-stone-600">Please refresh the page and try again.</p>
          <Button className="mt-6" onClick={() => window.location.reload()} type="button">
            Refresh
          </Button>
        </section>
      );
    }

    return this.props.children;
  }
}
