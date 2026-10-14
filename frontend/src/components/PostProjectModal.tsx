'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { X, Briefcase, IndianRupee, Calendar, Tag, AlertCircle } from 'lucide-react';

interface PostProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES = [
  'Web Development',
  'Mobile App Development',
  'UI/UX Design & Branding',
  'Database & Backend Engineering',
  'DevOps & Cloud Infrastructure',
  'Full-Stack Systems',
  'QA & Automated Testing',
];

export default function PostProjectModal({ isOpen, onClose, onSuccess }: PostProjectModalProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [budget, setBudget] = useState<number>(45000);
  const [deadline, setDeadline] = useState('2026-11-30');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.projects.create({
        title,
        category,
        budget,
        deadline,
        skillsRequired,
        description,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to post project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-[#e7e0d5] max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-1">
            <Briefcase className="w-4 h-4" />
            <span>Client Workspace</span>
          </div>
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">Post a New Project</h2>
          <p className="text-xs text-stone-500 mt-1">
            Specify your deliverables, budget in INR (₹), and required tech skills to hire qualified freelancers.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Project Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Build Responsive Full-Stack Booking & Invoice Portal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 focus:bg-white transition-colors"
            />
          </div>

          {/* Category & Budget Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-700 focus:bg-white transition-colors"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Budget (₹ INR)</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input
                  type="number"
                  required
                  min={500}
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-700 focus:bg-white transition-colors font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Target Deadline</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:border-amber-700 focus:bg-white transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Skills Required */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Key Tech Skills</label>
            <div className="relative">
              <Tag className="absolute left-3 top-2.5 w-4 h-4 text-stone-400" />
              <input
                type="text"
                placeholder="e.g. Next.js, TypeScript, PostgreSQL, Tailwind CSS, REST API"
                value={skillsRequired}
                onChange={(e) => setSkillsRequired(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Project Scope &amp; Details</label>
            <textarea
              required
              rows={6}
              placeholder="Explain project deliverables, architecture requirements, milestones, and testing expectations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-700 focus:bg-white transition-colors"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#e7e0d5]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-800 hover:bg-amber-900 transition-all shadow-xs disabled:opacity-50"
            >
              {loading ? 'Publishing...' : 'Publish Project Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
