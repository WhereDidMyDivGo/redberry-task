import "./Cart.css";

function Cart({ onClose }) {
  return (
    <div className="cart" onClick={onClose}>
      <div className="cart-content" onClick={(e) => e.stopPropagation()}>

      </div>
    </div>
  );
}

export default Cart;
