import { useEffect, useState } from "react";
import { getSomeProduct } from "../api/products.api";

export function ProductDetail() {
    const [product, setProduct] = useState(null);

    useEffect(() => {
        getSomeProduct(1)
            .then(data => setProduct(data))
            .catch(error => console.error(error));
    }, []);

    if (!product) {
        return <div>Loading...</div>;
    }

    return <div>{product.name}</div>;    
}