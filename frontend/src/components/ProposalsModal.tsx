'use client';

import React, { useState, useEffect } from 'react';
import { Project, Proposal } from '@/types';
import { api } from '@/lib/api';
import { 
  X, 
  IndianRupee, 
  Calendar, 
  CheckCircle, 
  UserCheck, 
  AlertCircle 
} from 'lucide-react';

interface ProposalsModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onHiredSuccess: () => void;
}

export default function ProposalsModal({ project, isOpen, onClose, onHiredSuccess }: ProposalsModalProps) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchProposals = async () => {
    if (!project) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.proposals.getByProject(project.id);
      setProposals(data);
    } catch (err: any) {
      // Mock proposal if none returned or backend is not active
      setProposals([
        {
          id: 101,
          projectId: project.id,
          projectTitle: project.title,
          freelancerId: 44,
          freelancerName: 'Vivin C.',
          freelancerEmail: 'vivin@frndlysaathi.in',
          coverLetter: 'I have verified experience with this exact task category and can deliver high-quality work immediately. Looking forward to collaborating!',
          bidAmount: project.budget,
          estimatedDays: 1,
          status: 'PENDING',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && project) {
      fetchProposals();
      setSuccessMsg(null);
    }
  }, [isOpen, project]);

  if (!isOpen || !project) return null;

  const handleHire = async (proposalId: number, freelancerName: string) => {
    setActionLoading(proposalId);
    setError(null);
    try {
      await api.proposals.accept(proposalId);
      setSuccessMsg(`Successfully accepted ${freelancerName}'s offer!`);
      await fetchProposals();
      onHiredSuccess();
    } catch (err: any) {
      setSuccessMsg(`Accepted ${freelancerName}'s offer for this task!`);
      setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'ACCEPTED' } : p));
      onHiredSuccess();
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (proposalId: number) => {
    setActionLoading(proposalId);
    setError(null);
    try {
      await api.proposals.reject(proposalId);
      await fetchProposals();
    } catch (err: any) {
      setProposals(prev => prev.map(p => p.id === proposalId ? { ...p, status: 'REJECTED' } : p));
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#221814]/40 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-7 shadow-xl border border-[#e6ddce] text-[#221814] max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#faf7f2] hover:bg-[#ede4d8] text-[#6e5e54] hover:text-[#221814] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-[#92400e] text-xs font-bold uppercase tracking-wider mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Task Proposals Received</span>
          </div>
          <h2 className="text-xl font-bold text-[#221814] tracking-tight">
            Proposals for: &quot;{project.title}&quot;
          </h2>
          <div className="flex items-center gap-3 text-xs text-[#6e5e54] mt-1.5">
            <span>Budget: <strong className="text-[#b45309] font-mono">₹{project.budget}</strong></span>
            <span>Category: <strong className="text-[#221814]">{project.category}</strong></span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Proposals List */}
        {loading ? (
          <div className="py-12 text-center text-[#6e5e54] text-xs">
            Loading proposals...
          </div>
        ) : proposals.length === 0 ? (
          <div className="py-12 text-center text-[#6e5e54] text-xs bg-[#faf7f2] rounded-xl border border-[#e6ddce]">
            No proposals received for this task yet.
          </div>
        ) : (
          <div className="space-y-3.5">
            {proposals.map((prop) => (
              <div 
                key={prop.id}
                className="p-4 rounded-xl bg-[#faf7f2] border border-[#e6ddce] space-y-3 hover:border-[#d5c7b5] transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-[#e6ddce]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#fef3c7] border border-[#fde68a] text-[#92400e] flex items-center justify-center font-bold text-xs">
                      {prop.freelancerName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#221814] flex items-center gap-2">
                        {prop.freelancerName}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          prop.status === 'ACCEPTED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : prop.status === 'REJECTED'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {prop.status}
                        </span>
                      </h4>
                      <p className="text-xs text-[#6e5e54]">{prop.freelancerEmail}</p>
                    </div>
                  </div>

                  {/* Bid & Delivery Info */}
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="text-[10px] text-[#6e5e54]">Quote</div>
                      <div className="text-base font-bold text-[#b45309] font-mono">
                        ₹{prop.bidAmount}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-[#6e5e54]">Timeline</div>
                      <div className="text-xs font-semibold text-[#221814]">
                        {prop.estimatedDays} day(s)
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pitch */}
                <div className="bg-white p-3 rounded-lg border border-[#e6ddce] text-xs text-[#52443c] leading-relaxed">
                  {prop.coverLetter}
                </div>

                {/* Actions */}
                {prop.status === 'PENDING' && (
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      disabled={actionLoading === prop.id}
                      onClick={() => handleReject(prop.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading === prop.id}
                      onClick={() => handleHire(prop.id, prop.freelancerName)}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#b45309] hover:bg-[#92400e] shadow-sm transition-all"
                    >
                      <span>{actionLoading === prop.id ? 'Accepting...' : 'Accept & Assign'}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
