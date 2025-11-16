import { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function CustomerWishlist() {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: '1',
      name: 'Gaming Laptop',
      price: 1299.99,
      category: 'Electronics',
      inStock: true,
      image: '/api/placeholder/200/200'
    },
    {
      id: '2',
      name: 'Running Shoes',
      price: 129.99,
      category: 'Sports',
      inStock: false,
      image: '/api/placeholder/200/200'
    },
    {
      id: '3',
      name: 'Coffee Maker',
      price: 89.99,
      category: 'Home',
      inStock: true,
      image: '/api/placeholder/200/200'
    }
  ]);

  const removeFromWishlist = (itemId) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
  };

  const addToCart = (item) => {
    alert(`${item.name} added to cart!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
        <p className="text-gray-600">{wishlistItems.length} items saved for later</p>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-4xl">📦</span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-gray-500 text-sm mb-2">{item.category}</p>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold text-green-600">${item.price}</span>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    item.inStock 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => addToCart(item)}
                    className="flex-1 bg-blue-600 text-white text-sm py-2 hover:bg-blue-700"
                    disabled={!item.inStock}
                  >
                    {item.inStock ? 'Add to Cart' : 'Notify Me'}
                  </Button>
                  <Button
                    onClick={() => removeFromWishlist(item.id)}
                    className="bg-red-100 text-red-600 hover:bg-red-200 text-sm py-2 px-3"
                  >
                    🗑️
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-600 mb-6">Save items you love for easy shopping later</p>
          <Button
            onClick={() => window.location.href = '/customer/products'}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Browse Products
          </Button>
        </Card>
      )}
    </div>
  );
}
