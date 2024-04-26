import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { addToCart } from "../redux/reducer/cartReducer";
import { server } from "../redux/store";
import { CartItem } from "../types/types";

interface Product {
  name: string;
  photo: string;
  price: number;
  productId: string;
  stock: number;
  quantity: number;
}

const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>(); // Use useParams hook to get productId
  const [productInfo, setProductInfo] = useState<Product | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`${server}/api/v1/product/${productId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch product details");
        }
        const responseData: Product = await response.json();
        const productData: Product = responseData.product;
        setProductInfo(productData);
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast.error("Failed to fetch product details");
      }
    };

    fetchProductDetails();
  }, [productId]);

  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to cart");
  };

  return (
    <div className="container">
      {productInfo ? (
        <main className="productdetails">
          <div className="product-img">
            <img src={`${server}/${productInfo.photo}`} alt="productimg" />
          </div>
          <div className="product-info">
            <h1>{productInfo.name}</h1>
            <h2>₹{productInfo.price}</h2>
            <button
              onClick={() =>
                addToCartHandler({
                  productId: productInfo.productId,
                  photo: productInfo.photo,
                  quantity: productInfo.quantity,
                  price: productInfo.price,
                  stock: productInfo.stock,
                  name: productInfo.name,
                })
              }
            >
              Add to Cart
            </button>
          </div>
        </main>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProductDetails;
