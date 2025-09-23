import "./Success.css";

import xIcon from "../../assets/xIcon.svg";
import successIcon from "../../assets/successIcon.svg";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Success({ onClose }) {
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      navigate("/productsList");
    }, 500);
  };

  return (
    <div className={`success${isClosing ? " closing" : ""}`} onClick={handleClose}>
      <div className="success-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-success-modal" onClick={handleClose}>
          <img src={xIcon} />
        </button>
        <div className="success-message">
          <img src={successIcon} />
          <div>
            <h1>Congrats!</h1>
            <p>Your order is placed successfully!</p>
          </div>
        </div>
        <button type="button" className="continue-shopping" onClick={handleClose}>
          <p>Continue shopping</p>
        </button>
      </div>
    </div>
  );
}

export default Success;
