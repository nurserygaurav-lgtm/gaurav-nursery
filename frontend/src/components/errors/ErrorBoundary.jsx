import { Component } from 'react';

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
        <section className="flex min-h-screen items-center justify-center bg-[#f7faf5] px-4 py-12">
          <div className="mx-auto w-full max-w-2xl rounded-[2rem] border border-[#dbe8d8] bg-white px-6 py-10 text-center shadow-card sm:px-10 sm:py-12">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#4caf50]">Gaurav Nursery</p>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-[#0b3d1e] sm:text-4xl">Storefront loading safely</h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-stone-600">
              One of the live sections hit a runtime issue, so we are showing a safe fallback page instead of a blank crash screen.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a className="inline-flex items-center justify-center rounded-full bg-[#0b3d1e] px-5 py-3 text-sm font-black text-white transition hover:bg-[#4caf50]" href="/">
                Home
              </a>
              <a className="inline-flex items-center justify-center rounded-full border border-[#dbe8d8] bg-white px-5 py-3 text-sm font-black text-[#0b3d1e] transition hover:bg-[#f4fbf5]" href="/shop">
                Shop
              </a>
              <a className="inline-flex items-center justify-center rounded-full border border-[#dbe8d8] bg-white px-5 py-3 text-sm font-black text-[#0b3d1e] transition hover:bg-[#f4fbf5]" href="/login">
                Login
              </a>
              <a className="inline-flex items-center justify-center rounded-full border border-[#dbe8d8] bg-white px-5 py-3 text-sm font-black text-[#0b3d1e] transition hover:bg-[#f4fbf5]" href="/support">
                Support
              </a>
            </div>

            <button
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#f1faf1] px-5 py-3 text-sm font-black text-[#0b3d1e] transition hover:bg-[#e6f5e6]"
              onClick={() => window.location.reload()}
              type="button"
            >
              Refresh page
            </button>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
