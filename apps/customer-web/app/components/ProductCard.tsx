import Link from 'next/link';

export type ProductCardProps = {
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviews?: number;
  discount?: number;
  href?: string;
  tag?: string;
};

export default function ProductCard({
  name,
  image,
  price,
  originalPrice,
  rating = 4.9,
  reviews = 120,
  discount,
  href = '/products/plant',
  tag,
}: ProductCardProps) {
  return (
    <article className="product-tile premium-card">
      <div className="product-image-wrap">
        {tag && <span className="product-tag">{tag}</span>}
        <img src={image} alt={name} />
      </div>

      <div className="product-card-body">
        <div className="rating-line">
          <span>★ {rating}</span>
          <small>({reviews})</small>
        </div>

        <Link href={href} className="product-name-link">
          <h3>{name}</h3>
        </Link>

        <div className="price-row">
          <strong>₹{price.toLocaleString('en-IN')}</strong>
          {originalPrice && <span>₹{originalPrice.toLocaleString('en-IN')}</span>}
          {discount && <em>{discount}% off</em>}
        </div>

        <div className="product-actions">
          <button type="button" className="ghost-button">♡</button>
          <button type="button" className="primary-btn compact-btn">Add to cart</button>
        </div>
      </div>
    </article>
  );
}
