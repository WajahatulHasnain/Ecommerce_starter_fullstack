import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function Home() {
  const [msg, setMsg] = useState("Loading...");
  useEffect(() => {
    axios.get("http://localhost:5000/")
      .then(res => setMsg(res.data))
      .catch(() => setMsg("Backend not reachable"));
  }, []);
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-blue-600">Ecommerce</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your one-stop destination for amazing products and seamless shopping experience
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/select-role">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg">Shop Now</Button>
          </Link>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card className="text-center p-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
          <p className="text-gray-600">Quick and reliable shipping to your doorstep</p>
        </Card>
        
        <Card className="text-center p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Products</h3>
          <p className="text-gray-600">Carefully curated products from trusted brands</p>
        </Card>
        
        <Card className="text-center p-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.5a9.5 9.5 0 11-9.5 9.5 9.5-9.5 0 019.5-9.5z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">24/7 Support</h3>
          <p className="text-gray-600">Round-the-clock customer service support</p>
        </Card>
      </div>
      
      <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
        <p className="text-xl mb-6 opacity-90">Join thousands of satisfied customers</p>
        <div className="flex justify-center gap-4">
          <Link to="/login">
            <Button variant="outline" className="bg-white text-blue-600 hover:bg-gray-100">
              Customer Login
            </Button>
          </Link>
          <Link to="/admin/login">
            <Button variant="outline" className="bg-white text-purple-600 hover:bg-gray-100">
              Admin Login
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
