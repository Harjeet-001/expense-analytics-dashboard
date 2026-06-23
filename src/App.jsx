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
  // Core Personal Finance Ledger (Income/Expense)
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('personal_ledger_inr_v1');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Monthly Salary Credit', amount: 75000, type: 'income', category: 'Salary', date: '2026-06-01' },
      { id: 2, text: 'House Rent', amount: 18000, type: 'expense', category: 'Rent & Living', date: '2026-06-02' },
      { id: 3, text: 'Supermarket Groceries', amount: 4500, type: 'expense', category: 'Food', date: '2026-06-12' },
      { id: 4, text: 'Internet & Electricity Bills', amount: 2200, type: 'expense', category: 'Bills', date: '2026-06-15' }
    ];
  });

  // Investments Matrix State Layer
  const [investments, setInvestments] = useState(() => {
    const saved = localStorage.getItem('personal_invest_inr_v1');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Nifty 50 Index Fund (SIP)', amount: 10000, type: 'Mutual Fund', date: '2026-06-05' },
      { id: 2, name: 'Bluechip Equity Stocks', amount: 15000, type: 'Stocks', date: '2026-06-10' }
    ];
  });

  // Savings Goal States
  const [savingsGoal, setSavingsGoal] = useState(() => parseFloat(localStorage.getItem('savings_goal_inr') || '50000'));
  const [savingsCurrent, setSavingsCurrent] = useState(() => parseFloat(localStorage.getItem('savings_current_inr') || '15000'));
  const [goalInput, setGoalInput] = useState('');
  const [depositInput, setDepositInput] = useState('');

  // Form Inputs Buffer
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [entryType, setEntryType] = useState('expense'); // expense, income, investment
  const [category, setCategory] = useState('Food');
  const [investType, setInvestType] = useState('Mutual Fund');

  // Sync Vectors to Storage Modality
  useEffect(() => {
    localStorage.setItem('personal_ledger_inr_v1', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('personal_invest_inr_v1', JSON.stringify(investments));
  }, [investments]);

  useEffect(() => {
    localStorage.setItem('savings_goal_inr', savingsGoal.toString());
    localStorage.setItem('savings_current_inr', savingsCurrent.toString());
  }, [savingsGoal, savingsCurrent]);

  // Quantitative Calculations
  const transactionAmounts = transactions.map(t => t.type === 'income' ? t.amount : -t.amount);
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const totalInvested = investments.reduce((acc, inv) => acc + inv.amount, 0);
  
  // Available Balance = Income - Expenses - Current Savings Goal Allocations - Total Investments
  const availableBalance = totalIncome - totalExpense - savingsCurrent - totalInvested;

  const categoryTotals = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  // Form Dispatch Controller
  const handleCreateRecord = (e) => {
    e.preventDefault();
    if (!text.trim() || !amount || parseFloat(amount) <= 0) return;

    const recordAmount = parseFloat(amount);
    const currentDate = new Date().toISOString().split('T')[0];

    if (entryType === 'investment') {
      const newInvestment = {
        id: Date.now(),
        name: text.trim(),
        amount: recordAmount,
        type: investType,
        date: currentDate
      };
      setInvestments([newInvestment, ...investments]);
    } else {
      const newTransaction = {
        id: Date.now(),
        text: text.trim(),
        amount: recordAmount,
        type: entryType,
        category: entryType === 'income' ? 'Salary' : category,
        date: currentDate
      };
      setTransactions([newTransaction, ...transactions]);
    }

    setText('');
    setAmount('');
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleDeleteInvestment = (id) => {
    setInvestments(investments.filter(i => i.id !== id));
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

  const savingsPercentage = savingsGoal > 0 ? ((savingsCurrent / savingsGoal) * 100).toFixed(1) : 0;
  const grandTotalGraphValue = totalIncome + totalExpense + totalInvested;

  return (
    <div className="min-h-screen bg-[#070913] text-[#F3F4F6] font-['Plus_Jakarta_Sans',sans-serif] p-4 md:p-8 antialiased">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* PREMIUM GLOBAL HEADER */}
        <header className="bg-[#0F1225]/90 backdrop-blur-md p-6 rounded-2xl border border-[#1E2342] flex items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 text-lg">
              ₹
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">FinTrack Personal</h1>
              <p className="text-xs text-[#8E99B3] font-medium">Rupee Wealth & Asset Allocation Workspace</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm font-bold text-white">Harjeet</div>
              <div className="text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md mt-0.5">Secure Dashboard</div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-[1px]">
              <div className="w-full h-full bg-[#070913] rounded-[11px] flex items-center justify-center font-bold text-xs text-white">HJ</div>
            </div>
          </div>
        </header>

        {/* METRICS METRIC OVERVIEW GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#0F1225] p-6 rounded-2xl border border-[#1E2342] shadow-lg">
            <span className="text-xs font-semibold text-[#8E99B3] tracking-wide uppercase">Available Balance</span>
            <div className="text-2xl font-bold text-indigo-400 tracking-tight mt-2">₹{availableBalance.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
          </div>
          <div className="bg-[#0F1225] p-6 rounded-2xl border border-[#1E2342] shadow-lg">
            <span className="text-xs font-semibold text-[#8E99B3] tracking-wide uppercase">Total Inflow (Income)</span>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight mt-2">₹{totalIncome.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
          </div>
          <div className="bg-[#0F1225] p-6 rounded-2xl border border-[#1E2342] shadow-lg">
            <span className="text-xs font-semibold text-[#8E99B3] tracking-wide uppercase">Total Outflow (Expenses)</span>
            <div className="text-2xl font-bold text-rose-400 tracking-tight mt-2">₹{totalExpense.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
          </div>
          <div className="bg-[#0F1225] p-6 rounded-2xl border border-[#1E2342] shadow-lg">
            <span className="text-xs font-semibold text-[#8E99B3] tracking-wide uppercase">Invested Capital</span>
            <div className="text-2xl font-bold text-amber-400 tracking-tight mt-2">₹{totalInvested.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
          </div>
        </div>

        {/* ANALYTICS VISUALS & SAVINGS OBJECTIVES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* HIGH CONTRAST COLORED BAR CHART COMPONENT */}
          <div className="lg:col-span-2 bg-[#0F1225] p-6 rounded-2xl border border-[#1E2342] shadow-lg flex flex-col justify-between">
            <div>
              <span className="text-sm font-bold text-white tracking-tight">Portfolio Distribution Profile</span>
              <p className="text-xs text-[#8E99B3] mt-1">Comparative metrics charting transaction volumes against loaded investment metrics.</p>
            </div>
            
            <div className="h-44 flex items-end gap-6 px-4 border-b border-[#1E2342] pb-3 pt-6 mt-6">
              <div className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="w-full bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-xl transition-all shadow-lg shadow-emerald-500/10" style={{ height: grandTotalGraphValue > 0 ? `${Math.max(15, (totalIncome / grandTotalGraphValue) * 100)}%` : '20%' }}></div>
                <span className="text-xs font-semibold text-[#8E99B3] mt-3">Gross Inflows</span>
              </div>
              <div className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="w-full bg-gradient-to-t from-rose-600 to-rose-400 rounded-t-xl transition-all shadow-lg shadow-rose-500/10" style={{ height: grandTotalGraphValue > 0 ? `${Math.max(15, (totalExpense / grandTotalGraphValue) * 100)}%` : '15%' }}></div>
                <span className="text-xs font-semibold text-[#8E99B3] mt-3">Expenses</span>
              </div>
              <div className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-xl transition-all shadow-lg shadow-amber-500/10" style={{ height: grandTotalGraphValue > 0 ? `${Math.max(15, (totalInvested / grandTotalGraphValue) * 100)}%` : '15%' }}></div>
                <span className="text-xs font-semibold text-[#8E99B3] mt-3">Investments</span>
              </div>
            </div>
          </div>

          {/* PERSONAL SAVINGS FUND TARGETS */}
          <div className="bg-[#0F1225] p-6 rounded-2xl border border-[#1E2342] shadow-lg flex flex-col justify-between">
            <div>
              <span className="text-sm font-bold text-white tracking-tight">Emergency & Cash Savings Vault</span>
              <p className="text-xs text-[#8E99B3] mt-1">Monitor dedicated cash liquid targets apart from assets.</p>
              
              <div className="space-y-4 bg-[#161B35] p-5 rounded-xl border border-[#262E5C] mt-5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#8E99B3]">Target Goal:</span>
                  <span className="text-white font-bold">₹{savingsGoal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-[#8E99B3]">Current Stash:</span>
                  <span className="text-emerald-400 font-bold">₹{savingsCurrent.toLocaleString('en-IN')}</span>
                </div>
                <div className="space-y-2 pt-1">
                  <div className="w-full bg-[#070913] h-2.5 rounded-full overflow-hidden border border-[#1E2342] p-[1px]">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 shadow-md shadow-emerald-500/20" style={{ width: `${Math.min(100, parseFloat(savingsPercentage))}%` }}></div>
                  </div>
                  <div className="text-right text-xs font-bold text-emerald-400">{savingsPercentage}% Saved</div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <form onSubmit={handleAddDeposit} className="flex gap-2">
                <input type="number" step="0.01" value={depositInput} onChange={(e) => setDepositInput(e.target.value)} placeholder="Add Cash Deposit (₹)" className="flex-1 bg-[#161B35] border border-[#262E5C] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium placeholder-[#596582]"/>
                <button type="submit" className="bg-white text-[#070913] font-bold text-xs px-4 rounded-xl transition hover:bg-neutral-200 cursor-pointer">Deposit</button>
              </form>
              <form onSubmit={handleUpdateGoal} className="flex gap-2">
                <input type="number" step="0.01" value={goalInput} onChange={(e) => setGoalInput(e.target.value)} placeholder="Update Goal Limit (₹)" className="flex-1 bg-[#161B35] border border-[#262E5C] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium placeholder-[#596582]"/>
                <button type="submit" className="bg-[#070913] border border-[#1E2342] text-white font-bold text-xs px-4 rounded-xl transition hover:bg-[#161B35] cursor-pointer">Modify</button>
              </form>
            </div>
          </div>
        </div>

        {/* INPUT TRANSACTIONS ENGINE & LEDGER MATRICES */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* COMPACT COMBINED DATA LOGGER FORM */}
          <div className="bg-[#0F1225] p-6 rounded-2xl border border-[#1E2342] shadow-lg h-fit">
            <h2 className="text-sm font-bold text-white tracking-tight mb-5">Commit Financial Entry</h2>
            <form onSubmit={handleCreateRecord} className="space-y-4">
              <div className="grid grid-cols-3 gap-1 p-1 bg-[#161B35] rounded-xl border border-[#262E5C]">
                {['expense', 'income', 'investment'].map(m => (
                  <button type="button" key={m} onClick={() => setEntryType(m)} 
                    className={`py-2 text-[11px] font-bold rounded-lg transition capitalize ${entryType === m ? 'bg-white text-[#070913] shadow-sm' : 'text-[#8E99B3] hover:text-white'}`}>{m}</button>
                ))}
              </div>
              
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#8E99B3] tracking-wide uppercase">Particulars Description</label>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder={entryType === 'investment' ? 'e.g., Tata Digital Fund' : 'e.g., Zomato Dinner'} className="w-full bg-[#161B35] border border-[#262E5C] rounded-xl px-4 py-3 text-xs text-white placeholder-[#596582] focus:outline-none focus:border-indigo-500 font-medium"/>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#8E99B3] tracking-wide uppercase">Value Amount (INR)</label>
                <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="₹ 0.00" className="w-full bg-[#161B35] border border-[#262E5C] rounded-xl px-4 py-3 text-xs text-white placeholder-[#596582] focus:outline-none focus:border-indigo-500 font-medium"/>
              </div>

              {entryType === 'expense' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#8E99B3] tracking-wide uppercase">Expense Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#161B35] border border-[#262E5C] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium">
                    {['Food', 'Rent & Living', 'Transportation', 'Bills', 'Shopping', 'Entertainment', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}

              {entryType === 'investment' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-[#8E99B3] tracking-wide uppercase">Investment Class</label>
                  <select value={investType} onChange={(e) => setInvestType(e.target.value)} className="w-full bg-[#161B35] border border-[#262E5C] rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium">
                    {['Mutual Fund', 'Stocks', 'Crypto', 'PPF / EPF', 'Gold Assets', 'Other Fixed Assets'].map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
              )}
              
              <button type="submit" className="w-full bg-white text-[#070913] font-bold py-3.5 rounded-xl transition hover:bg-neutral-200 cursor-pointer text-xs uppercase tracking-wider mt-2">Commit Asset Change</button>
            </form>
          </div>

          {/* ACTIVE CASHFLOW LEDGER */}
          <div className="xl:col-span-2 space-y-6">
            
            {/* EXPENSE/INCOME LEDGER RECORDS */}
            <div className="bg-[#0F1225] p-6 rounded-2xl border border-[#1E2342] shadow-lg flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white tracking-tight">Primary Cashflow Ledger</h2>
                <span className="text-[11px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">Live Book</span>
              </div>

              <div className="space-y-2.5 overflow-y-auto max-h-[220px] pr-1">
                {transactions.length === 0 ? (
                  <div className="text-center py-6 text-[#596582] border border-dashed border-[#1E2342] rounded-xl text-xs font-medium">No ledger records tracked.</div>
                ) : (
                  transactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-3.5 bg-[#161B35]/30 hover:bg-[#161B35]/70 rounded-xl border border-[#1E2342] transition">
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-6 rounded-full ${t.type === 'income' ? 'bg-emerald-400 shadow-md shadow-emerald-400/20' : 'bg-rose-400 shadow-md shadow-rose-400/20'}`} />
                        <div>
                          <p className="text-xs font-bold text-white tracking-tight">{t.text}</p>
                          <p className="text-[11px] font-medium text-[#8E99B3] mt-0.5">{t.category} • {t.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-5">
                        <span className={`text-xs font-bold ${t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>{t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}</span>
                        <button onClick={() => handleDeleteTransaction(t.id)} className="text-[#596582] hover:text-rose-400 transition text-sm cursor-pointer p-1">✕</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* NEW DEDICATED INVESTMENT HOLDINGS LEDGER */}
            <div className="bg-[#0F1225] p-6 rounded-2xl border border-[#1E2342] shadow-lg flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-white tracking-tight">Active Asset Holdings & Investments</h2>
                <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">Assets Ledger</span>
              </div>

              <div className="space-y-2.5 overflow-y-auto max-h-[220px] pr-1">
                {investments.length === 0 ? (
                  <div className="text-center py-6 text-[#596582] border border-dashed border-[#1E2342] rounded-xl text-xs font-medium">No strategic investment structures loaded.</div>
                ) : (
                  investments.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between p-3.5 bg-[#161B35]/30 hover:bg-[#161B35]/70 rounded-xl border border-[#1E2342] transition">
                      <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 rounded-full bg-amber-400 shadow-md shadow-amber-400/20" />
                        <div>
                          <p className="text-xs font-bold text-white tracking-tight">{inv.name}</p>
                          <p className="text-[11px] font-medium text-[#8E99B3] mt-0.5">{inv.type} • Allocated {inv.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-5">
                        <span className="text-xs font-bold text-amber-400">₹{inv.amount.toLocaleString('en-IN')}</span>
                        <button onClick={() => handleDeleteInvestment(inv.id)} className="text-[#596582] hover:text-amber-400 transition text-sm cursor-pointer p-1">✕</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
        
        {/* STRUCTURAL CATEGORY PROFILE SUMMARY */}
        <div className="bg-[#0F1225] p-6 rounded-2xl border border-[#1E2342] shadow-lg">
          <h2 className="text-sm font-bold text-white tracking-tight mb-5">Expenditure Density Breakdown</h2>
          {Object.keys(categoryTotals).length === 0 ? (
            <p className="text-xs text-[#596582] font-medium">Log outlays to populate metrics dashboards.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
              {Object.entries(categoryTotals).map(([cat, amt]) => {
                const percentage = totalExpense > 0 ? ((amt / totalExpense) * 100).toFixed(0) : 0;
                return (
                  <div key={cat} className="bg-[#161B35]/40 p-4 rounded-xl border border-[#1E2342] space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#8E99B3] text-[11px]">{cat}</span>
                      <span className="text-white text-[11px]">{percentage}%</span>
                    </div>
                    <div className="w-full bg-[#070913] h-1.5 rounded-full overflow-hidden border border-[#1E2342]">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full" style={{ width: `${percentage}%` }}/>
                    </div>
                    <p className="text-xs font-bold text-white tracking-tight">₹{amt.toLocaleString('en-IN')}</p>
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
