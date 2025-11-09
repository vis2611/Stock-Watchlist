import React, { useState, useEffect } from 'react';
import { TrendingUp, Plus, Trash2, Star, Search, BarChart3, AlertCircle } from 'lucide-react';

export default function Stock() {
  const [watchlist, setWatchlist] = useState([]);
  const [stockInput, setStockInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Simulated stock data for demo (replace with real API later)
  const stockData = {
    'RELIANCE': { price: '2,456.75', change: '+2.34%', changeValue: '+56.20' },
    'TCS': { price: '3,678.90', change: '+1.87%', changeValue: '+67.50' },
    'INFY': { price: '1,543.20', change: '-0.95%', changeValue: '-14.80' },
    'HDFCBANK': { price: '1,678.45', change: '+0.56%', changeValue: '+9.35' },
    'ICICIBANK': { price: '1,023.60', change: '+1.23%', changeValue: '+12.45' },
    'BHARTIARTL': { price: '1,234.50', change: '-0.45%', changeValue: '-5.60' },
    'ITC': { price: '456.80', change: '+2.10%', changeValue: '+9.40' },
    'SBIN': { price: '678.90', change: '+1.45%', changeValue: '+9.70' },
    'BAJFINANCE': { price: '7,890.50', change: '-1.23%', changeValue: '-98.30' },
    'WIPRO': { price: '456.30', change: '+0.89%', changeValue: '+4.03' }
  };

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = () => {
    const stored = JSON.parse(localStorage.getItem('watchlist') || '[]');
    setWatchlist(stored);
  };

  const saveWatchlist = (list) => {
    localStorage.setItem('watchlist', JSON.stringify(list));
    setWatchlist(list);
  };

  const validateStock = (symbol) => {
    const trimmed = symbol.trim().toUpperCase();
    const regex = /^[A-Z]{1,5}$/;
    return regex.test(trimmed) ? trimmed : null;
  };

  const handleAddStock = () => {
    setError('');
    setSuccess('');

    const validated = validateStock(stockInput);
    
    if (!validated) {
      setError('Stock symbol must be 1-5 uppercase letters only');
      return;
    }

    if (watchlist.includes(validated)) {
      setError(`${validated} is already in your watchlist`);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newList = [...watchlist, validated];
      saveWatchlist(newList);
      setSuccess(`${validated} added successfully!`);
      setStockInput('');
      setLoading(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 300);
  };

  const handleRemoveStock = (symbol) => {
    const newList = watchlist.filter(s => s !== symbol);
    saveWatchlist(newList);
    setSuccess(`${symbol} removed from watchlist`);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
      saveWatchlist([]);
      setSuccess('Watchlist cleared');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddStock();
    }
  };

  const filteredWatchlist = watchlist.filter(stock => 
    stock.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockInfo = (symbol) => {
    return stockData[symbol] || { 
      price: '---', 
      change: '0.00%', 
      changeValue: '+0.00' 
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/50 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Stock Watchlist</h1>
                <p className="text-slate-400 text-sm">Track your favorite stocks in real-time</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="px-4 py-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <p className="text-xs text-slate-400">Total Stocks</p>
                <p className="text-2xl font-bold text-blue-400">{watchlist.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Add Stock Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Plus className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">Add New Stock</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={stockInput}
                onChange={(e) => setStockInput(e.target.value.toUpperCase().slice(0, 5))}
                onKeyPress={handleKeyPress}
                placeholder="Enter stock symbol (e.g., TCS, INFY, RELIANCE)"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                maxLength={5}
              />
            </div>
            <button
              onClick={handleAddStock}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Stock
            </button>
            {watchlist.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold rounded-xl border border-red-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Clear All
              </button>
            )}
          </div>

          {/* Messages */}
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          {success && (
            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3">
              <Star className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-green-300 text-sm">{success}</p>
            </div>
          )}
        </div>

        {/* Search Bar */}
        {watchlist.length > 0 && (
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search your watchlist..."
                className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        )}

        {/* Watchlist Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              Your Watchlist
            </h2>
            <span className="text-sm text-slate-400">
              {filteredWatchlist.length} {filteredWatchlist.length === 1 ? 'stock' : 'stocks'}
            </span>
          </div>

          {filteredWatchlist.length === 0 ? (
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-12 text-center">
              <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-slate-500" />
              </div>
              <h3 className="text-xl font-semibold text-slate-300 mb-2">
                {watchlist.length === 0 ? 'No stocks in watchlist' : 'No matching stocks'}
              </h3>
              <p className="text-slate-500">
                {watchlist.length === 0 
                  ? 'Add your first stock to start tracking'
                  : 'Try a different search term'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredWatchlist.map((stock) => {
                const info = getStockInfo(stock);
                const isPositive = info.change.startsWith('+');
                
                return (
                  <div
                    key={stock}
                    className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-5 hover:border-blue-500/50 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-white mb-1">{stock}</h3>
                        <p className="text-2xl font-bold text-slate-200">₹{info.price}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveStock(stock)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Remove from watchlist"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                        {info.change}
                      </span>
                      <span className={`text-xs ${isPositive ? 'text-green-400/70' : 'text-red-400/70'}`}>
                        ({info.changeValue})
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-700/50">
                      <p className="text-xs text-slate-500">NSE India</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-500">
            💡 Demo UI ready for backend integration • Replace localStorage with API calls
          </p>
          <p className="text-xs text-slate-600 mt-1">
            Stock prices are simulated for demo purposes
          </p>
        </div>
      </div>
    </div>
  );
}