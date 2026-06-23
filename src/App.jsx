import React, { useState, useEffect } from 'react';

// Injection of Google Font and Tailwind CSS for instant professional look
if (!document.getElementById('theme-assets')) {
  // Clear any existing injections to prevent conflicts
  document.getElementById('tailwind-cdn')?.remove();
  
  const linkFont = document.createElement('link');
  linkFont.rel = 'stylesheet';
  linkFont.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  document.head.appendChild(linkFont);

  const tailwindScript = document.createElement('script');
  tailwindScript.id = 'theme-assets';
  tailwindScript.src = 'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4';
  document.head.appendChild(tailwindScript);
}

// Minimalist Icons
const Icon = ({ name, className }) => {
  const icons = {
    income: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m3 16 4 4 4-4m-4 4V9a4 4 0 0 1 4-4h1"/></svg>,
    expense: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21 16-4 4-4-4m4 4V9a4 4 0 0 0-4-4h-1"/></svg>,
    balance: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 15h2a3 3 0 1 0 0-6h-2c-2 0-4 1-4 4s2 4 4 4Zm1-13v2m0 16v2M5 15a4 4 0 1 0 0-8M19 9a4 4 0 1 0 0 8"/></svg>,
    delete: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>,
    settings: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>,
    notification: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9m7.3 13a3 3 0 0 1-5.6 0"/></svg>
  };
  return React.cloneElement(icons[name] || <span/>, { className });
};

export default function App() {
  // Use state to store the active tab/section
  const [activeView, setActiveView] = useState('dashboard');
  
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('pro_expense_v1');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Salary Credit', amount: 5000, type: 'income', category: 'Salary', date: '2026-06-01' },
      { id: 2, text: 'City Grocers', amount: 185.50, type: 'expense', category: 'Food', date: '2026-06-20' },
      { id: 3, text: 'Cloud Server Host', amount: 45.00, type: 'expense', category: 'Utilities', date: '2026-06-22' }
    ];
  });

  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');

  useEffect(() => {
    localStorage.setItem('pro_expense_v1', JSON.stringify(transactions));
  }, [transactions]);

  // Financial Calculations
  const amounts = transactions.map(t => t.type === 'income' ? t.amount : -t.amount);
  const totalBalance = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expense = (amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

  // Category summary calculation for analytics
  const categoryTotals = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!text.trim() || !amount || parseFloat(amount) <= 0) return;

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
    <div className="min-h-screen bg-[#0A0B0D] text-[#E0E0E0] font-['Inter', sans-serif] flex">
      
      {/* PROFESSIONAL SIDE NAVIGATION */}
      <aside className="w-64 bg-[#111215] border-r border-[#1F2127] p-6 flex flex-col hidden md:flex">
        <div className="mb-12 flex items-center gap-3">
          <div className="p-2.5 bg-[#0A0B0D] border border-[#2A2D35] rounded-xl text-white font-bold text-xl">FP</div>
          <h1 className="text-xl font-bold text-white tracking-tight">FinTrack <span className="text-[#A1A7B3] font-medium">Pro</span></h1>
        </div>
        
        <nav className="space-y-3 flex-1">
          {['Dashboard', 'Analytics', 'Transactions', 'Budgets', 'Settings'].map(item => (
            <button key={item} 
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-3.5 transition ${activeView === item.toLowerCase() ? 'bg-[#1F2127] text-white' : 'text-[#A1A7B3] hover:text-white hover:bg-[#1A1C21]'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${activeView === item.toLowerCase() ? 'bg-white' : 'bg-transparent'}`}/>
              {item}
            </button>
          ))}
        </nav>
        
        <div className="bg-[#1A1C21] p-4 rounded-xl border border-[#2A2D35] text-center mt-8">
          <p className="text-xs text-[#A1A7B3]">Upgrade to Pro</p>
          <p className="text-sm font-semibold text-white mt-1">Unlock Advanced Reporting</p>
          <button className="w-full bg-white text-black text-xs font-semibold py-2.5 rounded-lg mt-4 cursor-pointer">Learn More</button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-5 md:p-10 space-y-10">
        
        {/* HEADER & PROFILE */}
        <header className="flex items-center justify-between gap-6 pb-6 border-b border-[#1F2127]">
          <div>
            <h1 className="text-2xl font-bold text-white">Good Morning, Harjeet</h1>
            <p className="text-[#A1A7B3] text-sm mt-1">Here is a quick snapshot of your finances today.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-full text-[#A1A7B3] hover:text-white hover:bg-[#1F2127] cursor-pointer relative">
              <Icon name="notification" className="w-5 h-5"/>
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-[#0A0B0D]"/>
            </button>
            
            {/* COMPACT PROFILE WIDGET */}
            <div className="flex items-center gap-3.5 pl-4 border-l border-[#1F2127]">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">Harjeet Gowda</p>
                <p className="text-xs text-[#A1A7B3]">Premium Member</p>
              </div>
              <div className="relative">
                <img src="https://avatar.vercel.sh/harjeet.png?u=pro" alt="Avatar" className="w-11 h-11 rounded-full border-2 border-[#1F2127]"/>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0A0B0D]"/>
              </div>
            </div>
          </div>
        </header>

        {/* FINANCIAL SUMMARY CARDS - PROFESSIONAL STYLE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#111215] p-7 rounded-2xl border border-[#1F2127] shadow-lg flex items-center gap-6">
            <div className="p-4 bg-[#1A1C21] rounded-2xl text-white border border-[#2A2D35]"><Icon name="balance" className="w-8 h-8"/></div>
            <div>
              <p className="text-xs font-semibold text-[#A1A7B3] uppercase tracking-wider">Total Balance</p>
              <h3 className={`text-3xl font-bold mt-1.5 ${totalBalance >= 0 ? 'text-white' : 'text-rose-400'}`}>${totalBalance}</h3>
            </div>
          </div>
          <div className="bg-[#111215] p-7 rounded-2xl border border-[#1F2127] shadow-lg flex items-center gap-6">
            <div className="p-4 bg-[#1A1C21] rounded-2xl text-emerald-400 border border-[#2A2D35]"><Icon name="income" className="w-8 h-8"/></div>
            <div>
              <p className="text-xs font-semibold text-[#A1A7B3] uppercase tracking-wider">Monthly Income</p>
              <h3 className="text-3xl font-bold text-emerald-400 mt-1.5">${income}</h3>
            </div>
          </div>
          <div className="bg-[#111215] p-7 rounded-2xl border border-[#1F2127] shadow-lg flex items-center gap-6">
            <div className="p-4 bg-[#1A1C21] rounded-2xl text-rose-400 border border-[#2A2D35]"><Icon name="expense" className="w-8 h-8"/></div>
            <div>
              <p className="text-xs font-semibold text-[#A1A7B3] uppercase tracking-wider">Monthly Expenses</p>
              <h3 className="text-3xl font-bold text-rose-400 mt-1.5">${expense}</h3>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT SPLIT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* LOGGING FORM */}
          <div className="bg-[#111215] p-8 rounded-2xl border border-[#1F2127] shadow-lg">
            <h2 className="text-xl font-bold text-white mb-6">Log New Transaction</h2>
            <form onSubmit={handleAddTransaction} className="space-y-5">
              <div className="grid grid-cols-2 gap-3 p-1 bg-[#1A1C21] rounded-xl border border-[#2A2D35]">
                {['expense', 'income'].map(m => (
                  <button type="button" key={m} onClick={() => setType(m)} 
                    className={`py-2.5 text-sm font-semibold rounded-lg transition capitalize ${type === m ? 'bg-white text-black' : 'text-[#A1A7B3] hover:text-white'}`}>{m}</button>
                ))}
              </div>
              <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Description (e.g., Office Rent)" className="w-full bg-[#1A1C21] border border-[#2A2D35] rounded-xl px-5 py-3 text-sm text-white placeholder-[#5A5E66] focus:outline-none focus:border-white focus:ring-1 focus:ring-white"/>
              <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount (0.00)" className="w-full bg-[#1A1C21] border border-[#2A2D35] rounded-xl px-5 py-3 text-sm text-white placeholder-[#5A5E66] focus:outline-none focus:border-white focus:ring-1 focus:ring-white"/>
              {type === 'expense' && (
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#1A1C21] border border-[#2A2D35] rounded-xl px-5 py-3 text-sm text-white focus:outline-none focus:border-white">
                  {['Food', 'Utilities', 'Transportation', 'Entertainment', 'Shopping', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              )}
              <button type="submit" className="w-full bg-white text-black font-bold py-3.5 rounded-xl transition hover:bg-[#E0E0E0] cursor-pointer mt-2 text-sm">Add to Ledger</button>
            </form>
          </div>

          {/* TRANSACTION HISTORY */}
          <div className="xl:col-span-2">
            <div className="bg-[#111215] p-8 rounded-2xl border border-[#1F2127] shadow-lg h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Recent Transactions</h2>
                <button className="text-sm font-medium text-[#A1A7B3] hover:text-white">View All</button>
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto max-h-[500px] pr-2">
                {transactions.length === 0 ? (
                  <div className="text-center py-12 text-[#5A5E66] border border-dashed border-[#2A2D35] rounded-xl text-sm">No transactions recorded.</div>
                ) : (
                  transactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-5 bg-[#1A1C21] hover:bg-[#1F2127] rounded-xl border border-[#2A2D35] transition">
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-lg border border-[#2A2D35] ${t.type === 'income' ? 'bg-[#1D2B24] text-emerald-400' : 'bg-[#2E1B1E] text-rose-400'}`}><Icon name={t.type === 'income' ? 'income' : 'expense'} className="w-5 h-5"/></div>
                        <div>
                          <p className="text-sm font-semibold text-white">{t.text}</p>
                          <p className="text-xs text-[#A1A7B3] mt-1">{t.category} • {t.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-5">
                        <span className={`text-sm font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>{t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}</span>
                        <button onClick={() => handleDeleteTransaction(t.id)} className="text-[#5A5E66] hover:text-rose-400 p-1 cursor-pointer"><Icon name="delete" className="w-4 h-4"/></button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* CATEGORY ANALYTICS BAR CHART STYLE */}
        <div className="bg-[#111215] p-8 rounded-2xl border border-[#1F2127] shadow-lg">
          <h2 className="text-xl font-bold text-white mb-6">Expense Analytics by Category</h2>
          {Object.keys(categoryTotals).length === 0 ? (
            <p className="text-sm text-[#5A5E66] italic">Log expenses to see distribution data.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
              {Object.entries(categoryTotals).map(([cat, amt]) => {
                const percentage = expense > 0 ? ((amt / expense) * 100).toFixed(0) : 0;
                return (
                  <div key={cat} className="bg-[#1A1C21] p-5 rounded-xl border border-[#2A2D35] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">{cat}</span>
                      <span className="text-xs text-[#A1A7B3]">{percentage}%</span>
                    </div>
                    <div className="w-full bg-[#0A0B0D] rounded-full h-1.5 overflow-hidden border border-[#2A2D35]">
                      <div className="bg-white h-full" style={{ width: `${percentage}%` }}/>
                    </div>
                    <p className="text-lg font-bold text-white">${amt.toFixed(2)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
