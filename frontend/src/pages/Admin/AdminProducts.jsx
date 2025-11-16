import { useState, useEffect } from 'react';
import api from '../../utils/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const response = await api.get('/admin/products', {
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

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const response = await api.post('/admin/products', newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setProducts([response.data.data, ...products]);
        setNewProduct({ name: '', description: '', price: '', category: '', stock: '', image: '' });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value
    });
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
          <p className="text-gray-600">Manage your product catalog</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          Add New Product
        </Button>
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Add New Product</h3>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              name="name"
              value={newProduct.name}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Category"
              name="category"
              value={newProduct.category}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Price ($)"
              name="price"
              type="number"
              step="0.01"
              value={newProduct.price}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Stock Quantity"
              name="stock"
              type="number"
              value={newProduct.stock}
              onChange={handleInputChange}
              required
            />
            <div className="md:col-span-2">
              <Input
                label="Description"
                name="description"
                value={newProduct.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="md:col-span-2">
              <Input
                label="Image URL"
                name="image"
                type="url"
                value={newProduct.image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="md:col-span-2 flex gap-4">
              <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">
                Add Product
              </Button>
              <Button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-gray-600 text-white hover:bg-gray-700"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Products List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product) => (
            <Card key={product._id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <span className="text-xl font-bold text-green-600">${product.price}</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{product.description}</p>
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <span>Category: {product.category}</span>
                <span>Stock: {product.stock}</span>
              </div>
              <div className="flex gap-2">
                <Button className="bg-blue-600 text-white text-sm px-3 py-1">
                  Edit
                </Button>
                <Button className="bg-red-600 text-white text-sm px-3 py-1">
                  Delete
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
            <p className="text-gray-400 mt-2">Add your first product to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
