import React from 'react';

const highlights = ['Fresh nursery plants', 'Safe packaging', 'Delivery support', 'Plant care guidance'];

const categories = [
  { title: 'Indoor Plants', text: 'Low-maintenance greenery for homes and workspaces.' },
  { title: 'Flowering Plants', text: 'Colorful picks that brighten balconies and gardens.' },
  { title: 'Fruit Plants', text: 'Grow edible plants with seasonal varieties.' },
  { title: 'Seeds & Saplings', text: 'Start small and build a healthy garden over time.' }
];

const steps = [
  'Browse the nursery catalog',
  'Choose healthy plants and bundles',
  'Get careful packing and delivery',
  'Receive support after arrival'
];

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #eff8ea 0%, #f8fbf5 36%, #ffffff 100%)',
        color: '#12321b',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 20,
          backdropFilter: 'blur(12px)',
          background: 'rgba(248, 251, 245, 0.88)',
          borderBottom: '1px solid rgba(217, 234, 213, 0.9)'
        }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 900, letterSpacing: '0.16em', color: '#2f6d38' }}>
              GAURAV NURSERY
            </div>
            <div style={{ marginTop: 4, fontSize: 12, color: '#5a6f61' }}>Fresh plants, safe delivery, real support</div>
          </div>
          <nav style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <a href="#catalog" style={navLinkStyle}>Catalog</a>
            <a href="#process" style={navLinkStyle}>How it works</a>
            <a href="#support" style={navLinkStyle}>Support</a>
          </nav>
        </div>
      </header>

      <section
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '42px 24px 24px'
        }}
      >
        <div
          style={{
            display: 'grid',
            gap: 24,
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'stretch',
            background: '#ffffff',
            borderRadius: 32,
            padding: 28,
            boxShadow: '0 20px 50px rgba(18, 50, 27, 0.08)',
            border: '1px solid #d9ead5'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span
              style={{
                margin: 0,
                display: 'inline-flex',
                width: 'fit-content',
                padding: '8px 14px',
                borderRadius: 999,
                background: '#e4f4df',
                color: '#2f6d38',
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: '0.14em',
                textTransform: 'uppercase'
              }}
            >
              Gaurav Nursery
            </span>

            <h1
              style={{
                margin: '18px 0 12px',
                fontSize: 'clamp(2.2rem, 5.5vw, 4.8rem)',
                lineHeight: 0.96,
                letterSpacing: '-0.05em',
                maxWidth: 680
              }}
            >
              Fresh plants for homes, balconies, and gardens.
            </h1>

            <p
              style={{
                margin: 0,
                maxWidth: 620,
                fontSize: 'clamp(1rem, 1.2vw, 1.15rem)',
                lineHeight: 1.75,
                color: '#4a6250'
              }}
            >
              Discover healthy nursery stock, careful packaging, and helpful support so your plants arrive ready to grow.
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                marginTop: 24
              }}
            >
              <a href="#catalog" style={primaryButtonStyle}>
                Browse Catalog
              </a>
              <a href="#support" style={secondaryButtonStyle}>
                Get Support
              </a>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 10,
                marginTop: 22
              }}
            >
              {highlights.map((item) => (
                <span key={item} style={pillStyle}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gap: 14,
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              alignContent: 'center'
            }}
          >
            {categories.map((card) => (
              <article
                key={card.title}
                style={cardStyle}
              >
                <h2 style={{ margin: 0, fontSize: 22, color: '#12321b' }}>{card.title}</h2>
                <p style={{ margin: '10px 0 0', lineHeight: 1.65, color: '#51665a', fontSize: 15 }}>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="catalog" style={sectionShell}>
        <SectionHeading
          eyebrow="Catalog"
          title="Easy categories to start browsing"
          text="A clean overview that makes it simple to explore the most common plant types."
        />
        <div
          style={{
            display: 'grid',
            gap: 18,
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))'
          }}
        >
          {categories.map((card) => (
            <article key={card.title} style={featureCardStyle}>
              <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: '0.14em', color: '#2f6d38', textTransform: 'uppercase' }}>
                Category
              </div>
              <h3 style={{ margin: '10px 0 0', fontSize: 24 }}>{card.title}</h3>
              <p style={{ margin: '10px 0 0', lineHeight: 1.7, color: '#51665a' }}>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="process" style={{ ...sectionShell, paddingBottom: 24 }}>
        <SectionHeading
          eyebrow="How it works"
          title="Simple steps from nursery to doorstep"
          text="The page now points to the correct sections and keeps the experience easy to follow."
        />
        <div
          style={{
            display: 'grid',
            gap: 18,
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))'
          }}
        >
          {steps.map((step, index) => (
            <article key={step} style={{ ...featureCardStyle, background: index % 2 === 0 ? '#ffffff' : '#f5fbf2' }}>
                <div style={stepNumberStyle}>{index + 1}</div>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700, lineHeight: 1.5 }}>{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="support" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px 72px' }}>
        <div
          style={{
            display: 'grid',
            gap: 20,
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))'
          }}
        >
          <article style={featureCardStyle}>
            <h3 style={{ margin: 0, fontSize: 22 }}>Why customers choose us</h3>
            <p style={{ margin: '12px 0 0', lineHeight: 1.7, color: '#51665a' }}>
              We focus on fresh stock, careful handling, and simple support that helps every order land well.
            </p>
          </article>

          <article style={{ ...featureCardStyle, background: '#12321b', color: '#ffffff' }}>
            <h3 style={{ margin: 0, fontSize: 22 }}>Need help now?</h3>
            <p style={{ margin: '12px 0 0', lineHeight: 1.7, color: '#d3e7d2' }}>
              Use the support area on this page for order help, plant suggestions, and delivery questions.
            </p>
          </article>

          <article style={featureCardStyle}>
            <h3 style={{ margin: 0, fontSize: 22 }}>Ready to move forward?</h3>
            <p style={{ margin: '12px 0 0', lineHeight: 1.7, color: '#51665a' }}>
              Jump back to the catalog section and continue exploring the nursery layout from there.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

function SectionHeading({ eyebrow, title, text }) {
  return (
    <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 24px' }}>
      <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: '0.24em', color: '#2f6d38', textTransform: 'uppercase' }}>
        {eyebrow}
      </div>
      <h2 style={{ margin: '12px 0 0', fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', lineHeight: 1.1 }}>
        {title}
      </h2>
      <p style={{ margin: '12px auto 0', lineHeight: 1.7, color: '#51665a', maxWidth: 680 }}>
        {text}
      </p>
    </div>
  );
}

const navLinkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 40,
  padding: '0 16px',
  borderRadius: 999,
  background: '#f4faf0',
  color: '#12321b',
  textDecoration: 'none',
  fontWeight: 800,
  border: '1px solid #dfeedd'
};

const primaryButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 48,
  padding: '0 20px',
  borderRadius: 999,
  background: '#12321b',
  color: '#ffffff',
  textDecoration: 'none',
  fontWeight: 800
};

const secondaryButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 48,
  padding: '0 20px',
  borderRadius: 999,
  background: '#eef7ea',
  color: '#12321b',
  textDecoration: 'none',
  fontWeight: 800,
  border: '1px solid #d9ead5'
};

const pillStyle = {
  padding: '10px 14px',
  borderRadius: 999,
  background: '#f5faf3',
  border: '1px solid #dfeedd',
  color: '#35583a',
  fontSize: 13,
  fontWeight: 700
};

const cardStyle = {
  background: 'linear-gradient(180deg, #f7fff4 0%, #ffffff 100%)',
  borderRadius: 24,
  padding: 20,
  border: '1px solid #d9ead5',
  boxShadow: '0 14px 28px rgba(18, 50, 27, 0.05)',
  minHeight: 156
};

const sectionShell = {
  maxWidth: 1180,
  margin: '0 auto',
  padding: '34px 24px 48px'
};

const featureCardStyle = {
  background: '#ffffff',
  borderRadius: 24,
  padding: 24,
  border: '1px solid #d9ead5',
  boxShadow: '0 16px 36px rgba(18, 50, 27, 0.05)'
};

const stepNumberStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  marginBottom: 14,
  borderRadius: 999,
  background: '#12321b',
  color: '#ffffff',
  fontWeight: 900
};
