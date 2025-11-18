'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, RefreshCw, Globe, CheckCircle } from 'lucide-react';

export default function NewLogin() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [requestToken, setRequestToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('english');
  const [currentEmoji, setCurrentEmoji] = useState('😎');
  const [currentRoast, setCurrentRoast] = useState('');

  const emojiRoasts = {
    english: [
      { emoji: '😎', text: 'Ready to make some money? Or lose it? Let\'s find out!' },
      { emoji: '🤑', text: 'Time to turn those stocks into... regrets or riches!' },
      { emoji: '😅', text: 'Another day, another rupee... hopefully!' },
      { emoji: '🚀', text: 'To the moon! Or maybe just the ground floor...' },
      { emoji: '😬', text: 'Market is scary, but you\'re scarier! Let\'s go!' },
      { emoji: '🎯', text: 'Aim for profits, settle for experience!' },
      { emoji: '💪', text: 'Strong hands needed! No panic selling, please!' },
      { emoji: '🎪', text: 'Welcome to the greatest show on earth - The Stock Market!' },
      { emoji: '🎲', text: 'Feeling lucky? Market doesn\'t care, but welcome!' },
      { emoji: '😈', text: 'Time to dance with the market devil!' }
    ],
    hindi: [
      { emoji: '😎', text: 'Paisa kamane ready ho? Ya udane? Dekh lete hain!' },
      { emoji: '🤑', text: 'Stocks ko crorepati banane ka time... ya bankrupt!' },
      { emoji: '😅', text: 'Aaj bhi market mein dhakke khane ready?' },
      { emoji: '🚀', text: 'Rocket se moon tak... ya direct zameen pe!' },
      { emoji: '😬', text: 'Market darrawani hai, par tum zyada! Chalo!' },
      { emoji: '🎯', text: 'Profit ka target, experience mil jayega pakka!' },
      { emoji: '💪', text: 'Strong hands chahiye! Panic selling mat karna!' },
      { emoji: '🎪', text: 'Duniya ka sabse bada circus - Stock Market!' },
      { emoji: '🎲', text: 'Lucky feel ho raha? Market ko farak nahi padta!' },
      { emoji: '😈', text: 'Market devil ke saath dance karne ka time!' }
    ]
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem('kite_language');
    if (savedLanguage) setLanguage(savedLanguage);

    // Check if already logged in
    const token = localStorage.getItem('kite_access_token');
    if (token) {
      router.push('/');
      return;
    }

    // Auto-detect request token
    const urlParams = new URLSearchParams(window.location.search);
    const token_param = urlParams.get('request_token');
    if (token_param) {
      setRequestToken(token_param);
    }

    // Rotate emoji every 4 seconds
    const roasts = emojiRoasts[language];
    let index = 0;
    setCurrentEmoji(roasts[index].emoji);
    setCurrentRoast(roasts[index].text);

    const interval = setInterval(() => {
      index = (index + 1) % roasts.length;
      setCurrentEmoji(roasts[index].emoji);
      setCurrentRoast(roasts[index].text);
    }, 4000);

    return () => clearInterval(interval);
  }, [router, language]);

  const toggleLanguage = () => {
    const newLang = language === 'english' ? 'hindi' : 'english';
    setLanguage(newLang);
    localStorage.setItem('kite_language', newLang);
    
    // Update emoji immediately
    const roasts = emojiRoasts[newLang];
    setCurrentEmoji(roasts[0].emoji);
    setCurrentRoast(roasts[0].text);
  };

  const handleLogin = () => {
    if (!apiKey) {
      alert(language === 'hindi' ? 'API Key dalo pehle!' : 'Please enter API Key!');
      return;
    }
    const redirectUrl = `${window.location.origin}/login`;
    const loginUrl = `https://kite.zerodha.com/connect/login?api_key=${apiKey}&v=3&redirect_params=${encodeURIComponent(redirectUrl)}`;
    window.location.href = loginUrl;
  };

  const handleConnect = async () => {
    if (!apiKey || !apiSecret || !requestToken) {
      alert(language === 'hindi' ? 'Sab fields bharo!' : 'Please fill all fields!');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, apiSecret, requestToken })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('kite_api_key', apiKey);
        localStorage.setItem('kite_access_token', data.data.access_token);
        localStorage.setItem('kite_user_name', data.data.user_name || data.data.user_id);
        router.push('/');
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getText = (key) => {
    const texts = {
      title: language === 'hindi' ? 'Kite Portfolio' : 'Kite Portfolio',
      subtitle: language === 'hindi' ? 'Roasting Portfolio 🔥' : 'Roasting Portfolio 🔥',
      tagline: language === 'hindi' ? 'Jaha portfolio ke saath roasting bhi free hai!' : 'Where roasting comes free with your portfolio!',
      apiKey: language === 'hindi' ? 'API Key' : 'API Key',
      apiSecret: language === 'hindi' ? 'API Secret' : 'API Secret',
      requestToken: language === 'hindi' ? 'Request Token (Auto-detected)' : 'Request Token (Auto-detected)',
      login: language === 'hindi' ? 'Kite se Login karo' : 'Login with Kite',
      connect: language === 'hindi' ? 'Connect karo' : 'Connect',
      connecting: language === 'hindi' ? 'Connect ho raha hai...' : 'Connecting...',
      step1: language === 'hindi' ? 'Step 1: API Key aur Secret dalo' : 'Step 1: Enter API Key & Secret',
      step2: language === 'hindi' ? 'Step 2: Kite login karo' : 'Step 2: Login with Kite',
      step3: language === 'hindi' ? 'Step 3: Connect button dabao' : 'Step 3: Click Connect',
      footer: language === 'hindi' ? 'Zerodha Kite ke saath powered' : 'Powered by Zerodha Kite'
    };
    return texts[key] || key;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-green-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Language Toggle - Top Right */}
      <button
        onClick={toggleLanguage}
        className="absolute top-6 right-6 p-3 bg-white/80 backdrop-blur hover:bg-white rounded-xl shadow-lg transition-all z-10 flex items-center space-x-2"
        title={language === 'hindi' ? 'Switch to English' : 'हिंदी में बदलें'}
      >
        <Globe size={20} className="text-gray-700" />
        <span className="text-sm font-semibold text-gray-700">
          {language === 'hindi' ? 'EN' : 'हिं'}
        </span>
      </button>

      {/* Main Card */}
      <div className="relative z-10 max-w-md w-full">
        {/* Emoji Reaction - Floating Above */}
        <div className="mb-6 text-center">
          <div className="inline-block relative">
            <div className="text-8xl animate-bounce" style={{ animationDuration: '2s' }}>
              {currentEmoji}
            </div>
            <div className="absolute -top-4 -right-4">
              <div className="w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
              <div className="w-4 h-4 bg-red-500 rounded-full absolute top-0"></div>
            </div>
          </div>
          <p className="mt-4 text-gray-700 font-medium text-lg px-4 min-h-[60px]">
            {currentRoast}
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur rounded-3xl shadow-2xl p-8 border-2 border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-3">
              <TrendingUp className="text-orange-600 mr-2" size={32} />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-green-600 bg-clip-text text-transparent">
                {getText('title')}
              </h1>
            </div>
            <p className="text-xl font-bold text-gray-800">{getText('subtitle')}</p>
            <p className="text-sm text-gray-600 mt-2">{getText('tagline')}</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {getText('apiKey')} *
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Your Kite API Key"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {getText('apiSecret')} *
              </label>
              <input
                type="password"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder="Your Kite API Secret"
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:bg-white transition-all"
              />
            </div>

            {requestToken && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                  {getText('requestToken')}
                  <CheckCircle className="ml-2 text-green-600" size={16} />
                </label>
                <input
                  type="text"
                  value={requestToken}
                  readOnly
                  className="w-full px-4 py-3 bg-green-50 border-2 border-green-300 rounded-xl text-green-700 font-mono text-sm"
                />
              </div>
            )}

            {/* Action Button */}
            {!requestToken ? (
              <button
                onClick={handleLogin}
                disabled={!apiKey}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {getText('login')} →
              </button>
            ) : (
              <button
                onClick={handleConnect}
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <RefreshCw className="animate-spin mr-2" size={20} />
                    {getText('connecting')}
                  </span>
                ) : (
                  getText('connect') + ' 🚀'
                )}
              </button>
            )}
          </div>

          {/* Steps */}
          <div className="mt-8 pt-6 border-t-2 border-gray-100">
            <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              {language === 'hindi' ? 'Kaise kare?' : 'How to connect?'}
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">1</span>
                <span>{getText('step1')}</span>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">2</span>
                <span>{getText('step2')}</span>
              </div>
              <div className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">3</span>
                <span>{getText('step3')}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">{getText('footer')}</p>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 bg-white/60 backdrop-blur rounded-xl p-3">
            <span className="font-semibold">
              {language === 'hindi' ? '⚠️ Yaad rahe:' : '⚠️ Remember:'}
            </span>{' '}
            {language === 'hindi' 
              ? 'Roasting free hai, profits guaranteed nahi!'
              : 'Roasting is free, profits are not guaranteed!'}
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}