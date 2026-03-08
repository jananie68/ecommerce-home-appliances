import React from "react";

function Categories() {

  return (

    <div style={{ padding: "30px" }}>

      <h2 style={{ textAlign: "center" }}>
        Categories
      </h2>

      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        marginTop: "20px"
      }}>

        <div className="card">Refrigerators</div>
        <div className="card">Washing Machines</div>
        <div className="card">Televisions</div>
        <div className="card">Microwaves</div>

      </div>

    </div>

  );

}

export default Categories;
