import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Card from '../../components/ui/Card';

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/customer/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const quickStats = [
    {
      title: 'Total Orders',
      value: dashboardData?.totalOrders || 0,
      icon: '📋',
      color: 'bg-blue-500'
    },
    {
      title: 'Cart Items',
      value: dashboardData?.cartCount || 0,
      icon: '🛒',
      color: 'bg-green-500'
    },
    {
      title: 'Wishlist',
      value: dashboardData?.wishlistCount || 0,
      icon: '❤️',
      color: 'bg-red-500'
    },
    {
      title: 'Total Spent',
      value: `$${dashboardData?.totalSpent?.toLocaleString() || '0'}`,
      icon: '💰',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-blue-100">Discover amazing products and great deals</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/customer/products"
              className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-center"
            >
              <div className="text-2xl mb-2">🛍️</div>
              <p className="font-medium text-blue-700">Shop Products</p>
            </Link>
            <Link
              to="/customer/cart"
              className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-center"
            >
              <div className="text-2xl mb-2">🛒</div>
              <p className="font-medium text-green-700">View Cart</p>
            </Link>
            <Link
              to="/customer/orders"
              className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-center"
            >
              <div className="text-2xl mb-2">📋</div>
              <p className="font-medium text-purple-700">My Orders</p>
            </Link>
            <Link
              to="/customer/wishlist"
              className="p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-center"
            >
              <div className="text-2xl mb-2">❤️</div>
              <p className="font-medium text-red-700">Wishlist</p>
            </Link>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {dashboardData?.recentOrders?.length > 0 ? (
              dashboardData.recentOrders.map((order, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Order #{order._id}</p>
                    <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${order.total}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No orders yet</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
