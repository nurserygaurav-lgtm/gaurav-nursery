import StorefrontLayout from '../components/StorefrontLayout';

export default function RegisterPage() {
  return (
    <StorefrontLayout showHeaderSearch={false}>
      <section className="page-shell auth-shell">
        <div className="auth-box">
          <p className="eyebrow">NEW HERE</p>
          <h2>Create a Gaurav Nursery account</h2>
          <form className="form-grid two-col">
            <label>
              Full Name
              <input type="text" placeholder="Your name" />
            </label>
            <label>
              Mobile
              <input type="tel" placeholder="8160510524" defaultValue="8160510524" />
            </label>
            <label className="full-span">
              Email
              <input type="email" placeholder="you@example.com" />
            </label>
            <label className="full-span">
              Password
              <input type="password" placeholder="Create password" />
            </label>
            <label className="full-span">
              Confirm Password
              <input type="password" placeholder="Repeat password" />
            </label>
            <button type="button" className="primary-btn wide-btn">Create Account</button>
          </form>
          <p className="auth-switch">Already have an account? <a href="/login">Login</a></p>
        </div>
      </section>
    </StorefrontLayout>
  );
}
