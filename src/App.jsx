import React, { useState, useEffect } from 'react';

// Premium typography engine setup
if (!document.getElementById('theme-assets')) {
  const linkFont = document.createElement('link');
  linkFont.rel = 'stylesheet';
  linkFont.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap';
  document.head.appendChild(linkFont);

  const tailwindScript = document.createElement('script');
  tailwindScript.id = 'theme-assets';
  tailwindScript.src = 'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4';
  document.head.appendChild(tailwindScript);
}

export default function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('premium_ledger_v3');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Project Milestone Payment', amount: 6500, type: 'income', category: 'Salary', date: '2026-06-01' },
      { id: 2, text: 'Server Infrastructure Infrastructure', amount: 420.50, type: 'expense', category: 'Utilities', date: '2026-06-12' },
      { id: 3, text: 'Office Hardware Logistics', amount: 115.00, type: 'expense', category: 'Shopping', date: '2026-06-18' },
      { id: 4, text: 'Client Premium Dinner', amount: 85.00, type: 'expense', category: 'Food', date: '2026-06-20' }
    ];
  });

  const [savingsGoal, setSavingsGoal] = useState(() => parseFloat(localStorage.getItem('savings_target_v3') || '10000'));
  const [savingsCurrent, setSavingsCurrent] = useState(() => parseFloat(localStorage.getItem('savings_saved_v3') || '3450'));
  const [goalInput, setGoalInput] = useState('');
  const [depositInput, setDepositInput] = useState('');

  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');

  useEffect(() => {
    localStorage.setItem('premium_ledger_v3', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('savings_target_v3', savingsGoal.toString());
    localStorage.setItem('savings_saved_v3', savingsCurrent.toString());
  }, [savingsGoal, savingsCurrent]);

  const amounts = transactions.map(t => t.type === 'income' ? t.amount : -t.amount);
  const totalBalance = amounts.reduce((acc, item) => acc + item, 0);
  const totalIncome = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0);
  const totalExpense = amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1;

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
      text: text.trim(),
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

  const handleUpdateGoal = (e) => {
    e.preventDefault();
    if (!goalInput || parseFloat(goalInput) < 0) return;
    setSavingsGoal(parseFloat(goalInput));
    setGoalInput('');
  };

  const handleAddDeposit = (e) => {
    e.preventDefault();
    if (!depositInput || parseFloat(depositInput) <= 0) return;
    setSavingsCurrent(prev => Math.min(savingsGoal, prev + parseFloat(depositInput)));
    setDepositInput('');
  };

  const savingsProgressPercentage = savingsGoal > 0 ? ((savingsCurrent / savingsGoal) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6] font-['Plus_Jakarta_Sans',sans-serif] p-4 md:p-8 antialiased">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* PREMIUM GLOBAL NAVBAR */}
        <header className="bg-[#121420]/80 backdrop-blur-md p-6 rounded-2xl border border-[#23273B] flex items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
              𝘍
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight">FinTrack Pro</h1>
              <p className="text-xs text-[#8A94A6] font-medium">Personal Finance Portfolio</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold text-white">Harjeet</div>
              <div className="text-[11px] font-medium text-violet-400">Premium Controller Account</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 p-[1px]">
              <div className="w-full h-full bg-[#121420] rounded-[11px] flex items-center justify-center font-bold text-xs text-white">
                HJ
              </div>
            </div>
          </div>
        </header>

        {/* HIGH CONTRAST BALANCES PANEL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#121420] p-6 rounded-2xl border border-[#23273B] shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
            <span className="text-xs font-semibold text-[#8A94A6] tracking-wide uppercase">Net Holdings Position</span>
            <div className="text-3xl font-bold text-white tracking-tight mt-2">${totalBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          </div>
          <div className="bg-[#121420] p-6 rounded-2xl border border-[#23273B] shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
            <span className="text-xs font-semibold text-[#8A94A6] tracking-wide uppercase">Gross Monthly Inflow</span>
            <div className="text-3xl font-bold text-emerald-400 tracking-tight mt-2">${totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          </div>
          <div className="bg-[#121420] p-6 rounded-2xl border border-[#23273B] shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl"></div>
            <span className="text-xs font-semibold text-[#8A94A6] tracking-wide uppercase">Gross Monthly Outflow</span>
            <div className="text-3xl font-bold text-rose-400 tracking-tight mt-2">${totalExpense.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
          </div>
        </div>

        {/* ANALYTICS CHARTS & VAULT INTERFACING CONTAINER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLORED BAR CHART COMPONENT */}
          <div className="lg:col-span-2 bg-[#121420] p-6 rounded-2xl border border-[#23273B] shadow-lg flex flex-col justify-between">
            <div>
              <span className="text-sm font-bold text-white tracking-tight">Financial Stream Volumetrics</span>
              <p className="text-xs text-[#8A94A6] mt-1">Live data distribution representation mapping real-time operational flows.</p>
            </div>
            
            <div className="h-48 flex items-end gap-6 px-4 border-b border-[#23273B] pb-3 pt-6 mt-6">
              <div className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-xl transition-all shadow-lg shadow-emerald-500/10 group-hover:brightness-110" style={{ height: totalIncome > 0 ? `${Math.max(15, (totalIncome / (totalIncome + totalExpense)) * 100)}%` : '15%' }}></div>
                <span className="text-xs font-semibold text-[#8A94A6] mt-3">Gross Inflow</span>
              </div>
              <div className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="w-full bg-gradient-to-t from-rose-600 to-rose-400 rounded-xl transition-all shadow-lg shadow-rose-500/10 group-hover:brightness-110" style={{ height: totalExpense > 0 ? `${Math.max(15, (totalExpense / (totalIncome + totalExpense)) * 100)}%` : '15%' }}></div>
                <span className="text-xs font-semibold text-[#8A94A6] mt-3">Gross Outflow</span>
              </div>
              <div className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-xl transition-all shadow-lg shadow-indigo-500/10 group-hover:brightness-110" style={{ height: '55%' }}></div>
                <span className="text-xs font-semibold text-[#8A94A6] mt-3">System Median</span>
              </div>
            </div>
          </div>

          {/* CAPITAL VAULT RESERVES COMPONENT */}
          <div className="bg-[#121420] p-6 rounded-2xl border border-[#23273B] shadow-lg flex flex-col justify-between">
            <div>
              <span className="text-sm font-bold text-white tracking-tight">Active Capital Vault Reserves</span>
              <p className="text-xs text-[#8A94A6] mt-1">Track asset allocation targets and liquidity progress bars.</p>
              
              <div className="space-y-4 bg-[#191D30] p-5 rounded-xl border border-[#2D3350] mt-5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#8A94A6]">Target Goal:</span>
                  <span className="text-white font-bold">${savingsGoal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#8A94A6]">Secured Capital:</span>
                  <span className="text-indigo-400 font-bold">${savingsCurrent.toLocaleString()}</span>
                </div>
                <div className="space-y-2 pt-1">
                  <div className="w-full bg-[#121420] h-2.5 rounded-full overflow-hidden p-[1px] border border-[#23273B]">
                    <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full transition-all duration-500 shadow-md shadow-indigo-500/30" style={{ width: `${Math.min(100, parseFloat(savingsProgressPercentage))}%` }}></div>
                  </div>
                  <div className="text-right text-xs font-bold text-indigo-400">{savingsProgressPercentage}% Completed</div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <form onSubmit={handleAddDeposit} className="flex gap-2">
                <input type="number" step="0.01" value={depositInput} onChange={(e) => setDepositInput(e.target.value)} placeholder="Deposit Amount ($)" className="flex-1 bg-[#191D30] border border-[#2D3350] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder-[#525A6C] font-medium"/>
                <button type="submit" className="bg-white text-[#090A0F] font-bold text-xs px-4 rounded-xl transition hover:bg-neutral-200 cursor-pointer">Inject</button>
              </form>
              <form onSubmit={handleUpdateGoal} className="flex gap-2">
                <input type="number" step="0.01" value={goalInput} onChange={(e) => setGoalInput(e.target.value)} placeholder="Update Vault Goal ($)" className="flex-1 bg-[#191D30] border border-[#2D3350] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder-[#525A6C] font-medium"/>
                <button type="submit" className="bg-[#121420] border border-[#23273B] text-white font-bold text-xs px-4 rounded-xl transition hover:bg-[#191D30] cursor-pointer">Modify</button>
              </form>
            </div>
          </div>
        </div>

        {/* INPUT TRANSACTIONS & HISTORY SPLIT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* LEDGER LOGGER FORM */}
          <div className="bg-[#121420] p-6 rounded-2xl border border-[#23273B] shadow-lg h-fit">
            <h2 className="text-sm font-bold text-white tracking-tight mb-5">Commit Account Entry</h2>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#191D30] rounded-xl border border-[#2D3350]">
                {['expense', 'income'].map(m => (
                  <button type="button" key={m} onClick={() => setType(m)} 
                    className={`py-2 text-xs font-bold rounded-lg transition capitalize ${type === m ? 'bg-white text-[#090A0F] shadow-md' : 'text-[#8A94A6] hover:text-white'}`}>{m}</button>
                ))}
              </div>
              
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#8A94A6] tracking-wide uppercase">Reference Tag</label>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g., Logistics Settlement" className="w-full bg-[#191D30] border border-[#2D3350] rounded-xl px-4 py-3 text-xs text-white placeholder-[#525A6C] focus:outline-none focus:border-indigo-500 font-medium"/>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#8A94A6] tracking-wide uppercase">Asset Value (USD)</label>
                <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-[#191D30] border border-[#2D3350] rounded-xl px-4 py-3 text-xs text-white placeholder-[#525A6C] focus:outline-none focus:border-indigo-500 font-medium"/>
              </div>

              {type === 'expense' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#8A94A6] tracking-wide uppercase">Category Dimension</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#191D30] border border-[#2D3350] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium">
                    {['Food', 'Utilities', 'Transportation', 'Entertainment', 'Shopping', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
              
              <button type="submit" className="w-full bg-[#090A0F] hover:bg-white text-white hover:text-black font-bold py-3.5 rounded-xl transition border border-[#23273B] cursor-pointer text-xs uppercase tracking-wider mt-2">Commit Entry</button>
            </form>
          </div>

          {/* CHRONOLOGICAL ACCOUNT TRANSACTIONS LISTING */}
          <div className="xl:col-span-2">
            <div className="bg-[#121420] p-6 rounded-2xl border border-[#23273B] shadow-lg h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white tracking-tight">Chronological Ledger Records</h2>
                <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 px-2 py-0.5 rounded-md">LIVE RELEASES</span>
              </div>

              <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[460px] pr-1">
                {transactions.length === 0 ? (
                  <div className="text-center py-12 text-[#525A6C] border border-dashed border-[#23273B] rounded-xl text-xs font-medium">Zero activity registered inside this frame.</div>
                ) : (
                  transactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-4 bg-[#191D30]/30 hover:bg-[#191D30]/70 rounded-xl border border-[#23273B] transition group">
                      <div className="flex items-center gap-4">
                        <div className={`w-1.5 h-6 rounded-full ${t.type === 'income' ? 'bg-emerald-400 shadow-md shadow-emerald-500/20' : 'bg-rose-400 shadow-md shadow-rose-500/20'}`} />
                        <div>
                          <p className="text-xs font-bold text-white tracking-tight">{t.text}</p>
                          <p className="text-[11px] font-medium text-[#8A94A6] mt-0.5">{c => c.toUpperCase()} {t.category} • {t.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-5">
                        <span className={`text-xs font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>{t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}</span>
                        <button onClick={() => handleDeleteTransaction(t.id)} className="text-[#525A6C] hover:text-rose-400 transition text-sm cursor-pointer p-1">✕</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* STRUCTURAL CATEGORICAL MATRIX */}
        <div className="bg-[#121420] p-6 rounded-2xl border border-[#23273B] shadow-lg">
          <h2 className="text-sm font-bold text-white tracking-tight mb-5">Categorical Expenditure Allocation Density</h2>
          {Object.keys(categoryTotals).length === 0 ? (
            <p className="text-xs text-[#525A6C] font-medium">Log outlays to populate analytical tracking parameters.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(categoryTotals).map(([cat, amt]) => {
                const percentage = totalExpense > 0 ? ((amt / totalExpense) * 100).toFixed(0) : 0;
                return (
                  <div key={cat} className="bg-[#191D30]/40 p-4 rounded-xl border border-[#23273B] space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#8A94A6]">{cat}</span>
                      <span className="text-white">{percentage}%</span>
                    </div>
                    <div className="w-full bg-[#121420] h-1.5 rounded-full overflow-hidden border border-[#23273B]">
                      <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full" style={{ width: `${percentage}%` }}/>
                    </div>
                    <p className="text-sm font-bold text-white tracking-tight">${amt.toFixed(2)}</p>
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
