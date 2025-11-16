import { useState, useEffect } from 'react';
import api from '../../utils/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const response = await api.get('/admin/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const response = await api.put(`/admin/orders/${orderId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
        <p className="text-gray-600">Manage customer orders and track shipments</p>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.length > 0 ? (
          orders.map((order) => (
            <Card key={order._id} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="text-lg font-semibold">Order #{order._id}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Customer:</span> {order.customerName}
                    </div>
                    <div>
                      <span className="font-medium">Total:</span> ${order.total}
                    </div>
                    <div>
                      <span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 lg:mt-0">
                  {order.status === 'pending' && (
                    <Button
                      onClick={() => updateOrderStatus(order._id, 'processing')}
                      className="bg-blue-600 text-white text-sm px-3 py-1"
                    >
                      Process
                    </Button>
                  )}
                  
                  {order.status === 'processing' && (
                    <Button
                      onClick={() => updateOrderStatus(order._id, 'shipped')}
                      className="bg-purple-600 text-white text-sm px-3 py-1"
                    >
                      Ship
                    </Button>
                  )}
                  
                  {order.status === 'shipped' && (
                    <Button
                      onClick={() => updateOrderStatus(order._id, 'completed')}
                      className="bg-green-600 text-white text-sm px-3 py-1"
                    >
                      Complete
                    </Button>
                  )}
                  
                  <Button className="bg-gray-600 text-white text-sm px-3 py-1">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-500 text-lg">No orders found</p>
            <p className="text-gray-400 mt-2">Orders will appear here once customers place them</p>
          </Card>
        )}
      </div>
    </div>
  );
}
