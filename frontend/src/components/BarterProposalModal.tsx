'use client';

import React, { useState } from 'react';
import { X, ArrowLeftRight, AlertCircle } from 'lucide-react';

export interface BarterItem {
  id: number;
  titleNeeded: string;
  categoryNeeded: string;
  descriptionNeeded: string;
  offeredSkill: string;
  offeredDeliverable: string;
  estimatedHours: string;
  creatorName: string;
  creatorOrganization?: string;
  swapCount: number;
  isProposed?: boolean;
}

interface BarterProposalModalProps {
  barter: BarterItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (barterId: number) => void;
}

export default function BarterProposalModal({ barter, isOpen, onClose, onSuccess }: BarterProposalModalProps) {
  const [mySkillOffered, setMySkillOffered] = useState('');
  const [myDeliverable, setMyDeliverable] = useState('');
  const [timeline, setTimeline] = useState('7 days');
  const [pitch, setPitch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !barter) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mySkillOffered.trim() || !myDeliverable.trim()) {
      setError('Please specify both your offered skill and deliverable.');
      return;
    }
    setError(null);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      onSuccess(barter.id);
      onClose();
    }, 600);
  };

  const applyPreset = (skill: string, deliverable: string) => {
    setMySkillOffered(skill);
    setMyDeliverable(deliverable);
    setPitch(`I can take care of your "${barter.titleNeeded}" completely. In return, I would love to receive your offered "${barter.offeredDeliverable}".`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 sm:p-7 shadow-xl border border-[#e6ddce] text-[#221814] max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#f7f2eb] hover:bg-[#ede4d8] text-[#6e5e54] hover:text-[#221814] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#92400e] bg-[#fef3c7] border border-[#fde68a] px-2.5 py-0.5 rounded-full mb-2">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Propose Mutual Barter Swap</span>
          </div>
          <h2 className="text-xl font-bold text-[#221814] leading-tight">
            Exchange Skills with {barter.creatorName}
          </h2>
          <p className="text-xs text-[#6e5e54] mt-1">
            Both parties deliver agreed work for 100% mutual benefit — zero cash required.
          </p>
        </div>

        {/* Mutual Trade Context Box */}
        <div className="p-4 rounded-xl bg-[#faf7f2] border border-[#e6ddce] mb-5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#8c796b]">They Need:</div>
              <div className="font-bold text-[#221814] text-sm mt-0.5">{barter.titleNeeded}</div>
            </div>
            <div className="sm:text-right">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#b45309]">In Exchange They Offer You:</div>
              <div className="font-bold text-[#b45309] text-sm mt-0.5">{barter.offeredDeliverable}</div>
            </div>
          </div>
          <div className="text-[11px] text-[#8c796b] pt-2 border-t border-[#ede4d8] flex items-center justify-between">
            <span>Estimated effort: <strong className="text-[#221814]">{barter.estimatedHours}</strong></span>
            <span>Category: <strong className="text-[#221814]">{barter.categoryNeeded}</strong></span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Preset Skills */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#6e5e54]">
                Quick Fill My Offer
              </label>
              <span className="text-[10px] text-[#8c796b]">Click to auto-populate</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset('Frontend Engineering', 'Complete Next.js Web App with Tailwind & API integrations')}
                className="px-2.5 py-1 rounded-lg text-[11px] bg-[#f7f2eb] hover:bg-[#ede4d8] text-[#221814] border border-[#e6ddce]"
              >
                + React / Next.js Web App
              </button>
              <button
                type="button"
                onClick={() => applyPreset('UI/UX Product Design', 'Figma Prototype, Wireframes & Component Design System')}
                className="px-2.5 py-1 rounded-lg text-[11px] bg-[#f7f2eb] hover:bg-[#ede4d8] text-[#221814] border border-[#e6ddce]"
              >
                + Figma UI/UX System
              </button>
              <button
                type="button"
                onClick={() => applyPreset('Backend Architecture', 'RESTful API in Go / Spring Boot with PostgreSQL schema')}
                className="px-2.5 py-1 rounded-lg text-[11px] bg-[#f7f2eb] hover:bg-[#ede4d8] text-[#221814] border border-[#e6ddce]"
              >
                + Backend API &amp; DB
              </button>
            </div>
          </div>

          {/* Skill & Deliverable Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6e5e54] mb-1">
                Skill You Are Trading
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Full-Stack Web Development"
                value={mySkillOffered}
                onChange={(e) => setMySkillOffered(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#dfd4c4] rounded-xl text-xs text-[#221814] placeholder-[#a69788] focus:outline-none focus:border-[#b45309]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6e5e54] mb-1">
                Estimated Turnaround
              </label>
              <input
                type="text"
                required
                placeholder="e.g., 5 to 7 days"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-[#dfd4c4] rounded-xl text-xs text-[#221814] placeholder-[#a69788] focus:outline-none focus:border-[#b45309]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6e5e54] mb-1">
              Exact Deliverable You Will Provide
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Production Next.js dashboard with responsive components & live data hooks"
              value={myDeliverable}
              onChange={(e) => setMyDeliverable(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-[#dfd4c4] rounded-xl text-xs text-[#221814] placeholder-[#a69788] focus:outline-none focus:border-[#b45309]"
            />
          </div>

          {/* Collaboration Pitch */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6e5e54] mb-1">
              Mutual Agreement Note
            </label>
            <textarea
              rows={3}
              placeholder="Describe how both sides will collaborate, milestones, and shared deliverables..."
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              className="w-full p-3 bg-white border border-[#dfd4c4] rounded-xl text-xs text-[#221814] placeholder-[#a69788] focus:outline-none focus:border-[#b45309] resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#6e5e54] hover:text-[#221814] bg-[#f7f2eb] hover:bg-[#ede4d8] border border-[#e6ddce] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#b45309] hover:bg-[#9a4408] transition-all flex items-center gap-1.5 shadow-sm"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>{loading ? 'Sending Trade Offer...' : 'Propose Mutual Swap →'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
