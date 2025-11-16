import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function CustomerCart() {
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Wireless Headphones',
      price: 99.99,
      quantity: 2,
      image: '/api/placeholder/150/150'
    },
    {
      id: '2',
      name: 'Smartphone Case',
      price: 29.99,
      quantity: 1,
      image: '/api/placeholder/150/150'
    }
  ]);

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(itemId);
      return;
    }
    
    setCartItems(cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const tax = subtotal * 0.1; // 10% tax
  const shipping = 5.99;
  const total = subtotal + tax + shipping;

  const handleCheckout = () => {
    alert('Redirecting to checkout...');
    // Implement checkout logic
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-gray-600">{cartItems.length} items in your cart</p>
      </div>

      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 text-2xl">📦</span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-green-600 font-bold">${item.price}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 bg-gray-200 text-gray-700 text-sm"
                    >
                      -
                    </Button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <Button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 bg-gray-200 text-gray-700 text-sm"
                    >
                      +
                    </Button>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    <Button
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 text-sm hover:text-red-800"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
              
              <Button
                onClick={handleCheckout}
                className="w-full mt-6 bg-green-600 text-white hover:bg-green-700"
              >
                Proceed to Checkout
              </Button>
            </Card>
          </div>
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6">Add some products to get started</p>
          <Button
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Continue Shopping
          </Button>
        </Card>
      )}
    </div>
  );
}
