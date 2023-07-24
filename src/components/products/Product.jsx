import axios from "axios";
import React, { useEffect, useState } from "react";

const Product = () => {
  let [porduct, setProduct] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/allProducts", {
        withCredentials: true,
        headers: {
          "Content-type": "application/json",
        },
      })
      .then((rep) => {
        console.log(rep.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);
  return <div>Product</div>;
};

export default Product;
