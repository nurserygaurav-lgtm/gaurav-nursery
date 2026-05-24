import React from 'react';

const highlights = [
  'Fresh nursery plants',
  'Safe packaging',
  'Delivery support',
  'Plant care guidance'
];

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
        background:
          'linear-gradient(180deg, #f4fbf2 0%, #eff8eb 36%, #ffffff 100%)',
        color: '#12321b',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <section
        id="hero"
        style={{
          maxWidth: 1120,
          margin: '0 auto',
          padding: '72px 24px 40px'
        }}
      >
        <div
          style={{
            display: 'grid',
            gap: 24,
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            alignItems: 'center',
            background: '#ffffff',
            borderRadius: 28,
            padding: 28,
            boxShadow: '0 20px 50px rgba(18, 50, 27, 0.08)',
            border: '1px solid #d9ead5'
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                display: 'inline-block',
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
            </p>
            <h1
              style={{
                margin: '18px 0 12px',
                fontSize: 'clamp(2.4rem, 6vw, 4.8rem)',
                lineHeight: 0.95,
                letterSpacing: '-0.04em'
              }}
            >
              Fresh plants for homes, balconies, and gardens.
            </h1>
            <p
              style={{
                margin: 0,
                maxWidth: 620,
                fontSize: 18,
                lineHeight: 1.7,
                color: '#4a6250'
              }}
            >
              Discover healthy nursery stock, careful packaging, and helpful support
              so your plants arrive ready to grow.
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                marginTop: 24
              }}
            >
              <a
                href="#categories"
                style={{
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
                }}
              >
                Shop Now
              </a>
              <a
                href="#contact"
                style={{
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
                }}
              >
                Contact Support
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
                <span
                  key={item}
                  style={{
                    padding: '10px 14px',
                    borderRadius: 999,
                    background: '#f5faf3',
                    border: '1px solid #dfeedd',
                    color: '#35583a',
                    fontSize: 13,
                    fontWeight: 700
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gap: 14,
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'
            }}
          >
            {categories.map((card) => (
              <article
                key={card.title}
                style={{
                  background: 'linear-gradient(180deg, #f7fff4 0%, #ffffff 100%)',
                  borderRadius: 24,
                  padding: 20,
                  border: '1px solid #d9ead5',
                  boxShadow: '0 14px 28px rgba(18, 50, 27, 0.05)',
                  minHeight: 156
                }}
              >
                <h2 style={{ margin: 0, fontSize: 22, color: '#12321b' }}>{card.title}</h2>
                <p
                  style={{
                    margin: '10px 0 0',
                    lineHeight: 1.65,
                    color: '#51665a',
                    fontSize: 15
                  }}
                >
                  {card.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="support" style={{ maxWidth: 1120, margin: '0 auto', padding: '0 24px 72px' }}>
        <div
          style={{
            display: 'grid',
            gap: 20,
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))'
          }}
        >
          <article
            id="contact"
            style={{
              background: '#ffffff',
              borderRadius: 24,
              padding: 24,
              border: '1px solid #d9ead5',
              boxShadow: '0 16px 36px rgba(18, 50, 27, 0.05)'
            }}
          >
            <h3 style={{ margin: 0, fontSize: 22 }}>Why customers choose us</h3>
            <p style={{ margin: '12px 0 0', lineHeight: 1.7, color: '#51665a' }}>
              We focus on fresh stock, careful handling, and simple support that helps
              every order land well.
            </p>
          </article>

          <article
            id="categories"
            style={{
              background: '#12321b',
              color: '#ffffff',
              borderRadius: 24,
              padding: 24,
              boxShadow: '0 16px 36px rgba(18, 50, 27, 0.12)'
            }}
          >
            <h3 style={{ margin: 0, fontSize: 22 }}>How it works</h3>
            <ol style={{ margin: '14px 0 0', paddingLeft: 20, lineHeight: 1.8 }}>
              {steps.map((step) => (
                <li key={step} style={{ marginBottom: 6 }}>
                  {step}
                </li>
              ))}
            </ol>
          </article>

          <article
            style={{
              background: '#ffffff',
              borderRadius: 24,
              padding: 24,
              border: '1px solid #d9ead5',
              boxShadow: '0 16px 36px rgba(18, 50, 27, 0.05)'
            }}
          >
            <h3 style={{ margin: 0, fontSize: 22 }}>Need help now?</h3>
            <p style={{ margin: '12px 0 0', lineHeight: 1.7, color: '#51665a' }}>
              Use the contact section above for order help, plant suggestions, and
              delivery questions.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
