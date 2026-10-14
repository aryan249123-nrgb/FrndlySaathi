'use client';

import React, { useState } from 'react';
import { Project } from '@/types';
import { api } from '@/lib/api';
import { X, IndianRupee, Calendar, Send, AlertCircle } from 'lucide-react';

interface SubmitProposalModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SubmitProposalModal({ project, isOpen, onClose, onSuccess }: SubmitProposalModalProps) {
  const [bidAmount, setBidAmount] = useState<number>(project ? project.budget : 500);
  const [estimatedDays, setEstimatedDays] = useState<number>(1);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.proposals.submit(project.id, {
        bidAmount,
        estimatedDays,
        coverLetter: coverLetter || `Hi ${project.clientName}, I can help you with this task right away!`,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      console.warn('Backend proposal submit failed, continuing locally:', err);
      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const applyTemplate = (type: 'quick' | 'detailed') => {
    if (type === 'quick') {
      setCoverLetter(`Hi ${project.clientName}, I am available to work on this immediately. Will complete it cleanly within ${estimatedDays} day(s).`);
    } else {
      setCoverLetter(`Hello ${project.clientName}, I have prior experience with ${project.category || 'similar tasks'}. I will ensure this is done accurately and on time.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#221814]/40 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 sm:p-7 shadow-xl border border-[#e6ddce] text-[#221814]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#faf7f2] hover:bg-[#ede4d8] text-[#6e5e54] hover:text-[#221814] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#92400e] bg-[#fef3c7] border border-[#fde68a] px-2.5 py-0.5 rounded-full">
            Submit Task Proposal
          </span>
          <h2 className="text-xl font-bold text-[#221814] mt-2 leading-tight">
            {project.title}
          </h2>
          <div className="flex items-center gap-4 text-xs text-[#6e5e54] mt-1.5">
            <span>Posted by: <strong className="text-[#221814]">{project.clientName || 'Poster'}</strong></span>
            <span>Budget: <strong className="text-[#b45309] font-mono">₹{project.budget}</strong></span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Bid and Days Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6e5e54] mb-1">Your Quote (₹)</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-[#a89a8e]" />
                <input
                  type="number"
                  required
                  min={50}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 bg-[#faf7f2] border border-[#e6ddce] rounded-xl text-xs text-[#221814] focus:outline-none focus:border-[#b45309] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6e5e54] mb-1">Time (Days/Hours)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-[#a89a8e]" />
                <input
                  type="number"
                  required
                  min={1}
                  value={estimatedDays}
                  onChange={(e) => setEstimatedDays(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 bg-[#faf7f2] border border-[#e6ddce] rounded-xl text-xs text-[#221814] focus:outline-none focus:border-[#b45309]"
                />
              </div>
            </div>
          </div>

          {/* Note / Pitch */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#6e5e54]">Note / Proposal Details</label>
              <div className="flex items-center gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => applyTemplate('quick')}
                  className="text-[#b45309] hover:underline font-medium"
                >
                  Prompt Delivery
                </button>
                <span className="text-[#d5c7b5]">•</span>
                <button
                  type="button"
                  onClick={() => applyTemplate('detailed')}
                  className="text-[#b45309] hover:underline font-medium"
                >
                  Experienced
                </button>
              </div>
            </div>
            <textarea
              rows={4}
              placeholder="Explain how you will complete this task or your past experience..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full p-3 bg-[#faf7f2] border border-[#e6ddce] rounded-xl text-xs text-[#221814] placeholder-[#a89a8e] focus:outline-none focus:border-[#b45309]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#6e5e54] hover:text-[#221814] bg-[#faf7f2] hover:bg-[#ede4d8] border border-[#e6ddce] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#b45309] hover:bg-[#92400e] shadow-sm transition-all flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{loading ? 'Submitting...' : 'Send Proposal →'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
