import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "@/App";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";
import { CiShoppingCart } from "react-icons/ci";
import Slider from "react-slick";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Tabs } from "../../components/TabUnderLine";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [filter, setFilter] = useState(null);
  const [error, setError] = useState("");
  const [currentImage, setCurrentImage] = useState(null);
  const [showSlider, setShowSlider] = useState(true);
  const { userAuth, setUserAuth } = useContext(UserContext);
  const navigate = useNavigate();
  const shippingRate = 35000;

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const response = await axios.get(`http://localhost:9999/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 5000,
    autoplaySpeed: 5000,
  };

  const handleQuantityChange = (delta) => {
    const maxQuantity = product.stock;
    setQuantity((prevQuantity) => Math.min(Math.max(1, prevQuantity + delta), maxQuantity));
  };

  const handleQuantityInputChange = (event) => {
    const value = Math.max(1, Math.min(Number(event.target.value), product.stock));
    setQuantity(value);
  };

  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize) {
      setError("Please select a color and a size.");
      return;
    }
    const totalPrice = quantity * product.price;
    const userId = userAuth?.user?.id;
    if (!userId) {
      localStorage.setItem("productSelection", JSON.stringify({ productId: id, selectedColor, selectedSize, quantity }));
      toast.error("Please login to add items to your cart.");
      navigate("/login");
      return;
    }

    const cartItem = {
      productTitle: product.title,
      productId: product.id,
      thumbnail: currentImage || product.images[0],
      color: selectedColor,
      size: selectedSize,
      quantity,
      price: product.price,
    };

    try {
      const response = await axios.post(`http://localhost:9999/carts`, {
        userId,
        cartItem,
        totalPrice,
      });
      if (response.status === 201) {
        toast.success("Product added to cart successfully!");
      } else {
        toast.error("Failed to add product to cart.");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("An error occurred while adding the product to cart.");
    }
  };

  const handleBuyNow = () => {
    const subtotal = (quantity * product.price).toLocaleString("en-US");
    const total = parseFloat(subtotal.replace(/,/g, "")) + shippingRate;
    const userId = userAuth?.user?.id;
    if (!userId) {
      localStorage.setItem("productSelection", JSON.stringify({ productId: id, selectedColor, selectedSize, quantity }));
      toast.error("Please login to add items to your cart.");
      navigate("/login");
      return;
    }

    navigate("/checkout", {
      state: {
        products: [{ ...product, quantity, color: selectedColor, size: selectedSize }],
        subtotal,
        shipping: shippingRate,
        total: total.toLocaleString("en-US"),
      },
    });
  };

  const filteredReviews = filter ? product.reviews.filter((review) => review.rating === filter) : product.reviews;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product image */}
        <div className="flex justify-center items-center">
          <div className="w-2/3">
            {showSlider ? (
              <Slider {...settings}>
                {product.images.map((image, index) => (
                  <div key={index} className="m-5 flex justify-center">
                    <img src={image} alt={`${product.title} - Image ${index + 1}`} className="h-auto rounded-lg" />
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="m-5 flex justify-center">
                <img src={currentImage} alt={product.title} className="w-full h-full rounded-lg" />
              </div>
            )}
          </div>
        </div>

        {/* Product details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-xl text-red-500 font-semibold mb-6">{formatCurrency(product.price)}</p>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (product.rating > i ? <FaStar key={i} className="text-yellow-500" /> : <FaRegStar key={i} className="text-gray-300" />))}
            <span className="text-gray-600 ml-2">({product.rating} rating)</span>
          </div>
          <p className="mb-2">{product.description}</p>
          Color Selection
          <div className="mt-4">
            <span className="text-gray-700 font-bold">Color :</span>
            <select className="border rounded px-4 py-2 ml-2" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
              <option value="" disabled>
                Select Color
              </option>
              {product.colors.map((color, index) => (
                <option key={index} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
          {/* Size Selection */}
          <div className="mt-4">
            <span className="text-gray-700 font-bold">Size :</span>
            <select className="border rounded px-4 py-2 ml-2" value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
              <option value="" disabled>
                Select Size
              </option>
              {product.sizes.map((size, index) => (
                <option key={index} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          {/* Quantity */}
          <div className="mt-4">
            <span className="text-gray-700 font-bold">Quantity :</span>
            <span className="text-gray-600 ml-1">{product.stock} pieces available</span>
            <div className="flex items-center mb-10 mt-2">
              <button onClick={() => handleQuantityChange(-1)} className="px-2 py-1 border rounded-l">
                -
              </button>
              <input type="number" value={quantity} onChange={handleQuantityInputChange} className="w-12 text-center border-t border-b" min="1" max={product.stock} />
              <button onClick={() => handleQuantityChange(1)} className="px-2 py-1 border rounded-r">
                +
              </button>
            </div>
          </div>
          {/* Error */}
          {error && <p className="text-red-500">{error}</p>}
          {/* Add to cart and Buy Now */}
          <div className="flex space-x-4">
            <button className="flex items-center space-x-2 px-10 py-2 border border-black text-black rounded" onClick={handleAddToCart}>
              <CiShoppingCart size={24} />
              <span>Add to Cart</span>
            </button>
            <button className="px-4 py-2 bg-black text-white rounded" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Reviews and Description */}
      <div className="mt-10 grid grid-cols-2 gap-5">
        <div>
          <h2 className="text-2xl font-bold mb-2">Reviews</h2>
          <div className="flex space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setFilter(star)} className={`px-4 py-2 border ${filter === star ? "bg-yellow-500 text-white" : "bg-white text-gray-700"} rounded`}>
                {star} Star{star > 1 && "s"}
              </button>
            ))}
            <button onClick={() => setFilter(null)} className={`px-4 py-2 border ${filter === null ? "bg-yellow-500 text-white" : "bg-white text-gray-700"} rounded`}>
              All
            </button>
          </div>
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review, index) => (
              <div key={index} className="border-b py-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (review.rating > i ? <FaStar key={i} className="text-yellow-500" /> : <FaRegStar key={i} className="text-gray-300" />))}
                  <span className="ml-2 text-gray-600">- {review.comment}</span>
                </div>
              </div>
            ))
          ) : (
            <p>No reviews found.</p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-2">Product Details</h2>
          <Tabs>
            <div label="General">
              <div className="mb-4">
                <span className="font-bold">Brand:</span> {product.brand.name}
              </div>
              <div className="mb-4">
                <span className="font-bold">Category:</span> {product.category.name}
              </div>
              <div className="mb-4">
                <span className="font-bold">Type:</span> {product.type.name}
              </div>
            </div>
            <div label="Technical Details">
              <p>{/* Technical details content here */}</p>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
