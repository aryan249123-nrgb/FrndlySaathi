'use client';

import React, { useState } from 'react';
import { Contract, PaymentMethod } from '@/types';
import { api } from '@/lib/api';
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Wallet, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  IndianRupee
} from 'lucide-react';

interface PaymentModalProps {
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ contract, isOpen, onClose, onSuccess }: PaymentModalProps) {
  const [amount, setAmount] = useState<number>(contract ? contract.agreedAmount : 25000);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [userTier, setUserTier] = useState<'STANDARD' | 'PREMIUM'>('STANDARD');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successTxn, setSuccessTxn] = useState<string | null>(null);

  if (!isOpen || !contract) return null;

  // Fee calculation reflecting the backend Strategy Pattern
  const feeRate = userTier === 'PREMIUM' ? 0.05 : 0.10;
  const calculatedFee = Math.round((amount * feeRate) * 100) / 100;
  const netEscrow = Math.max(0, Math.round((amount - calculatedFee) * 100) / 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.payments.process({
        contractId: contract.id,
        amount,
        paymentMethod,
        userTier,
      });
      setSuccessTxn(res.transactionId);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-[#e7e0d5] overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Secure Escrow Settlement</span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight">
            Release Milestone Payment
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Project: <strong className="text-stone-800">&quot;{contract.projectTitle}&quot;</strong>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successTxn ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Payment Successfully Settled!</h3>
            <p className="text-xs text-stone-500 font-mono">Reference ID: {successTxn}</p>
            <p className="text-xs text-emerald-800 font-medium">Funds successfully credited to freelancer escrow balance.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Milestone Amount (₹ INR)</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input
                  type="number"
                  required
                  min={500}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-emerald-700 focus:bg-white transition-colors font-mono"
                />
              </div>
            </div>

            {/* Payment Method Selector (Adapter Pattern) */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Payment Method Gateway</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('UPI')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'UPI'
                      ? 'bg-amber-50 border-amber-600 text-amber-900 shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mx-auto mb-1 text-amber-800" />
                  <span className="text-xs font-semibold block">UPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'CARD'
                      ? 'bg-amber-50 border-amber-600 text-amber-900 shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-stone-700" />
                  <span className="text-xs font-semibold block">Cards / Net Banking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('WALLET')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    paymentMethod === 'WALLET'
                      ? 'bg-amber-50 border-amber-600 text-amber-900 shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <Wallet className="w-5 h-5 mx-auto mb-1 text-stone-700" />
                  <span className="text-xs font-semibold block">Wallet</span>
                </button>
              </div>
            </div>

            {/* Fee Strategy Selector (Strategy Pattern) */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">Fee Tier Algorithm</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setUserTier('STANDARD')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    userTier === 'STANDARD'
                      ? 'bg-stone-100 border-amber-700 text-stone-900 font-semibold'
                      : 'bg-white border-stone-200 text-stone-600'
                  }`}
                >
                  <div className="font-semibold">Standard Tier</div>
                  <div className="text-[10px] text-stone-500">10% Platform fee (₹{Math.round(amount * 0.10).toLocaleString('en-IN')})</div>
                </button>

                <button
                  type="button"
                  onClick={() => setUserTier('PREMIUM')}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    userTier === 'PREMIUM'
                      ? 'bg-amber-50 border-amber-700 text-amber-900 font-semibold'
                      : 'bg-white border-stone-200 text-stone-600'
                  }`}
                >
                  <div className="font-semibold">Premium Tier</div>
                  <div className="text-[10px] text-amber-800">5% Discounted fee (₹{Math.round(amount * 0.05).toLocaleString('en-IN')})</div>
                </button>
              </div>
            </div>

            {/* Breakdown summary in INR */}
            <div className="p-3.5 rounded-xl bg-[#faf6f0] border border-[#e7dfd1] space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Milestone Amount:</span>
                <span className="text-stone-900 font-mono font-bold">₹{amount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Platform Commission ({userTier === 'PREMIUM' ? '5%' : '10%'}):</span>
                <span className="text-red-700 font-mono font-medium">-₹{calculatedFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-[#e7dfd1] font-bold">
                <span className="text-stone-900">Net to Freelancer:</span>
                <span className="text-emerald-700 font-mono">₹{netEscrow.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 transition-all shadow-xs disabled:opacity-50"
              >
                {loading ? 'Authorizing Payment...' : `Confirm & Pay ₹${amount.toLocaleString('en-IN')}`}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
