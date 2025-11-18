'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, RefreshCw, X, CheckCircle, XCircle, Clock, AlertTriangle, Globe } from 'lucide-react';

export default function OrderBook() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [language, setLanguage] = useState('english');
  const [filter, setFilter] = useState('all');

  const rejectionRoasts = {
    english: {
      'Insufficient funds': [
        "💸 Broke alert! Your wallet said 'Nope!'",
        "😭 Poor you! Can't afford this trade!",
        "🚫 Insufficient funds! Time to rob a bank? (Don't!)",
        "💀 Bankrupt! Go ask mama for money!",
        "😅 Your balance laughed and rejected this!"
      ],
      'RMS:Margin Exceeds': [
        "📊 Too greedy! Risk management said NO!",
        "⚠️ Overconfident much? Margin exceeded!",
        "🎲 Gambling alert! Risk too high!",
        "😬 Easy tiger! Can't bet the farm!"
      ],
      'Invalid price': [
        "🤡 What price is that? Are you drunk?",
        "😂 Invalid price! Did you randomly type?",
        "🎪 Circus prices not allowed!",
        "🤔 Brain.exe has stopped working?"
      ],
      'Market closed': [
        "😴 Market is sleeping! Come back tomorrow!",
        "🌙 Too late! Market went home!",
        "⏰ Wrong time buddy! Market hours exist!",
        "🛌 Everyone's sleeping except you!"
      ],
      'Quantity exceeds': [
        "🐘 That's too much! Start smaller!",
        "😱 Quantity limit reached! Calm down!",
        "🏋️ Too heavy! Reduce the load!",
        "🎯 Aim smaller! Baby steps!"
      ],
      'Order already exists': [
        "🤦 Déjà vu! You already placed this!",
        "🔄 Duplicate! Check before clicking!",
        "😵 Order exists! Pay attention!",
        "🙄 Again? Stop spamming orders!"
      ],
      'Circuit limit': [
        "🎢 Circuit hit! Stock went crazy!",
        "🚨 Circuit breaker! Too volatile!",
        "⚡ Zapped! Circuit limit reached!",
        "🌪️ Stock went wild! Paused!"
      ],
      default: [
        "❌ Order rejected! Better luck next time!",
        "😔 Nope! Market said no to you!",
        "🚫 Rejected! Life is tough!",
        "💔 Heartbreak! Order didn't go through!",
        "😞 Sorry! This wasn't meant to be!"
      ]
    },
    hindi: {
      'Insufficient funds': [
        "💸 Paisa nahi hai! Bhikari ho kya?",
        "😭 Gareeb! Paise khatam ho gaye!",
        "🚫 Balance kam! Ghar se mango paisa!",
        "💀 Khali wallet! Kuch bech ke aao!",
        "😅 Balance ne reject kar diya!"
      ],
      'RMS:Margin Exceeds': [
        "📊 Zyada risk! Margin nahi hai!",
        "⚠️ Overconfident! Limit exceed!",
        "🎲 Jua mat khelo! Risk zyada!",
        "😬 Sambhal ke! Itna nahi kar sakte!"
      ],
      'Invalid price': [
        "🤡 Ye kya price hai? Pagal ho?",
        "😂 Invalid! Random number daal diya?",
        "🎪 Circus price! Theek se daalo!",
        "🤔 Dimaag kharab ho gaya?"
      ],
      'Market closed': [
        "😴 Market band hai! Kal aao!",
        "🌙 Late ho gaye! Market so gayi!",
        "⏰ Galat time! Hours dekho!",
        "🛌 Sab so gaye, tum jaag rahe!"
      ],
      'Quantity exceeds': [
        "🐘 Bahut zyada! Kam karo!",
        "😱 Limit cross! Thoda kam!",
        "🏋️ Bharosa! Weight kam karo!",
        "🎯 Chhota aim rakho!"
      ],
      'Order already exists': [
        "🤦 Phir se! Pehle daal chuke!",
        "🔄 Duplicate! Check kar pehle!",
        "😵 Exist karta! Dhyan se!",
        "🙄 Phirse? Spam mat karo!"
      ],
      'Circuit limit': [
        "🎢 Circuit lag gayi! Stock pagal!",
        "🚨 Circuit! Bahut volatile!",
        "⚡ Zapp! Limit touch!",
        "🌪️ Stock wild! Ruk gaya!"
      ],
      default: [
        "❌ Reject! Next time!",
        "😔 Nahi hua! Market bola no!",
        "🚫 Reject! Life hard hai!",
        "💔 Toot gaya dil! Nahi hua!",
        "😞 Sorry! Kismat kharab!"
      ]
    }
  };

  useEffect(() => {
    const apiKey = localStorage.getItem('kite_api_key');
    const accessToken = localStorage.getItem('kite_access_token');
    const name = localStorage.getItem('kite_user_name');
    const savedLanguage = localStorage.getItem('kite_language');

    if (!apiKey || !accessToken) {
      router.push('/login');
      return;
    }

    setUserName(name || 'Trader');
    if (savedLanguage) setLanguage(savedLanguage);
    fetchOrders(apiKey, accessToken);
  }, [router]);

  const fetchOrders = async (apiKey, accessToken) => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, accessToken })
      });

      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    const newLang = language === 'english' ? 'hindi' : 'english';
    setLanguage(newLang);
    localStorage.setItem('kite_language', newLang);
  };

  const getRejectionRoast = (statusMessage) => {
    const roasts = rejectionRoasts[language];
    
    for (const [key, messages] of Object.entries(roasts)) {
      if (statusMessage?.toLowerCase().includes(key.toLowerCase())) {
        return messages[Math.floor(Math.random() * messages.length)];
      }
    }
    
    return roasts.default[Math.floor(Math.random() * roasts.default.length)];
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const refreshOrders = () => {
    const apiKey = localStorage.getItem('kite_api_key');
    const accessToken = localStorage.getItem('kite_access_token');
    fetchOrders(apiKey, accessToken);
  };

  const getText = (key) => {
    const texts = {
      greeting: language === 'hindi' ? `Namaste, ${userName}! 🙏` : `Hello, ${userName}! 👋`,
      dashboard: language === 'hindi' ? 'Dashboard' : 'Dashboard',
      holdings: language === 'hindi' ? 'Holdings' : 'Holdings',
      marketWatch: language === 'hindi' ? 'Market Watch' : 'Market Watch',
      orderBook: language === 'hindi' ? 'Order Book' : 'Order Book',
      logout: language === 'hindi' ? 'Logout' : 'Logout',
      title: language === 'hindi' ? 'Order Book 📋' : 'Order Book 📋',
      subtitle: language === 'hindi' ? 'Aapke saare orders yahan' : 'All your orders here',
      loading: language === 'hindi' ? 'Orders load ho rahe...' : 'Loading orders...',
      noOrders: language === 'hindi' ? 'Koi orders nahi!' : 'No orders found!',
      startTrading: language === 'hindi' ? 'Trading shuru karo!' : 'Start trading!',
      all: language === 'hindi' ? 'Sab' : 'All',
      pending: language === 'hindi' ? 'Pending' : 'Pending',
      complete: language === 'hindi' ? 'Complete' : 'Complete',
      rejected: language === 'hindi' ? 'Rejected' : 'Rejected',
      symbol: language === 'hindi' ? 'Stock' : 'Symbol',
      type: language === 'hindi' ? 'Type' : 'Type',
      qty: language === 'hindi' ? 'Qty' : 'Qty',
      price: language === 'hindi' ? 'Price' : 'Price',
      status: language === 'hindi' ? 'Status' : 'Status',
      time: language === 'hindi' ? 'Time' : 'Time'
    };
    return texts[key] || key;
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'pending') return order.status === 'OPEN' || order.status === 'TRIGGER PENDING';
    if (filter === 'complete') return order.status === 'COMPLETE';
    if (filter === 'rejected') return order.status === 'REJECTED' || order.status === 'CANCELLED';
    return true;
  });

  const getStatusIcon = (status) => {
    if (status === 'COMPLETE') return <CheckCircle className="text-green-600" size={20} />;
    if (status === 'REJECTED' || status === 'CANCELLED') return <XCircle className="text-red-600" size={20} />;
    if (status === 'OPEN' || status === 'TRIGGER PENDING') return <Clock className="text-orange-600" size={20} />;
    return <AlertTriangle className="text-gray-600" size={20} />;
  };

  const getStatusColor = (status) => {
    if (status === 'COMPLETE') return 'bg-green-50 border-green-200 text-green-700';
    if (status === 'REJECTED' || status === 'CANCELLED') return 'bg-red-50 border-red-200 text-red-700';
    if (status === 'OPEN' || status === 'TRIGGER PENDING') return 'bg-orange-50 border-orange-200 text-orange-700';
    return 'bg-gray-50 border-gray-200 text-gray-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-gray-800 text-xl">{getText('loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link href="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-600 hover:text-gray-900 hover:border-gray-300">
                {getText('dashboard')}
              </Link>
              <Link href="/holdings" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-600 hover:text-gray-900 hover:border-gray-300">
                {getText('holdings')}
              </Link>
              <Link href="/market-watch" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-600 hover:text-gray-900 hover:border-gray-300">
                <ShoppingCart size={16} className="mr-1" />
                {getText('marketWatch')}
              </Link>
              <Link href="/order-book" className="inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium text-gray-900">
                📋 {getText('orderBook')}
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{getText('greeting')}</span>
              <button 
                onClick={toggleLanguage}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title={language === 'hindi' ? 'Switch to English' : 'हिंदी में बदलें'}
              >
                <Globe size={20} />
              </button>
              <button onClick={refreshOrders} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <RefreshCw size={20} />
              </button>
              <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                {getText('logout')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{getText('title')}</h1>
          <p className="text-gray-600">{getText('subtitle')}</p>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur rounded-2xl p-4 shadow-lg mb-6">
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getText('all')} ({orders.length})
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'pending' 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getText('pending')} ({orders.filter(o => o.status === 'OPEN' || o.status === 'TRIGGER PENDING').length})
              </button>
              <button
                onClick={() => setFilter('complete')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'complete' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getText('complete')} ({orders.filter(o => o.status === 'COMPLETE').length})
              </button>
              <button
                onClick={() => setFilter('rejected')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'rejected' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {getText('rejected')} ({orders.filter(o => o.status === 'REJECTED' || o.status === 'CANCELLED').length})
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white/70 backdrop-blur rounded-2xl p-12 shadow-lg text-center">
            <ShoppingCart className="mx-auto mb-4 text-gray-400" size={64} />
            <p className="text-gray-600 text-lg mb-2">{getText('noOrders')}</p>
            <p className="text-gray-500">{getText('startTrading')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order, index) => (
              <div key={order.order_id || index} className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-2xl font-bold text-gray-900">{order.tradingsymbol}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.transaction_type === 'BUY' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {order.transaction_type}
                      </span>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {order.exchange}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">{getText('qty')}</p>
                        <p className="font-semibold text-gray-900">{order.quantity}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">{getText('price')}</p>
                        <p className="font-semibold text-gray-900">
                          ₹{order.price ? order.price.toFixed(2) : order.average_price?.toFixed(2) || 'Market'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">{getText('type')}</p>
                        <p className="font-semibold text-gray-900">{order.order_type}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">{getText('time')}</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(order.order_timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="lg:ml-6">
                    <div className={`flex items-center space-x-2 px-4 py-3 rounded-xl border-2 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="font-bold">{order.status}</span>
                    </div>
                  </div>
                </div>

                {/* Rejection Roast */}
                {(order.status === 'REJECTED' || order.status === 'CANCELLED') && (
                  <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
                    <p className="text-red-800 font-bold text-lg mb-1">
                      {getRejectionRoast(order.status_message)}
                    </p>
                    <p className="text-red-600 text-sm">
                      {language === 'hindi' ? 'Reason: ' : 'Reason: '}
                      {order.status_message || (language === 'hindi' ? 'Koi reason nahi bataya!' : 'No reason provided!')}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}