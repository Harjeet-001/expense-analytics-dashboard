import React, { useState, useEffect } from 'react';

// Injection of Tailwind CSS via standard DOM injection for lightweight rendering
if (!document.getElementById('tailwind-cdn')) {
  const tailwindScript = document.createElement('script');
  tailwindScript.id = 'tailwind-cdn';
  tailwindScript.src = 'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4';
  document.head.appendChild(tailwindScript);
}

export default function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('expense_tracker_transactions');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Monthly Salary', amount: 5000, type: 'income', category: 'Salary', date: '2026-06-01' },
      { id: 2, text: 'Grocery Shopping', amount: 150, type: 'expense', category: 'Food', date: '2026-06-20' },
      { id: 3, text: 'Electricity Bill', amount: 85, type: 'expense', category: 'Utilities', date: '2026-06-22' }
    ];
  });

  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');

  useEffect(() => {
    localStorage.setItem('expense_tracker_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const amounts = transactions.map(transaction => 
    transaction.type === 'income' ? transaction.amount : -transaction.amount
  );
  
  const totalBalance = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => (acc += item), 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

  const categoryTotals = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, transaction) => {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
      return acc;
    }, {});

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!text.trim() || !amount) return;

    const newTransaction = {
      id: Date.now(),
      text,
      amount: parseFloat(amount),
      type,
      category: type === 'income' ? 'Salary' : category,
      date: new Date().toISOString().split('T')[0]
    };

    setTransactions([newTransaction, ...transactions]);
    setText('');
    setAmount('');
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              FinTrack Pro
            </h1>
            <p className="text-slate-400 text-sm mt-1">Daily Expense & Income Analytics Dashboard</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-medium text-slate-300 tracking-wide">LIVE STATS</span>
          </div>
        </header>

        {/* Top Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Balance</p>
            <h3 className={`text-3xl font-bold mt-2 ${totalBalance >= 0 ? 'text-cyan-400' : 'text-rose-400'}`}>
              ${totalBalance}
            </h3>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Income</p>
            <h3 className="text-3xl font-bold text-emerald-400 mt-2">${income}</h3>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <p className="text-sm font-medium text-slate-400 uppercase tracking-wider">Total Expenses</p>
            <h3 className="text-3xl font-bold text-rose-400 mt-2">${expense}</h3>
          </div>
        </div>

        {/* Main Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Inputs & Analytics */}
          <div className="space-y-8 lg:col-span-1">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
              <h2 className="text-xl font-semibold mb-4 text-white">Add New Transaction</h2>
              <form onSubmit={handleAddTransaction} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Transaction Type</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setType('expense')}
                      className={`py-2 text-sm font-medium rounded-lg transition-all ${type === 'expense' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'text-slate-400 hover:text-white'}`}
                    >
                      Expense
                    </button>
                    <button
                      type="button"
                      onClick={() => setType('income')}
                      className={`py-2 text-sm font-medium rounded-lg transition-all ${type === 'income' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-400 hover:text-white'}`}
                    >
                      Income
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Description</label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="e.g., Grocery Store"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {type === 'expense' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Food">Food & Dining</option>
                      <option value="Utilities">Utilities & Bills</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Other">Other Expenses</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-semibold py-3 rounded-xl transition-all shadow-lg cursor-pointer mt-2"
                >
                  Save Transaction
                </button>
              </form>
            </div>

            {/* Category Analytics */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
              <h2 className="text-xl font-semibold mb-4 text-white">Category Analytics</h2>
              {Object.keys(categoryTotals).length === 0 ? (
                <p className="text-sm text-slate-500 italic">No expense data yet.</p>
              ) : (
                <div className="space-y-4">
                  {Object.entries(categoryTotals).map(([cat, amt]) => {
                    const percentage = expense > 0 ? ((amt / expense) * 100).toFixed(0) : 0;
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300 font-medium">{cat}</span>
                          <span className="text-slate-400">${amt.toFixed(2)} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                          <div
                            className="bg-gradient-to-r from-rose-500 to-orange-400 h-full rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* History */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl h-full flex flex-col">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-white">Transaction History</h2>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[620px]">
                {transactions.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 border border-dashed border-slate-800 rounded-xl">
                    No transactions recorded yet.
                  </div>
                ) : (
                  transactions.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between p-4 bg-slate-950/60 border border-slate-800 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${t.type === 'income' ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                        <div>
                          <p className="text-sm font-medium text-slate-200">{t.text}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-slate-400">
                              {t.category}
                            </span>
                            <span className="text-[11px] text-slate-500">{t.date}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`text-sm font-semibold ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                        </span>
                        <button
                          onClick={() => handleDeleteTransaction(t.id)}
                          className="text-slate-600 hover:text-rose-400 p-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
