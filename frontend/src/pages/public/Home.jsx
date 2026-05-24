export default function Home() {
  // Stabilization-only: homepage must not import HomePremium in production.
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Arial' }}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800 }}>Home</h1>
      <p style={{ marginTop: 12, color: '#444' }}>Content is temporarily disabled to prevent production crashes.</p>
    </div>
  );
}


