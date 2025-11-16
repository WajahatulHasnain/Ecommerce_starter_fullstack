import { useState, useEffect } from 'react';
import Card from '../../components/ui/Card';

export default function AdminAnalytics() {
  const [analyticsData, setAnalyticsData] = useState({
    salesOverview: {
      totalSales: 45280,
      totalOrders: 1247,
      averageOrderValue: 89.50,
      conversionRate: 3.2
    },
    topProducts: [
      { name: 'Wireless Headphones', sales: 234, revenue: 23400 },
      { name: 'Smartphone Case', sales: 189, revenue: 5670 },
      { name: 'USB Cable', sales: 167, revenue: 2505 }
    ],
    customerMetrics: {
      newCustomers: 89,
      returningCustomers: 156,
      customerLifetimeValue: 340.50
    }
  });

  const MetricCard = ({ title, value, subtitle, trend }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
          </div>
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-600">Track your business performance and insights</p>
      </div>

      {/* Sales Overview */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Sales Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Sales"
            value={`$${analyticsData.salesOverview.totalSales.toLocaleString()}`}
            trend={12.5}
          />
          <MetricCard
            title="Total Orders"
            value={analyticsData.salesOverview.totalOrders.toLocaleString()}
            trend={8.2}
          />
          <MetricCard
            title="Average Order Value"
            value={`$${analyticsData.salesOverview.averageOrderValue}`}
            trend={-2.1}
          />
          <MetricCard
            title="Conversion Rate"
            value={`${analyticsData.salesOverview.conversionRate}%`}
            trend={5.3}
          />
        </div>
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Sales Chart</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">📊 Sales Chart Placeholder</p>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Orders Trend</h3>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">📈 Orders Trend Placeholder</p>
          </div>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Product Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Units Sold</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Revenue</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.topProducts.map((product, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-900">{product.name}</td>
                  <td className="py-3 px-4 text-gray-600">{product.sales}</td>
                  <td className="py-3 px-4 text-gray-600">${product.revenue.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{width: `${(product.sales / 250) * 100}%`}}
                      ></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Customer Metrics */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="New Customers"
            value={analyticsData.customerMetrics.newCustomers}
            subtitle="This month"
            trend={15.3}
          />
          <MetricCard
            title="Returning Customers"
            value={analyticsData.customerMetrics.returningCustomers}
            subtitle="This month"
            trend={7.8}
          />
          <MetricCard
            title="Customer LTV"
            value={`$${analyticsData.customerMetrics.customerLifetimeValue}`}
            subtitle="Average"
            trend={4.2}
          />
        </div>
      </div>
    </div>
  );
}
