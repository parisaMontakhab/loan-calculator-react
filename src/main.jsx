import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Calculator, Euro, Info, ShieldCheck } from 'lucide-react';
import './styles.css';

const RATES = [7, 7.5, 8];
const DURATIONS = [36, 48, 60];
const DEFAULTS = {
  amount: 20000,
  rate: 7.5,
  duration: 60,
  setupFee: 300,
  insurance: 800,
};

const euroFormatter = new Intl.NumberFormat('it-IT', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
});

function formatEuro(value) {
  return euroFormatter.format(Number.isFinite(value) ? value : 0);
}

function calculateMonthlyPayment(principal, annualRate, months) {
  const monthlyRate = annualRate / 100 / 12;
  if (!principal || !months) return 0;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
}

function Field({ label, value, onChange, min = 0, helper }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <div className="relative">
        <Euro className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
        <input
          type="number"
          min={min}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-4 text-lg font-semibold text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
        />
      </div>
      {helper && <p className="mt-2 text-xs text-slate-500">{helper}</p>}
    </label>
  );
}

function OptionGroup({ label, options, value, onChange, suffix }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-slate-700">{label}</p>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => {
          const selected = option === value;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                selected
                  ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:bg-blue-50'
              }`}
            >
              {option}{suffix}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResultCard({ title, value, description, highlighted }) {
  return (
    <div className={`rounded-3xl border p-5 ${highlighted ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white'}`}>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className={`mt-2 text-3xl font-black ${highlighted ? 'text-blue-700' : 'text-slate-900'}`}>{value}</p>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function App() {
  const [amount, setAmount] = useState(DEFAULTS.amount);
  const [rate, setRate] = useState(DEFAULTS.rate);
  const [duration, setDuration] = useState(DEFAULTS.duration);
  const [setupFee, setSetupFee] = useState(DEFAULTS.setupFee);
  const [insurance, setInsurance] = useState(DEFAULTS.insurance);

  const results = useMemo(() => {
    const baseAmount = Math.max(0, amount || 0);
    const financedSetupFee = Math.max(0, setupFee || 0);
    const financedInsurance = Math.max(0, insurance || 0);
    const financedAmount = baseAmount + financedSetupFee + financedInsurance;
    const monthlyPayment = calculateMonthlyPayment(financedAmount, rate, duration);
    const totalRepayment = monthlyPayment * duration;
    const totalInterest = totalRepayment - financedAmount;

    return { financedAmount, monthlyPayment, totalRepayment, totalInterest };
  }, [amount, rate, duration, setupFee, insurance]);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-[2rem] bg-gradient-to-br from-blue-700 to-slate-900 p-8 text-white shadow-2xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold ring-1 ring-white/20">
                <Calculator className="h-4 w-4" /> Simulatore prestito
              </div>
              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">Calcola la tua rata in modo semplice</h1>
              <p className="mt-4 max-w-2xl text-blue-100">
                Inserisci importo, TAN, durata, istruttoria e polizza. Le spese sono finanziate dentro il prestito per mostrare una rata completa e realistica.
              </p>
            </div>
            <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/20">
              <p className="text-sm text-blue-100">Rata stimata</p>
              <p className="mt-1 text-4xl font-black">{formatEuro(results.monthlyPayment)}</p>
              <p className="mt-1 text-sm text-blue-100">per {duration} mesi</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-200/70">
            <h2 className="mb-6 text-2xl font-black">Dati del finanziamento</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Importo richiesto" value={amount} onChange={setAmount} helper="Valore iniziale consigliato: 20.000 €" />
              <Field label="Spese di istruttoria" value={setupFee} onChange={setSetupFee} helper="Finanziate dentro l’importo" />
              <Field label="Polizza" value={insurance} onChange={setInsurance} helper="Inseribile manualmente" />
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-600">Capitale finanziato</p>
                <p className="mt-2 text-2xl font-black text-slate-900">{formatEuro(results.financedAmount)}</p>
                <p className="mt-2 text-xs text-slate-500">Importo + istruttoria + polizza</p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <OptionGroup label="TAN annuo" options={RATES} value={rate} onChange={setRate} suffix="%" />
              <OptionGroup label="Durata" options={DURATIONS} value={duration} onChange={setDuration} suffix=" mesi" />
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] bg-white p-6 shadow-xl shadow-slate-200/70">
              <h2 className="mb-5 text-2xl font-black">Risultato</h2>
              <div className="grid gap-4">
                <ResultCard highlighted title="Rata mensile" value={formatEuro(results.monthlyPayment)} description="Importo indicativo da pagare ogni mese." />
                <ResultCard title="Totale da rimborsare" value={formatEuro(results.totalRepayment)} description="Somma di tutte le rate del piano." />
                <ResultCard title="Interessi totali" value={formatEuro(results.totalInterest)} description="Differenza tra totale rimborsato e capitale finanziato." />
              </div>
            </div>

            <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6">
              <div className="flex gap-3">
                <ShieldCheck className="mt-1 h-6 w-6 flex-none text-emerald-700" />
                <div>
                  <h3 className="font-black text-emerald-950">Scelta progettuale</h3>
                  <p className="mt-2 text-sm leading-6 text-emerald-900">
                    Ho scelto di finanziare istruttoria e polizza dentro l’importo totale. Così il cliente non paga subito 1.100 € a parte e vede una rata più completa e vicina al costo reale.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6">
              <div className="flex gap-3">
                <Info className="mt-1 h-6 w-6 flex-none text-amber-700" />
                <p className="text-sm leading-6 text-amber-900">
                  Questo simulatore ha valore indicativo. Il TAN non include eventuali altri costi non inseriti manualmente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
