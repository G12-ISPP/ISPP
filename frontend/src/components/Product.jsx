import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getSomeProduct } from "../api/products.api";

export function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    getSomeProduct(id)
      .then((data) => setProduct(data))
      .catch((error) => console.error(error));
  }, [id]);
  console.log("product", product);
  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>{product.name}</h2>
      <img src={product.image} alt={product.name} />
      <p>{product.description}</p>
      <p>Price: {product.price}</p>
    </div>
  );
}