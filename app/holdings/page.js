'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown, DollarSign, Search, ShoppingCart, ArrowUpRight, ArrowDownRight, BarChart3, Globe } from 'lucide-react';
import Link from 'next/link';
import { getStockRoast } from '../lib/roastingLibrary';

export default function Holdings() {
  const router = useRouter();
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('pnl');
  const [filterBy, setFilterBy] = useState('all');
  const [showBuySell, setShowBuySell] = useState(null);
  const [orderType, setOrderType] = useState('BUY');
  const [orderQty, setOrderQty] = useState(1);
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
    fetchHoldings(apiKey, accessToken);
  }, [router]);

  const toggleLanguage = () => {
    const newLang = language === 'english' ? 'hindi' : 'english';
    setLanguage(newLang);
    localStorage.setItem('kite_language', newLang);
  };

  const fetchHoldings = async (apiKey, accessToken) => {
    setLoading(true);
    try {
      const response = await fetch('/api/holdings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, accessToken })
      });
      const data = await response.json();
      
      if (data.success) {
        setHoldings(data.data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getSarcasticHoldingComment = (pnl, pnlPercent) => {
    return getStockRoast(pnlPercent, language);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const filteredAndSortedHoldings = holdings
    .filter(h => {
      const matchesSearch = h.tradingsymbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = 
        filterBy === 'all' ? true :
        filterBy === 'profit' ? h.pnl > 0 :
        filterBy === 'loss' ? h.pnl < 0 : true;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'pnl') return b.pnl - a.pnl;
      if (sortBy === 'value') return (b.last_price * b.quantity) - (a.last_price * a.quantity);
      if (sortBy === 'alphabetical') return a.tradingsymbol.localeCompare(b.tradingsymbol);
      return 0;
    });

  const totalPnL = holdings.reduce((sum, h) => sum + (h.pnl || 0), 0);
  const totalValue = holdings.reduce((sum, h) => sum + (h.last_price * h.quantity || 0), 0);
  const totalInvested = totalValue - totalPnL;
  const pnlPercentage = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  const handleBuySellAction = (holding, type) => {
    setShowBuySell(holding);
    setOrderType(type);
    setOrderQty(type === 'SELL' ? holding.quantity : 1);
  };

  const placeOrder = async () => {
    const apiKey = localStorage.getItem('kite_api_key');
    const accessToken = localStorage.getItem('kite_access_token');

    if (orderQty <= 0) {
      alert(language === 'hindi' ? 'Sahi quantity dalo!' : 'Please enter valid quantity!');
      return;
    }

    try {
      const orderParams = {
        tradingsymbol: showBuySell.tradingsymbol,
        exchange: showBuySell.exchange || 'NSE',
        transaction_type: orderType,
        order_type: 'MARKET',
        quantity: orderQty,
        product: 'CNC',
        validity: 'DAY'
      };

      const response = await fetch('/api/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, accessToken, orderParams })
      });

      const data = await response.json();

      if (data.success) {
        const msg = language === 'hindi'
          ? `✅ ${orderType} order successfully placed!\nOrder ID: ${data.order_id}`
          : `✅ ${orderType} order placed successfully!\nOrder ID: ${data.order_id}`;
        alert(msg);
        setShowBuySell(null);
        fetchHoldings(apiKey, accessToken);
      } else {
        const msg = language === 'hindi'
          ? `❌ Order fail: ${data.error}`
          : `❌ Order failed: ${data.error}`;
        alert(msg);
      }
    } catch (err) {
      const msg = language === 'hindi'
        ? `❌ Error: ${err.message}`
        : `❌ Error: ${err.message}`;
      alert(msg);
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
      totalPnl: language === 'hindi' ? 'Total P&L' : 'Total P&L',
      currentValue: language === 'hindi' ? 'Current Value' : 'Current Value',
      invested: language === 'hindi' ? 'Invested' : 'Invested',
      totalInvestment: language === 'hindi' ? 'Total investment' : 'Total investment',
      searchPlaceholder: language === 'hindi' ? 'Holdings search karo...' : 'Search holdings...',
      sortByPnl: language === 'hindi' ? 'P&L se sort karo' : 'Sort by P&L',
      sortByValue: language === 'hindi' ? 'Value se sort karo' : 'Sort by Value',
      sortByName: language === 'hindi' ? 'Naam se sort karo' : 'Sort by Name',
      allHoldings: language === 'hindi' ? 'Saare Holdings' : 'All Holdings',
      onlyProfit: language === 'hindi' ? 'Sirf Profit' : 'Only Profit',
      onlyLoss: language === 'hindi' ? 'Sirf Loss' : 'Only Loss',
      noHoldings: language === 'hindi' ? 'Koi holdings nahi mile! Investment shuru karo! 📈' : 'No holdings found! Start investing! 📈',
      quantity: language === 'hindi' ? 'Quantity' : 'Quantity',
      avgPrice: language === 'hindi' ? 'Avg Price' : 'Avg Price',
      ltp: language === 'hindi' ? 'LTP' : 'LTP',
      currentValueLabel: language === 'hindi' ? 'Current Value' : 'Current Value',
      buyMore: language === 'hindi' ? 'Aur Khareedo' : 'Buy More',
      sell: language === 'hindi' ? 'Becho' : 'Sell',
      cancel: language === 'hindi' ? 'Cancel' : 'Cancel',
      confirm: language === 'hindi' ? 'Confirm' : 'Confirm'
    };
    return texts[key] || key;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-gray-800 text-xl">
          {language === 'hindi' ? 'Aapke holdings load ho rahe hain... 📊' : 'Loading your holdings... 📊'}
        </div>
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
              <Link href="/holdings" className="inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium text-gray-900">
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
              <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                {getText('logout')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <span className="text-gray-600 font-medium">{getText('currentValue')}</span>
              <DollarSign className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ₹{totalValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-600 mt-1">{holdings.length} holdings</p>
          </div>

          <div className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-lg border-2 border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 font-medium">{getText('invested')}</span>
              <DollarSign className="text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              ₹{totalInvested.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </p>
            <p className="text-sm text-gray-600 mt-1">{getText('totalInvestment')}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder={getText('searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="pnl">{getText('sortByPnl')}</option>
                <option value="value">{getText('sortByValue')}</option>
                <option value="alphabetical">{getText('sortByName')}</option>
              </select>
            </div>

            <div>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="w-full px-4 py-2 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
              >
                <option value="all">{getText('allHoldings')}</option>
                <option value="profit">{getText('onlyProfit')}</option>
                <option value="loss">{getText('onlyLoss')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Holdings List */}
        <div className="space-y-4">
          {filteredAndSortedHoldings.length === 0 ? (
            <div className="bg-white/70 backdrop-blur rounded-2xl p-12 shadow-lg text-center">
              <p className="text-gray-600 text-lg">{getText('noHoldings')}</p>
            </div>
          ) : (
            filteredAndSortedHoldings.map((holding) => {
              const invested = holding.average_price * holding.quantity;
              const currentValue = holding.last_price * holding.quantity;
              const pnlPercent = invested > 0 ? ((holding.pnl / invested) * 100) : 0;

              return (
                <div key={holding.tradingsymbol} className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Stock Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">{holding.tradingsymbol}</h3>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">{holding.exchange}</span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">{getText('quantity')}</p>
                          <p className="font-semibold text-gray-900">{holding.quantity}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">{getText('avgPrice')}</p>
                          <p className="font-semibold text-gray-900">₹{holding.average_price.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">{getText('ltp')}</p>
                          <p className="font-semibold text-gray-900">₹{holding.last_price.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">{getText('currentValueLabel')}</p>
                          <p className="font-semibold text-gray-900">₹{currentValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center space-x-4">
                        <div className={`flex items-center ${holding.pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {holding.pnl >= 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                          <span className="ml-1 font-bold text-lg">₹{Math.abs(holding.pnl).toFixed(2)}</span>
                          <span className="ml-2">({pnlPercent >= 0 ? '+' : ''}{pnlPercent.toFixed(2)}%)</span>
                        </div>
                        <p className="text-xs text-gray-500 italic">
                          {getSarcasticHoldingComment(holding.pnl, pnlPercent)}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleBuySellAction(holding, 'BUY')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        {getText('buyMore')}
                      </button>
                      <button
                        onClick={() => handleBuySellAction(holding, 'SELL')}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        {getText('sell')}
                      </button>
                      <button
                        onClick={() => window.open(`https://kite.zerodha.com/chart/ext/ciq/NSE/${holding.tradingsymbol}`, '_blank')}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                        title={language === 'hindi' ? 'Chart dekho' : 'View Chart'}
                      >
                        <BarChart3 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Buy/Sell Modal */}
      {showBuySell && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {orderType} {showBuySell.tradingsymbol}
            </h3>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {language === 'hindi' ? 'Current Holdings:' : 'Current Holdings:'}
                </span>
                <span className="font-semibold">{showBuySell.quantity} shares</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {language === 'hindi' ? 'Current Price:' : 'Current Price:'}
                </span>
                <span className="font-semibold">₹{showBuySell.last_price.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {getText('quantity')} * {orderType === 'SELL' && `(Max: ${showBuySell.quantity})`}
                </label>
                <input
                  type="number"
                  value={orderQty}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 0;
                    if (orderType === 'SELL' && val > showBuySell.quantity) {
                      setOrderQty(showBuySell.quantity);
                    } else {
                      setOrderQty(val);
                    }
                  }}
                  max={orderType === 'SELL' ? showBuySell.quantity : undefined}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  min="1"
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {language === 'hindi' ? 'Total lagbhag:' : 'Approx Total:'}
                  </span>
                  <span className="font-bold text-gray-900">
                    ₹{(orderQty * showBuySell.last_price).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowBuySell(null)}
                  className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-colors"
                >
                  {getText('cancel')}
                </button>
                <button
                  onClick={placeOrder}
                  className={`flex-1 py-3 ${
                    orderType === 'BUY' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                  } text-white font-bold rounded-lg transition-colors`}
                >
                  {getText('confirm')} {orderType}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}