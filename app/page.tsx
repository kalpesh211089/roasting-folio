'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown, DollarSign, RefreshCw, ShoppingCart, Globe } from 'lucide-react';
import Link from 'next/link';
import { getPnLRoast, getFundsRoast } from './lib/roastingLibrary';


export default function Dashboard() {
  const router = useRouter();
  const [holdings, setHoldings] = useState([]);
  const [funds, setFunds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [language, setLanguage] = useState('english');

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
    fetchData(apiKey, accessToken);
  }, [router]);

  const toggleLanguage = () => {
    const newLang = language === 'english' ? 'hindi' : 'english';
    setLanguage(newLang);
    localStorage.setItem('kite_language', newLang);
  };

  const fetchData = async (apiKey, accessToken) => {
    setLoading(true);
    
    try {
      const holdingsRes = await fetch('/api/holdings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, accessToken })
      });
      const holdingsData = await holdingsRes.json();
      
      if (holdingsData.success) {
        setHoldings(holdingsData.data || []);
      }

      const marginsRes = await fetch('/api/margins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, accessToken })
      });
      const marginsData = await marginsRes.json();
      
      if (marginsData.success) {
        setFunds(marginsData.data?.equity?.available?.live_balance || 0);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalPnL = holdings.reduce((sum, h) => sum + (h.pnl || 0), 0);
  const totalValue = holdings.reduce((sum, h) => sum + (h.last_price * h.quantity || 0), 0);
  const pnlPercentage = totalValue > 0 ? (totalPnL / (totalValue - totalPnL)) * 100 : 0;

  const getMoodColor = () => {
    if (pnlPercentage > 10) return 'from-emerald-50 to-green-100';
    if (pnlPercentage > 5) return 'from-green-50 to-emerald-50';
    if (pnlPercentage > 0) return 'from-blue-50 to-cyan-50';
    if (pnlPercentage > -5) return 'from-orange-50 to-yellow-50';
    if (pnlPercentage > -10) return 'from-red-50 to-orange-50';
    return 'from-red-100 to-pink-100';
  };

  const getSarcasticComment = () => {
    return getPnLRoast(pnlPercentage, language);
  };

  const getFundsComment = (availableFunds) => {
    return getFundsRoast(availableFunds, language);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const refreshData = () => {
    const apiKey = localStorage.getItem('kite_api_key');
    const accessToken = localStorage.getItem('kite_access_token');
    if (apiKey && accessToken) {
      fetchData(apiKey, accessToken);
    }
  };

  const getText = (key) => {
    const texts = {
      greeting: language === 'hindi' ? `Namaste, ${userName}! 🙏` : `Hello, ${userName}! 👋`,
      dashboard: language === 'hindi' ? 'Dashboard' : 'Dashboard',
      holdings: language === 'hindi' ? 'Holdings' : 'Holdings',
      marketWatch: language === 'hindi' ? 'Market Watch' : 'Market Watch',
      orderBook: language === 'hindi' ? 'Order Book' : 'Order Book',
      logout: language === 'hindi' ? 'Logout' : 'Logout',
      portfolioTitle: language === 'hindi' ? 'Aapka "Portfolio" 😏' : 'Your "Portfolio" 😏',
      totalPnl: language === 'hindi' ? 'Total P&L' : 'Total P&L',
      portfolioValue: language === 'hindi' ? 'Portfolio Value' : 'Portfolio Value',
      availableFunds: language === 'hindi' ? 'Available Funds' : 'Available Funds',
      topGainers: language === 'hindi' ? '🔥 Top Gainers' : '🔥 Top Gainers',
      topLosers: language === 'hindi' ? '💀 Top Losers' : '💀 Top Losers',
      noGainers: language === 'hindi' ? 'Koi gainer nahi! Keep trying beta! 😅' : 'No gainers! Keep trying! 😅',
      noLosers: language === 'hindi' ? 'Koi loser nahi! Genius ho tum! 🎯' : 'No losers! You\'re a genius! 🎯',
      quickLinks: language === 'hindi' ? 'Quick Links' : 'Quick Links',
      viewAllHoldings: language === 'hindi' ? 'Saare Holdings Dekho →' : 'View All Holdings →',
      loading: language === 'hindi' ? 'Aapka portfolio load ho raha hai... 📊' : 'Loading your portfolio... 📊'
    };
    return texts[key] || key;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-gray-800 text-xl">{getText('loading')}</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getMoodColor()} transition-all duration-1000`}>
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link href="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium text-gray-900">
                {getText('dashboard')}
              </Link>
              <Link href="/holdings" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-600 hover:text-gray-900 hover:border-gray-300">
                {getText('holdings')}
              </Link>
              <Link href="/market-watch" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-600 hover:text-gray-900 hover:border-gray-300">
                <ShoppingCart size={16} className="mr-1" />
                {getText('marketWatch')}
              </Link>
              <Link href="/order-book" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-600 hover:text-gray-900 hover:border-gray-300">
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
              <button onClick={refreshData} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title={language === 'hindi' ? 'Refresh karo' : 'Refresh'}>
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
        <div className="mb-8 bg-white/60 backdrop-blur rounded-2xl p-6 shadow-lg">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{getText('portfolioTitle')}</h1>
          <p className="text-gray-700 text-lg font-medium">{getSarcasticComment()}</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">{getText('totalPnl')}</span>
              {totalPnL >= 0 ? <TrendingUp className="text-green-600" /> : <TrendingDown className="text-red-600" />}
            </div>
            <p className={`text-3xl font-bold ${totalPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{totalPnL.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-600 mt-1">{pnlPercentage.toFixed(2)}% overall</p>
          </div>

          <div className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">{getText('portfolioValue')}</span>
              <DollarSign className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ₹{totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-600 mt-1">{holdings.length} holdings</p>
          </div>

          <div className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">{getText('availableFunds')}</span>
              <DollarSign className="text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ₹{(funds || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-600 mt-1 font-medium">{getFundsComment(funds)}</p>
          </div>
        </div>

        {/* Top Performers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{getText('topGainers')}</h2>
            <div className="space-y-3">
              {holdings.filter(h => h.pnl > 0).sort((a, b) => b.pnl - a.pnl).slice(0, 3).map((h, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-900 font-medium">{h.tradingsymbol}</span>
                  <span className="text-green-600 font-bold">+₹{h.pnl.toFixed(2)}</span>
                </div>
              ))}
              {holdings.filter(h => h.pnl > 0).length === 0 && (
                <p className="text-gray-600 text-sm">{getText('noGainers')}</p>
              )}
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{getText('topLosers')}</h2>
            <div className="space-y-3">
              {holdings.filter(h => h.pnl < 0).sort((a, b) => a.pnl - b.pnl).slice(0, 3).map((h, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-gray-900 font-medium">{h.tradingsymbol}</span>
                  <span className="text-red-600 font-bold">₹{h.pnl.toFixed(2)}</span>
                </div>
              ))}
              {holdings.filter(h => h.pnl < 0).length === 0 && (
                <p className="text-gray-600 text-sm">{getText('noLosers')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{getText('quickLinks')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/holdings" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl text-center transition-colors shadow-md">
              {getText('viewAllHoldings')}
            </Link>
            <Link href="/market-watch" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl text-center transition-colors shadow-md">
              {getText('marketWatch')} 📈
            </Link>
            <Link href="/order-book" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-xl text-center transition-colors shadow-md">
              {getText('orderBook')} 📋
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}