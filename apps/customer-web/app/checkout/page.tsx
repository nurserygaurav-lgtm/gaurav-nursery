import StorefrontLayout from '../components/StorefrontLayout';

export default function CheckoutPage() {
  return (
    <StorefrontLayout>
      <section className="page-shell checkout-layout">
        <div className="checkout-panel">
          <div className="section-title slim-title">
            <div>
              <p className="eyebrow">CHECKOUT</p>
              <h2>Place your order</h2>
            </div>
          </div>

          <div className="form-grid two-col">
            <label>
              Full Name
              <input type="text" defaultValue="Gaurav Sharma" />
            </label>
            <label>
              Mobile Number
              <input type="tel" defaultValue="8160510524" />
            </label>
            <label className="full-span">
              Email
              <input type="email" defaultValue="hello@gauravnursery.in" />
            </label>
            <label className="full-span">
              Address
              <input type="text" defaultValue="24 Green Valley Road" />
            </label>
            <label>
              City
              <input type="text" defaultValue="Delhi" />
            </label>
            <label>
              State
              <input type="text" defaultValue="Delhi" />
            </label>
            <label>
              Pincode
              <input type="text" defaultValue="110001" />
            </label>
          </div>

          <div className="payment-box">
            <h3>Payment Method</h3>
            <div className="radio-row">
              <label><input type="radio" name="payment" defaultChecked /> UPI</label>
              <label><input type="radio" name="payment" /> Card</label>
              <label><input type="radio" name="payment" /> Cash on Delivery</label>
            </div>
          </div>

          <button type="button" className="primary-btn wide-btn">Place Order</button>
        </div>

        <aside className="summary-panel">
          <h3>Order Summary</h3>
          <div className="summary-row"><span>Money Plant</span><strong>₹299</strong></div>
          <div className="summary-row"><span>Snake Plant</span><strong>₹349</strong></div>
          <div className="summary-row subtotal"><span>Subtotal</span><strong>₹648</strong></div>
          <div className="summary-row"><span>Delivery</span><strong>Free</strong></div>
          <div className="summary-row"><span>Discount</span><strong>-₹50</strong></div>
          <div className="summary-row total"><span>Total</span><strong>₹598</strong></div>
        </aside>
      </section>
    </StorefrontLayout>
  );
}
