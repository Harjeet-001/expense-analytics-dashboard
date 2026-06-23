import React, { useState, useEffect } from 'react';

// Injection of clean structural font and core theme engine assets
if (!document.getElementById('theme-assets')) {
  const linkFont = document.createElement('link');
  linkFont.rel = 'stylesheet';
  linkFont.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap';
  document.head.appendChild(linkFont);

  const tailwindScript = document.createElement('script');
  tailwindScript.id = 'theme-assets';
  tailwindScript.src = 'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4';
  document.head.appendChild(tailwindScript);
}

export default function App() {
  // Primary Transactions State
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('premium_ledger_v2');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Enterprise Retainer Credit', amount: 6500, type: 'income', category: 'Salary', date: '2026-06-01' },
      { id: 2, text: 'Hardware Infrastructure Procurement', amount: 420.50, type: 'expense', category: 'Shopping', date: '2026-06-12' },
      { id: 3, text: 'Distributed Database Cluster Host', amount: 115.00, type: 'expense', category: 'Utilities', date: '2026-06-18' },
      { id: 4, text: 'Client Advisory Luncheon', amount: 85.00, type: 'expense', category: 'Food', date: '2026-06-20' }
    ];
  });

  // Savings Allocation Engine States
  const [savingsGoal, setSavingsGoal] = useState(() => parseFloat(localStorage.getItem('savings_target') || '10000'));
  const [savingsCurrent, setSavingsCurrent] = useState(() => parseFloat(localStorage.getItem('savings_saved') || '3450'));
  const [goalInput, setGoalInput] = useState('');
  const [depositInput, setDepositInput] = useState('');

  // Transaction Input Buffer States
  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');

  // Persistence Matrix
  useEffect(() => {
    localStorage.setItem('premium_ledger_v2', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('savings_target', savingsGoal.toString());
    localStorage.setItem('savings_saved', savingsCurrent.toString());
  }, [savingsGoal, savingsCurrent]);

  // Quantitative Financial Engineering Analytics
  const amounts = transactions.map(t => t.type === 'income' ? t.amount : -t.amount);
  const totalBalance = amounts.reduce((acc, item) => acc + item, 0);
  const totalIncome = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0);
  const totalExpense = amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1;

  // Structural Category Breakdown Vector
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
    <div className="min-h-screen bg-[#070809] text-[#D1D4DC] font-['Inter',sans-serif] flex flex-col md:flex-row antialiased">
      
      {/* MINIMALIST SIDEBAR ARCHITECTURE */}
      <aside className="w-full md:w-64 bg-[#0E1013] border-b md:border-b-0 md:border-r border-[#1B1E22] p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center font-mono font-bold text-black text-sm select-none">FT</div>
            <span className="text-sm font-bold tracking-[0.15em] text-white uppercase font-mono">FINTRACK MACRO</span>
          </div>
          
          <nav className="space-y-1">
            {['Terminal', 'Analytics', 'Ledger', 'Vaults', 'System Configurations'].map((item, index) => (
              <div key={item} className={`px-3 py-2.5 rounded-md text-xs font-medium tracking-wide transition select-none ${index === 0 ? 'bg-[#171A1F] text-white' : 'text-[#7A8294] hover:text-white hover:bg-[#121418]'}`}>
                {item}
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-8 pt-6 border-t border-[#1B1E22] hidden md:block">
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-wider text-[#525966]">
            <span className="w-1.5 h-1.5 rounded-full bg-white opacity-40 animate-pulse"></span>
            SECURE ENGINE v2.6.1
          </div>
        </div>
      </aside>

      {/* CORE WORKSPACE ENVIRONMENT */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-x-hidden">
        
        {/* STRUCTURAL ADMINISTRATIVE CONTROL HEADER */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1B1E22]">
          <div>
            <div className="text-[11px] font-mono tracking-[0.2em] text-[#7A8294] uppercase">Account Operations Workspace</div>
            <h1 className="text-xl font-bold text-white tracking-tight mt-1">System Controller Ledger</h1>
          </div>
          
          {/* USER PROFILE CONTEXT COMPONENT */}
          <div className="flex items-center gap-4 bg-[#0E1013] border border-[#1B1E22] pl-4 pr-3 py-2 rounded-xl">
            <div className="text-right">
              <div className="text-xs font-bold text-white">Harjeet</div>
              <div className="text-[10px] font-mono tracking-wide text-[#7A8294] mt-0.5">ADMIN SECURITY CLEARANCE</div>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#1D2127] border border-[#2B313A] flex items-center justify-center font-mono text-xs font-bold text-white select-none">
              HJ
            </div>
          </div>
        </header>

        {/* METRICS DISPATCH VECTOR PANELS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#0E1013] p-6 rounded-xl border border-[#1B1E22]">
            <span className="text-[10px] font-mono font-medium tracking-[0.15em] text-[#7A8294] uppercase">Net Asset Balance</span>
            <div className="text-2xl font-semibold text-white tracking-tight font-mono mt-2">${totalBalance.toFixed(2)}</div>
          </div>
          <div className="bg-[#0E1013] p-6 rounded-xl border border-[#1B1E22]">
            <span className="text-[10px] font-mono font-medium tracking-[0.15em] text-[#7A8294] uppercase">Inflow Stream Volumetrics</span>
            <div className="text-2xl font-semibold text-white tracking-tight font-mono mt-2">${totalIncome.toFixed(2)}</div>
          </div>
          <div className="bg-[#0E1013] p-6 rounded-xl border border-[#1B1E22]">
            <span className="text-[10px] font-mono font-medium tracking-[0.15em] text-[#7A8294] uppercase">Outflow Volumetrics Layer</span>
            <div className="text-2xl font-semibold text-white tracking-tight font-mono mt-2">${totalExpense.toFixed(2)}</div>
          </div>
        </div>

        {/* INTERACTIVE DATA CHARTS & GRAPH SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* DATA TREND TELEMETRY CHART */}
          <div className="lg:col-span-2 bg-[#0E1013] p-6 rounded-xl border border-[#1B1E22] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] font-mono tracking-wider font-semibold text-white uppercase">Operational Cashflow Volumetrics</span>
                <span className="text-[10px] font-mono text-[#7A8294]">NATIVE HISTOGRAM DEPLOYMENT</span>
              </div>
              <p className="text-xs text-[#7A8294] mb-6">Visual matrix comparing gross transaction values mapped chronologically.</p>
            </div>
            
            {/* CLEAN EMBEDDED MICRO BAR GRAPH ENGINE */}
            <div className="h-44 flex items-end gap-3 px-2 border-b border-l border-[#1B1E22] pb-2 pt-4">
              <div className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="w-full bg-[#1F242E] border border-[#303747] rounded-t transition-all group-hover:bg-white" style={{ height: totalIncome > 0 ? `${Math.max(10, (totalIncome / (totalIncome + totalExpense)) * 100)}%` : '10%' }}></div>
                <span className="text-[9px] font-mono text-[#525966] mt-2">GROSS INFLOW</span>
              </div>
              <div className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="w-full bg-[#261A1C] border border-[#402A2E] rounded-t transition-all group-hover:bg-white" style={{ height: totalExpense > 0 ? `${Math.max(10, (totalExpense / (totalIncome + totalExpense)) * 100)}%` : '10%' }}></div>
                <span className="text-[9px] font-mono text-[#525966] mt-2">GROSS OUTFLOW</span>
              </div>
              <div className="flex-1 flex flex-col items-center h-full justify-end group">
                <div className="w-full bg-[#202226] border border-[#333740] rounded-t transition-all group-hover:bg-white" style={{ height: '45%' }}></div>
                <span className="text-[9px] font-mono text-[#525966] mt-2">SYSTEM AVERAGE</span>
              </div>
            </div>
          </div>

          {/* CAPITAL RESERVE VAULT (SAVINGS ALLOCATION ENGINE) */}
          <div className="bg-[#0E1013] p-6 rounded-xl border border-[#1B1E22] flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-mono tracking-wider font-semibold text-white uppercase mb-1">Capital Liquidity Reserve</div>
              <p className="text-xs text-[#7A8294] mb-4">Strategic capital vault goals and velocity tracking vector maps.</p>
              
              <div className="space-y-4 bg-[#070809] p-4 rounded-lg border border-[#1B1E22] font-mono">
                <div className="flex justify-between text-xs">
                  <span className="text-[#7A8294]">Target Threshold:</span>
                  <span className="text-white font-medium">${savingsGoal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[#7A8294]">Secured Liquidity:</span>
                  <span className="text-white font-medium">${savingsCurrent.toFixed(2)}</span>
                </div>
                <div className="space-y-1 pt-1">
                  <div className="w-full bg-[#121418] h-2 rounded-full overflow-hidden border border-[#1B1E22]">
                    <div className="bg-white h-full transition-all duration-500" style={{ width: `${Math.min(100, parseFloat(savingsProgressPercentage))}%` }}></div>
                  </div>
                  <div className="text-right text-[10px] text-[#7A8294] font-semibold">{savingsProgressPercentage}% Completed</div>
                </div>
              </div>
            </div>

            {/* INTEGRATED VAULT MANAGEMENT CONTROLS */}
            <div className="space-y-2 mt-4">
              <form onSubmit={handleAddDeposit} className="flex gap-2">
                <input type="number" step="0.01" value={depositInput} onChange={(e) => setDepositInput(e.target.value)} placeholder="Deposit Amount ($)" className="flex-1 bg-[#070809] border border-[#1B1E22] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-white placeholder-[#414754]"/>
                <button type="submit" className="bg-[#171A1F] hover:bg-white text-white hover:text-black font-semibold text-xs px-3 rounded-lg transition border border-[#2B313A] cursor-pointer">Inject</button>
              </form>
              <form onSubmit={handleUpdateGoal} className="flex gap-2">
                <input type="number" step="0.01" value={goalInput} onChange={(e) => setGoalInput(e.target.value)} placeholder="Modify Strategy Target ($)" className="flex-1 bg-[#070809] border border-[#1B1E22] rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-white placeholder-[#414754]"/>
                <button type="submit" className="bg-[#070809] hover:bg-white text-[#7A8294] hover:text-black font-semibold text-xs px-3 rounded-lg transition border border-[#1B1E22] cursor-pointer">Modify</button>
              </form>
            </div>
          </div>
        </div>

        {/* DATA UTILITY SYSTEM OPERATIONS CORE */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* TRANSACTION DISPATCH CONTROL COMPONENT */}
          <div className="bg-[#0E1013] p-6 rounded-xl border border-[#1B1E22] h-fit">
            <h2 className="text-xs font-mono font-bold tracking-wider text-white uppercase mb-5">Deploy Ledger Modification</h2>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div className="grid grid-cols-2 gap-2 p-1 bg-[#070809] rounded-lg border border-[#1B1E22]">
                {['expense', 'income'].map(m => (
                  <button type="button" key={m} onClick={() => setType(m)} 
                    className={`py-2 text-xs font-mono font-medium rounded transition capitalize ${type === m ? 'bg-[#171A1F] text-white border border-[#2B313A]' : 'text-[#7A8294] hover:text-white'}`}>{m}</button>
                ))}
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider text-[#525966] uppercase">Descriptor Tag</label>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Allocation Reference Label" className="w-full bg-[#070809] border border-[#1B1E22] rounded-lg px-4 py-2.5 text-xs text-white placeholder-[#414754] focus:outline-none focus:border-white font-mono"/>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider text-[#525966] uppercase">Financial Valuation Matrix</label>
                <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00 USD" className="w-full bg-[#070809] border border-[#1B1E22] rounded-lg px-4 py-2.5 text-xs text-white placeholder-[#414754] focus:outline-none focus:border-white font-mono"/>
              </div>

              {type === 'expense' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider text-[#525966] uppercase">System Overhead Domain Mapping</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-[#070809] border border-[#1B1E22] rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-white font-mono">
                    {['Food', 'Utilities', 'Transportation', 'Entertainment', 'Shopping', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}
              
              <button type="submit" className="w-full bg-white text-black font-semibold py-3 rounded-lg transition hover:bg-[#D1D4DC] cursor-pointer text-xs uppercase tracking-wider font-mono">Commit Block Entry</button>
            </form>
          </div>

          {/* CHRONOLOGICAL DATA MATRIX LOG FILE */}
          <div className="xl:col-span-2">
            <div className="bg-[#0E1013] p-6 rounded-xl border border-[#1B1E22] h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-mono font-bold tracking-wider text-white uppercase">System Ledger Registry</h2>
                <span className="text-[10px] font-mono text-[#525966]">REALTIME HISTORICAL STACK</span>
              </div>

              <div className="space-y-2 flex-1 overflow-y-auto max-h-[460px] pr-1">
                {transactions.length === 0 ? (
                  <div className="text-center py-12 text-[#525966] border border-dashed border-[#1B1E22] rounded-lg text-xs font-mono">Zero entry events registered in this system frame.</div>
                ) : (
                  transactions.map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-4 bg-[#070809]/40 hover:bg-[#070809] rounded-lg border border-[#1B1E22] transition group">
                      <div className="flex items-center gap-4">
                        <div className={`w-1 h-6 rounded-full ${t.type === 'income' ? 'bg-white opacity-60' : 'bg-[#3B3E45]'}`} />
                        <div>
                          <p className="text-xs font-semibold text-white tracking-tight">{t.text}</p>
                          <p className="text-[10px] font-mono text-[#7A8294] mt-0.5">{t.category.toUpperCase()} • {t.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-5">
                        <span className="text-xs font-mono font-semibold text-white">{t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}</span>
                        <button onClick={() => handleDeleteTransaction(t.id)} className="text-[#414754] hover:text-white transition text-xs cursor-pointer p-1" title="Delete block instance">✕</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* STRUCTURAL OVERHEAD OVERVIEW SUMMARY MATRIX */}
        <div className="bg-[#0E1013] p-6 rounded-xl border border-[#1B1E22]">
          <h2 className="text-xs font-mono font-bold tracking-wider text-white uppercase mb-5">System Resource Structural Burden Breakdown</h2>
          {Object.keys(categoryTotals).length === 0 ? (
            <p className="text-xs font-mono text-[#525966] italic">Awaiting overhead transaction logs to populate matrix maps.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Object.entries(categoryTotals).map(([cat, amt]) => {
                const percentage = totalExpense > 0 ? ((amt / totalExpense) * 100).toFixed(0) : 0;
                return (
                  <div key={cat} className="bg-[#070809]/50 p-4 rounded-lg border border-[#1B1E22] space-y-2">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="font-semibold text-white uppercase">{cat}</span>
                      <span className="text-[#7A8294]">{percentage}%</span>
                    </div>
                    <div className="w-full bg-[#121418] h-1 rounded-full overflow-hidden border border-[#1B1E22]">
                      <div className="bg-white h-full opacity-80" style={{ width: `${percentage}%` }}/>
                    </div>
                    <p className="text-sm font-semibold text-white font-mono tracking-tight">${amt.toFixed(2)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
