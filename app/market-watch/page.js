'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Plus, TrendingUp, TrendingDown, X, ShoppingCart, BarChart3, Trash2, RefreshCw, Globe } from 'lucide-react';
import Link from 'next/link';
import { getRandomRoast } from '../lib/roastingLibrary';

export default function MarketWatch() {
  const router = useRouter();
  const [watchlist, setWatchlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [userName, setUserName] = useState('');
  const [showBuySell, setShowBuySell] = useState(null);
  const [orderType, setOrderType] = useState('BUY');
  const [orderQty, setOrderQty] = useState(1);
  const [orderPrice, setOrderPrice] = useState('');
  const [orderTypeSelect, setOrderTypeSelect] = useState('MARKET');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('english');
  const refreshIntervalRef = useRef(null);

  const popularStocks = [
    { tradingsymbol: 'RELIANCE', instrument_token: 738561, exchange: 'NSE' },
    { tradingsymbol: 'TCS', instrument_token: 2953217, exchange: 'NSE' },
    { tradingsymbol: 'INFY', instrument_token: 408065, exchange: 'NSE' },
    { tradingsymbol: 'HDFCBANK', instrument_token: 341249, exchange: 'NSE' },
    { tradingsymbol: 'ICICIBANK', instrument_token: 1270529, exchange: 'NSE' },
    { tradingsymbol: 'SBIN', instrument_token: 779521, exchange: 'NSE' },
    { tradingsymbol: 'BHARTIARTL', instrument_token: 2714625, exchange: 'NSE' },
    { tradingsymbol: 'ITC', instrument_token: 424961, exchange: 'NSE' },
    { tradingsymbol: 'TATAMOTORS', instrument_token: 884737, exchange: 'NSE' },
    { tradingsymbol: 'WIPRO', instrument_token: 969473, exchange: 'NSE' }
  ];

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

    const savedWatchlist = localStorage.getItem('kite_watchlist');
    if (savedWatchlist) {
      const parsed = JSON.parse(savedWatchlist);
      setWatchlist(parsed);
      if (parsed.length > 0) {
        fetchLiveQuotes(apiKey, accessToken, parsed);
      }
    }

    refreshIntervalRef.current = setInterval(() => {
      const currentWatchlist = JSON.parse(localStorage.getItem('kite_watchlist') || '[]');
      if (currentWatchlist.length > 0) {
        fetchLiveQuotes(apiKey, accessToken, currentWatchlist);
      }
    }, 5000);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [router]);

  const toggleLanguage = () => {
    const newLang = language === 'english' ? 'hindi' : 'english';
    setLanguage(newLang);
    localStorage.setItem('kite_language', newLang);
  };

  const fetchLiveQuotes = async (apiKey, accessToken, stocks) => {
    try {
      const response = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          accessToken,
          instruments: stocks
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setWatchlist(prev => prev.map(stock => {
          const key = `${stock.exchange}:${stock.tradingsymbol}`;
          const quote = data.data[key];
          if (quote) {
            return {
              ...stock,
              last_price: quote.last_price,
              change: quote.change,
              change_percent: quote.change_percent,
              volume: quote.volume
            };
          }
          return stock;
        }));
      }
    } catch (err) {
      console.error('Error fetching quotes:', err);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const filtered = popularStocks.filter(stock =>
      stock.tradingsymbol.toLowerCase().includes(query.toLowerCase())
    );
    setSearchResults(filtered);
  };

  const addToWatchlist = (stock) => {
    const exists = watchlist.find(s => s.tradingsymbol === stock.tradingsymbol);
    if (exists) {
      alert(language === 'hindi' ? 'Stock pehle se watchlist mein hai! 📊' : 'Stock already in watchlist! 📊');
      return;
    }

    const newStock = {
      ...stock,
      last_price: 0,
      change: 0,
      change_percent: 0,
      volume: 0
    };

    const updated = [...watchlist, newStock];
    setWatchlist(updated);
    localStorage.setItem('kite_watchlist', JSON.stringify(updated));
    setSearchQuery('');
    setSearchResults([]);

    const apiKey = localStorage.getItem('kite_api_key');
    const accessToken = localStorage.getItem('kite_access_token');
    fetchLiveQuotes(apiKey, accessToken, updated);
  };

  const removeFromWatchlist = (tradingsymbol) => {
    const updated = watchlist.filter(s => s.tradingsymbol !== tradingsymbol);
    setWatchlist(updated);
    localStorage.setItem('kite_watchlist', JSON.stringify(updated));
  };

  const handleBuySell = (stock, type) => {
    setShowBuySell(stock);
    setOrderType(type);
    setOrderQty(1);
    setOrderPrice(stock.last_price ? stock.last_price.toFixed(2) : '');
    setOrderTypeSelect('MARKET');
  };

  const placeOrder = async () => {
    const apiKey = localStorage.getItem('kite_api_key');
    const accessToken = localStorage.getItem('kite_access_token');

    if (orderQty <= 0) {
      alert(language === 'hindi' ? 'Sahi quantity daalo!' : 'Please enter valid quantity!');
      return;
    }

    if (orderTypeSelect !== 'MARKET' && (!orderPrice || parseFloat(orderPrice) <= 0)) {
      alert(language === 'hindi' ? 'Sahi price daalo!' : 'Please enter valid price!');
      return;
    }

    setLoading(true);

    try {
      const orderParams = {
        tradingsymbol: showBuySell.tradingsymbol,
        exchange: showBuySell.exchange,
        transaction_type: orderType,
        order_type: orderTypeSelect,
        quantity: orderQty,
        product: 'CNC',
        validity: 'DAY',
        ...(orderTypeSelect !== 'MARKET' && { price: parseFloat(orderPrice) })
      };

      const response = await fetch('/api/place-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          accessToken,
          orderParams
        })
      });

      const data = await response.json();

      if (data.success) {
        const roast = getRandomRoast('orderStatus', 'success', language);
        const successMsg = `${roast}\n\nOrder ID: ${data.order_id}`;
        alert(successMsg);
        setShowBuySell(null);
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
    }
    localStorage.clear();
    router.push('/login');
  };

  const manualRefresh = () => {
    const apiKey = localStorage.getItem('kite_api_key');
    const accessToken = localStorage.getItem('kite_access_token');
    if (watchlist.length > 0) {
      fetchLiveQuotes(apiKey, accessToken, watchlist);
    }
  };

  const getGreeting = () => {
    return language === 'hindi' 
      ? `Namaste, ${userName}! 🙏` 
      : `Hello, ${userName}! 👋`;
  };

  const getPageDescription = () => {
    return language === 'hindi'
      ? 'Apne favourite stocks ko search karke track karo (har 5 second mein update)'
      : 'Search and track your favorite stocks with live prices (updates every 5 seconds)';
  };

  const getSearchPlaceholder = () => {
    return language === 'hindi'
      ? 'Stocks search karo (jaise, RELIANCE, TCS, INFY)...'
      : 'Search stocks (e.g., RELIANCE, TCS, INFY)...';
  };

  const getNoResultsText = () => {
    return language === 'hindi'
      ? 'Koi stock nahi mila. RELIANCE, TCS, INFY try karo.'
      : 'No stocks found. Try searching for RELIANCE, TCS, INFY, etc.';
  };

  const getEmptyWatchlistText = () => {
    return {
      title: language === 'hindi' ? 'Aapki watchlist khaali hai!' : 'Your watchlist is empty!',
      subtitle: language === 'hindi' ? 'Stocks search karke yahan add karo' : 'Search and add stocks to track them here'
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link href="/" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-600 hover:text-gray-900 hover:border-gray-300">
                {language === 'hindi' ? 'Dashboard' : 'Dashboard'}
              </Link>
              <Link href="/holdings" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-600 hover:text-gray-900 hover:border-gray-300">
                {language === 'hindi' ? 'Holdings' : 'Holdings'}
              </Link>
              <Link href="/market-watch" className="inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium text-gray-900">
                <ShoppingCart size={16} className="mr-1" />
                {language === 'hindi' ? 'Market Watch' : 'Market Watch'}
              </Link>
              <Link href="/order-book" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-600 hover:text-gray-900 hover:border-gray-300">
                📋 {language === 'hindi' ? 'Order Book' : 'Order Book'}
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{getGreeting()}</span>
              <button 
                onClick={toggleLanguage}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                title={language === 'hindi' ? 'Switch to English' : 'हिंदी में बदलें'}
              >
                <Globe size={20} />
              </button>
              <button onClick={manualRefresh} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" title={language === 'hindi' ? 'Prices refresh karo' : 'Refresh Prices'}>
                <RefreshCw size={20} />
              </button>
              <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                {language === 'hindi' ? 'Logout' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {language === 'hindi' ? 'Market Watch 📈' : 'Market Watch 📈'}
          </h1>
          <p className="text-gray-600">{getPageDescription()}</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white/70 backdrop-blur rounded-2xl p-6 shadow-lg mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={getSearchPlaceholder()}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-lg"
            />
          </div>

          {/* Search Results */}
          {isSearching && searchResults.length > 0 && (
            <div className="mt-4 space-y-2 max-h-64 overflow-y-auto">
              {searchResults.map((stock) => (
                <div
                  key={stock.tradingsymbol}
                  className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => addToWatchlist(stock)}
                >
                  <div>
                    <span className="font-semibold text-gray-900">{stock.tradingsymbol}</span>
                    <span className="text-sm text-gray-500 ml-2">{stock.exchange}</span>
                  </div>
                  <Plus className="text-blue-600" size={20} />
                </div>
              ))}
            </div>
          )}

          {isSearching && searchResults.length === 0 && searchQuery.length >= 2 && (
            <div className="mt-4 text-center text-gray-600">
              {getNoResultsText()}
            </div>
          )}
        </div>

        {/* Watchlist */}
        <div className="bg-white/70 backdrop-blur rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {language === 'hindi' ? 'Aapki Watchlist' : 'Your Watchlist'}
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {watchlist.length} {language === 'hindi' ? 'stocks' : 'stocks'}
                </span>
                <span className="text-xs text-green-600 flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-1 animate-pulse"></span>
                  {language === 'hindi' ? 'Live' : 'Live'}
                </span>
              </div>
            </div>
          </div>

          {watchlist.length === 0 ? (
            <div className="p-12 text-center">
              <Search className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 text-lg">{getEmptyWatchlistText().title}</p>
              <p className="text-gray-500 mt-2">{getEmptyWatchlistText().subtitle}</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {watchlist.map((stock) => (
                <div key={stock.tradingsymbol} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-bold text-gray-900">{stock.tradingsymbol}</h3>
                        <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">{stock.exchange}</span>
                      </div>
                      <div className="flex items-center space-x-4 mt-2">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            ₹{stock.last_price ? stock.last_price.toFixed(2) : '---'}
                          </p>
                        </div>
                        <div className={`flex items-center ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stock.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          <span className="ml-1 font-semibold">
                            {stock.change >= 0 ? '+' : ''}{stock.change ? stock.change.toFixed(2) : '0.00'}
                          </span>
                          <span className="ml-2 text-sm">
                            ({stock.change >= 0 ? '+' : ''}{stock.change_percent ? stock.change_percent.toFixed(2) : '0.00'}%)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleBuySell(stock, 'BUY')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        {language === 'hindi' ? 'Buy' : 'Buy'}
                      </button>
                      <button
                        onClick={() => handleBuySell(stock, 'SELL')}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                      >
                        {language === 'hindi' ? 'Sell' : 'Sell'}
                      </button>
                      <button
                        onClick={() => window.open(`https://kite.zerodha.com/chart/ext/ciq/NSE/${stock.tradingsymbol}`, '_blank')}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                        title={language === 'hindi' ? 'Chart dekho' : 'View Chart'}
                      >
                        <BarChart3 size={20} />
                      </button>
                      <button
                        onClick={() => removeFromWatchlist(stock.tradingsymbol)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                        title={language === 'hindi' ? 'Watchlist se hatao' : 'Remove from Watchlist'}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Add Popular Stocks */}
        <div className="mt-6 bg-white/70 backdrop-blur rounded-2xl p-6 shadow-lg">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {language === 'hindi' ? '⚡ Popular Stocks Jaldi Add Karo' : '⚡ Quick Add Popular Stocks'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularStocks.map((stock) => (
              <button
                key={stock.tradingsymbol}
                onClick={() => addToWatchlist(stock)}
                className="px-4 py-2 bg-gray-100 hover:bg-blue-100 text-gray-800 font-medium rounded-lg transition-colors"
              >
                + {stock.tradingsymbol}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Buy/Sell Modal */}
      {showBuySell && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {orderType} {showBuySell.tradingsymbol}
              </h3>
              <button onClick={() => setShowBuySell(null)} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {language === 'hindi' ? 'Current Price:' : 'Current Price:'}
                </span>
                <span className="text-lg font-bold text-gray-900">
                  ₹{showBuySell.last_price ? showBuySell.last_price.toFixed(2) : '---'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'hindi' ? 'Quantity *' : 'Quantity *'}
                </label>
                <input
                  type="number"
                  placeholder={language === 'hindi' ? 'Quantity dalo' : 'Enter quantity'}
                  value={orderQty}
                  onChange={(e) => setOrderQty(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {language === 'hindi' ? 'Order Type *' : 'Order Type *'}
                </label>
                <select 
                  value={orderTypeSelect}
                  onChange={(e) => setOrderTypeSelect(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="MARKET">Market</option>
                  <option value="LIMIT">Limit</option>
                  <option value="SL">Stop Loss</option>
                  <option value="SL-M">Stop Loss Market</option>
                </select>
              </div>

              {orderTypeSelect !== 'MARKET' && orderTypeSelect !== 'SL-M' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'hindi' ? 'Price *' : 'Price *'}
                  </label>
                  <input
                    type="number"
                    placeholder={language === 'hindi' ? 'Price dalo' : 'Enter price'}
                    value={orderPrice}
                    onChange={(e) => setOrderPrice(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    step="0.05"
                  />
                </div>
              )}

              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {language === 'hindi' ? 'Total lagbhag:' : 'Approx Total:'}
                  </span>
                  <span className="font-bold text-gray-900">
                    ₹{(orderQty * (orderPrice || showBuySell.last_price || 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={placeOrder}
                disabled={loading}
                className={`w-full py-3 ${
                  orderType === 'BUY' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700'
                } text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading 
                  ? (language === 'hindi' ? 'Order place ho raha hai...' : 'Placing Order...') 
                  : `${language === 'hindi' ? 'Order Place Karo' : 'Place Order'} (${orderType})`
                }
              </button>

              <p className="text-xs text-gray-500 text-center">
                Product: CNC (Delivery) | Validity: DAY
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}