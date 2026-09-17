import StorefrontLayout from '../components/StorefrontLayout';

export default function AboutPage() {
  return (
    <StorefrontLayout>
      <section className="page-shell content-page">
        <div className="section-title slim-title">
          <div>
            <p className="eyebrow">OUR STORY</p>
            <h2>Growing greener homes, one plant at a time</h2>
          </div>
        </div>

        <div className="story-layout">
          <img src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80" alt="Gaurav Nursery" />
          <div>
            <h3>Our Mission</h3>
            <p>Gaurav Nursery was created to make healthy, beautiful greenery accessible to every home, balcony and workspace across India. We bring together expert plant care, premium quality, and a friendly shopping experience.</p>
            <p>From air-purifying plants to flowering favorites and planters, every plant is chosen for health, longevity and style.</p>
          </div>
        </div>

        <div className="info-grid four-grid">
          <article className="info-card">
            <h3>Healthy Plants</h3>
            <p>By selecting nursery-grown and carefully monitored plants, we ensure stronger roots and better growth.</p>
          </article>
          <article className="info-card">
            <h3>Sustainable Gardening</h3>
            <p>We encourage greener living with reusable packaging, low-waste delivery and mindful planting advice.</p>
          </article>
          <article className="info-card">
            <h3>Customer First</h3>
            <p>We support every buyer with plant care guidance, order updates and hassle-free service.</p>
          </article>
          <article className="info-card">
            <h3>Quality Promise</h3>
            <p>Each plant is checked before shipping to ensure it meets our quality standards and arrives healthy.</p>
          </article>
        </div>
      </section>
    </StorefrontLayout>
  );
}
