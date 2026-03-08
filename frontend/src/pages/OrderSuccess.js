import React from "react";

import { Link } from "react-router-dom";

function OrderSuccess() {

  return (

    <div className="dashboard">

      <h2 style={{ color: "green" }}>
        Order Placed Successfully!
      </h2>

      <p>Thank you for your purchase.</p>

      <Link to="/" className="btn">
        Continue Shopping
      </Link>

    </div>

  );

}

export default OrderSuccess;
