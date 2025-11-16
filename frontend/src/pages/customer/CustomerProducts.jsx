import { useState, useEffect } from 'react';
import api from '../../utils/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function CustomerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [priceFilter, setPriceFilter] = useState({ min: '', max: '' });

  useEffect(() => {
    fetchProducts();
  }, [searchTerm, categoryFilter, priceFilter]);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter) params.append('category', categoryFilter);
      if (priceFilter.min) params.append('minPrice', priceFilter.min);
      if (priceFilter.max) params.append('maxPrice', priceFilter.max);

      const response = await api.get(`/customer/products?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    // Mock cart functionality
    console.log('Added to cart:', product.name);
    alert(`${product.name} added to cart!`);
  };

  const addToWishlist = (product) => {
    // Mock wishlist functionality
    console.log('Added to wishlist:', product.name);
    alert(`${product.name} added to wishlist!`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="col-span-1 md:col-span-2"
          />
          
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="home">Home & Garden</option>
            <option value="sports">Sports</option>
          </select>

          <div className="flex gap-2">
            <Input
              placeholder="Min $"
              type="number"
              value={priceFilter.min}
              onChange={(e) => setPriceFilter({...priceFilter, min: e.target.value})}
              className="w-20"
            />
            <Input
              placeholder="Max $"
              type="number"
              value={priceFilter.max}
              onChange={(e) => setPriceFilter({...priceFilter, max: e.target.value})}
              className="w-20"
            />
          </div>
        </div>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <Card key={product._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-12 bg-gray-200">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-4xl">📦</span>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                <p className="text-gray-500 text-sm mb-3">Category: {product.category}</p>
                
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xl font-bold text-green-600">${product.price}</span>
                  <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => addToCart(product)}
                    className="flex-1 bg-blue-600 text-white text-sm py-2 hover:bg-blue-700"
                    disabled={product.stock === 0}
                  >
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                  <Button
                    onClick={() => addToWishlist(product)}
                    className="bg-red-100 text-red-600 hover:bg-red-200 text-sm py-2 px-3"
                  >
                    ❤️
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
            <p className="text-gray-400 mt-2">Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
