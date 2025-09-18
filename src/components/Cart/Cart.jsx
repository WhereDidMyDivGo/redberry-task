import "./Cart.css";

function Cart({ onClose }) {
  return (
    <div className="cart" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}></div>
    </div>
  );
}

export default Cart;
