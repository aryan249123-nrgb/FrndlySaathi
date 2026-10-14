'use client';

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';
import BarterProposalModal, { BarterItem } from '@/components/BarterProposalModal';
import SubmitProposalModal from '@/components/SubmitProposalModal';
import ProposalsModal from '@/components/ProposalsModal';
import { Project } from '@/types';
import { api } from '@/lib/api';
import { 
  Search, 
  Plus, 
  CheckSquare, 
  Briefcase, 
  Calendar, 
  IndianRupee, 
  Check, 
  Clock, 
  LogOut, 
  X, 
  ArrowRight, 
  ArrowLeftRight, 
  ChevronLeft, 
  ChevronRight, 
  PanelLeftClose, 
  PanelRightClose, 
  PanelLeftOpen, 
  PanelRightOpen 
} from 'lucide-react';

interface TaskItem {
  id: number;
  title: string;
  description: string;
  budget: number;
  deadline?: string;
  category: string;
  clientName: string;
  clientOrganization?: string;
  proposalCount: number;
  isApplied?: boolean;
}

const CATEGORIES = [
  'All',
  'Development',
  'UI/UX Design',
  'Backend & APIs',
  'Mobile Apps',
  'DevOps & Cloud',
  'Technical Writing',
  'Video & Motion',
  'Data Analytics',
  'Other',
];

// 100% unique ticker items — zero duplicates
const TICKER_ITEMS = [
  'Direct Milestone Escrow in INR (₹)',
  '100% Peer Skill Barter for Mutual Benefit',
  'Frontend Development ⇄ UI/UX Design System',
  'Backend REST APIs ⇄ React Native Mobile Apps',
  'AWS Cloud DevOps ⇄ Technical Writing & Architecture',
  'Python Data Pipelines ⇄ 3D Product Motion Graphics',
  'Verified Milestone Releases & Zero Fee Trades',
];

// Distinct, non-overlapping initial tasks
const INITIAL_TASKS: TaskItem[] = [
  {
    id: 1,
    category: 'Development',
    title: 'Next.js 15 & TypeScript Financial Analytics Dashboard',
    description: 'Build real-time analytics charts, KPI cards, and filter drawers using Next.js 15, Tailwind, and Recharts.',
    budget: 35000,
    deadline: '2026-11-10',
    clientName: 'Priya Sharma',
    clientOrganization: 'FinEdge Labs',
    proposalCount: 3,
    isApplied: false,
  },
  {
    id: 2,
    category: 'Backend & APIs',
    title: 'Spring Boot REST & Webhook Gateway for Automated Payments',
    description: 'Implement hardened microservice endpoints, idempotency keys, JWT auth, and automated transaction reconciliation.',
    budget: 45000,
    deadline: '2026-11-20',
    clientName: 'Vikram Malhotra',
    clientOrganization: 'Apex Fintech',
    proposalCount: 2,
    isApplied: false,
  },
  {
    id: 3,
    category: 'UI/UX Design',
    title: 'Comprehensive Design System & High-Fidelity Figma Prototype',
    description: 'Complete component library with dark/light theme tokens and user flows for a B2B SaaS productivity suite.',
    budget: 28000,
    deadline: '2026-11-05',
    clientName: 'Rahul Verma',
    clientOrganization: 'Nexus Systems',
    proposalCount: 4,
    isApplied: false,
  },
  {
    id: 4,
    category: 'Mobile Apps',
    title: 'Cross-Platform React Native App with Offline Sync & Push Notifications',
    description: 'Deliver production iOS & Android mobile application with offline local MMKV storage and Firebase push notifications.',
    budget: 52000,
    deadline: '2026-11-28',
    clientName: 'Sneha Reddy',
    clientOrganization: 'Verve Mobile',
    proposalCount: 1,
    isApplied: false,
  },
  {
    id: 5,
    category: 'DevOps & Cloud',
    title: 'Multi-Region AWS Infrastructure Setup with Terraform & Docker',
    description: 'Configure automated ECS/EKS container deployments, VPC peering, IAM roles, and GitHub Actions CI/CD pipelines.',
    budget: 30000,
    deadline: '2026-11-15',
    clientName: 'Aarav Patel',
    clientOrganization: 'CloudScale Inc.',
    proposalCount: 2,
    isApplied: false,
  },
];

// Distinct, non-overlapping initial barters (unique people & different deliverables)
const INITIAL_BARTERS: BarterItem[] = [
  {
    id: 101,
    titleNeeded: 'Full-Stack Next.js 15 Web Application with SSR',
    categoryNeeded: 'Development',
    descriptionNeeded: 'Looking for an experienced engineer to architect SSR routes, server actions, and responsive layout components.',
    offeredSkill: 'UI/UX Design & Branding',
    offeredDeliverable: 'Complete 20-Screen Figma Design System, Interactive Prototype & Vector Brand Assets',
    estimatedHours: 'Equal Trade (~18-22 mutual hours)',
    creatorName: 'Neha Kapoor',
    creatorOrganization: 'DesignCraft Studio',
    swapCount: 3,
    isProposed: false,
  },
  {
    id: 102,
    titleNeeded: 'Docker & Kubernetes CI/CD Pipeline Automation',
    categoryNeeded: 'DevOps & Cloud',
    descriptionNeeded: 'Help us set up automated multi-stage Docker builds, Kubernetes deployment manifests, and rollback strategies.',
    offeredSkill: 'Technical Writing & Architecture',
    offeredDeliverable: 'Comprehensive API Reference Manuals, Postman Collections & Architecture Whitepaper',
    estimatedHours: 'Equal Trade (~15-18 mutual hours)',
    creatorName: 'Kunal Mehra',
    creatorOrganization: 'InfraLogic Works',
    swapCount: 2,
    isProposed: false,
  },
  {
    id: 103,
    titleNeeded: 'Cross-Platform Flutter Mobile Prototype',
    categoryNeeded: 'Mobile Apps',
    descriptionNeeded: 'Build an initial mobile prototype with state management and camera integration for real-time document capture.',
    offeredSkill: 'Brand Identity & Marketing Strategy',
    offeredDeliverable: 'Complete Brand Positioning Deck, Landing Copy, and High-Converting Motion Ads',
    estimatedHours: 'Equal Trade (~12-16 mutual hours)',
    creatorName: 'Tanvi Saxena',
    creatorOrganization: 'BrandVision Collective',
    swapCount: 4,
    isProposed: false,
  },
  {
    id: 104,
    titleNeeded: 'Python Data Extraction Pipeline & Automated Scraper',
    categoryNeeded: 'Data Analytics',
    descriptionNeeded: 'Build an automated pipeline to extract, sanitize, and load structured market datasets into PostgreSQL.',
    offeredSkill: 'Motion Design & 3D Video',
    offeredDeliverable: '45-Second 3D Product Demo Video with Motion Graphics & Custom Audio Sync',
    estimatedHours: 'Equal Trade (~14-18 mutual hours)',
    creatorName: 'Sameer Deshmukh',
    creatorOrganization: 'CineCraft Digital',
    swapCount: 1,
    isProposed: false,
  },
];

function AppContent() {
  const { user, logout } = useAuth();

  // Active marketplace focus: 'tasks' (Left) or 'barter' (Right)
  const [activeMarketplace, setActiveMarketplace] = useState<'tasks' | 'barter'>('tasks');

  // Sidebars mutual exclusivity: opening right closes left, and vice versa!
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  // Active Center View: marketplace | post_task | my_tasks | post_barter | my_barters | profile
  const [centerView, setCenterView] = useState<'marketplace' | 'post_task' | 'my_tasks' | 'post_barter' | 'my_barters' | 'profile'>('marketplace');

  // Public Landing Tab: 'tasks' | 'barter'
  const [publicTab, setPublicTab] = useState<'tasks' | 'barter'>('tasks');

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [activeBarterForProposal, setActiveBarterForProposal] = useState<BarterItem | null>(null);
  const [proposalProject, setProposalProject] = useState<Project | null>(null);
  const [reviewProposalsProject, setReviewProposalsProject] = useState<Project | null>(null);

  // Data states
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [barters, setBarters] = useState<BarterItem[]>(INITIAL_BARTERS);

  // Search & Filter states
  const [taskSearch, setTaskSearch] = useState('');
  const [taskCategory, setTaskCategory] = useState('All');
  const [barterSearch, setBarterSearch] = useState('');
  const [barterCategory, setBarterCategory] = useState('All');

  // Task Form State
  const [taskFormTitle, setTaskFormTitle] = useState('');
  const [taskFormCategory, setTaskFormCategory] = useState('');
  const [taskFormDesc, setTaskFormDesc] = useState('');
  const [taskFormBudget, setTaskFormBudget] = useState('25000');
  const [taskFormDeadline, setTaskFormDeadline] = useState('');
  const [taskFormSuccess, setTaskFormSuccess] = useState(false);

  // Barter Form State
  const [barterFormNeed, setBarterFormNeed] = useState('');
  const [barterFormCategory, setBarterFormCategory] = useState('');
  const [barterFormDesc, setBarterFormDesc] = useState('');
  const [barterFormOfferSkill, setBarterFormOfferSkill] = useState('');
  const [barterFormOfferDeliverable, setBarterFormOfferDeliverable] = useState('');
  const [barterFormHours, setBarterFormHours] = useState('Equal Trade (~15 mutual hours)');
  const [barterFormSuccess, setBarterFormSuccess] = useState(false);

  // Applied & Trade trackers
  const [appliedTasksList, setAppliedTasksList] = useState<Array<{ id: number; title: string; budget: number; status: string }>>([]);
  const [proposedTradesList, setProposedTradesList] = useState<Array<{ id: number; title: string; offered: string; status: string }>>([]);

  // Load from backend if available
  useEffect(() => {
    const fetchBackendProjects = async () => {
      try {
        const backendProjects = await api.projects.getAll();
        if (backendProjects && backendProjects.length > 0) {
          const mapped: TaskItem[] = backendProjects.map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            budget: p.budget,
            deadline: p.deadline,
            category: p.category || 'Development',
            clientName: p.clientName || 'Project Client',
            clientOrganization: 'Verified Organization',
            proposalCount: p.proposalCount || 0,
            isApplied: false,
          }));
          setTasks((prev) => {
            const existingIds = new Set(prev.map(t => t.id));
            const newOnes = mapped.filter(m => !existingIds.has(m.id));
            return [...newOnes, ...prev];
          });
        }
      } catch (e) {
        // Fallback to initial
      }
    };
    fetchBackendProjects();
  }, []);

  // Handlers for Mutual Sidebar Exclusivity and Marketplace focus
  // Whichever sidebar is open, only that marketplace is displayed!
  const openLeftSidebar = () => {
    setLeftSidebarOpen(true);
    setRightSidebarOpen(false);
    setActiveMarketplace('tasks');
    if (centerView !== 'post_task' && centerView !== 'my_tasks' && centerView !== 'profile') {
      setCenterView('marketplace');
    }
  };

  const openRightSidebar = () => {
    setRightSidebarOpen(true);
    setLeftSidebarOpen(false);
    setActiveMarketplace('barter');
    if (centerView !== 'post_barter' && centerView !== 'my_barters' && centerView !== 'profile') {
      setCenterView('marketplace');
    }
  };

  const toggleLeftSidebar = () => {
    if (!leftSidebarOpen) {
      openLeftSidebar();
    } else {
      setLeftSidebarOpen(false);
    }
  };

  const toggleRightSidebar = () => {
    if (!rightSidebarOpen) {
      openRightSidebar();
    } else {
      setRightSidebarOpen(false);
    }
  };

  // Filtered lists
  const filteredTasks = tasks.filter((t) => {
    const matchesCat = taskCategory === 'All' || t.category.toLowerCase().includes(taskCategory.toLowerCase());
    const query = taskSearch.toLowerCase().trim();
    const matchesQuery = !query || t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query);
    return matchesCat && matchesQuery;
  });

  const filteredBarters = barters.filter((b) => {
    const matchesCat = barterCategory === 'All' || b.categoryNeeded.toLowerCase().includes(barterCategory.toLowerCase()) || b.offeredSkill.toLowerCase().includes(barterCategory.toLowerCase());
    const query = barterSearch.toLowerCase().trim();
    const matchesQuery = !query || b.titleNeeded.toLowerCase().includes(query) || b.offeredDeliverable.toLowerCase().includes(query) || b.creatorName.toLowerCase().includes(query);
    return matchesCat && matchesQuery;
  });

  // Submit Task (Left)
  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }

    const newTask: TaskItem = {
      id: Date.now(),
      title: taskFormTitle.trim(),
      description: taskFormDesc.trim() || 'Deliverables and scope as agreed.',
      budget: Number(taskFormBudget) || 15000,
      deadline: taskFormDeadline || undefined,
      category: taskFormCategory || 'Development',
      clientName: user.name,
      clientOrganization: 'Verified Client',
      proposalCount: 0,
      isApplied: false,
    };

    try {
      await api.projects.create({
        title: newTask.title,
        description: newTask.description,
        budget: newTask.budget,
        deadline: newTask.deadline,
        category: newTask.category,
      });
    } catch (e) {
      // local fallback
    }

    setTasks((prev) => [newTask, ...prev]);
    setTaskFormSuccess(true);
    setTaskFormTitle('');
    setTaskFormDesc('');
    setTaskFormBudget('25000');
    setTaskFormDeadline('');

    setTimeout(() => {
      setTaskFormSuccess(false);
      setActiveMarketplace('tasks');
      setCenterView('marketplace');
      openLeftSidebar();
    }, 1000);
  };

  // Submit Barter (Right)
  const handleBarterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }

    const newBarter: BarterItem = {
      id: Date.now(),
      titleNeeded: barterFormNeed.trim(),
      categoryNeeded: barterFormCategory || 'Development',
      descriptionNeeded: barterFormDesc.trim() || 'Mutual agreement deliverables.',
      offeredSkill: barterFormOfferSkill.trim() || 'Technical Domain Skill',
      offeredDeliverable: barterFormOfferDeliverable.trim(),
      estimatedHours: barterFormHours.trim() || 'Equal Trade (~15 mutual hours)',
      creatorName: user.name,
      creatorOrganization: 'Community Specialist',
      swapCount: 0,
      isProposed: false,
    };

    setBarters((prev) => [newBarter, ...prev]);
    setBarterFormSuccess(true);
    setBarterFormNeed('');
    setBarterFormDesc('');
    setBarterFormOfferSkill('');
    setBarterFormOfferDeliverable('');
    setBarterFormHours('Equal Trade (~15 mutual hours)');

    setTimeout(() => {
      setBarterFormSuccess(false);
      setActiveMarketplace('barter');
      setCenterView('marketplace');
      openRightSidebar();
    }, 1000);
  };

  // Apply to Task
  const handleApplyTask = (task: TaskItem) => {
    if (!user) {
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }

    const proj: Project = {
      id: task.id,
      title: task.title,
      description: task.description,
      budget: task.budget,
      deadline: task.deadline || 'Flexible',
      status: 'OPEN',
      clientId: 1,
      clientName: task.clientName,
      clientEmail: `${task.clientName.toLowerCase().replace(/\s+/g, '')}@organization.com`,
      category: task.category,
      skillsRequired: task.category,
      createdAt: new Date().toISOString(),
      proposalCount: task.proposalCount,
    };

    setProposalProject(proj);
  };

  // Propose Barter
  const handleProposeBarter = (barter: BarterItem) => {
    if (!user) {
      setAuthMode('login');
      setAuthModalOpen(true);
      return;
    }
    setActiveBarterForProposal(barter);
  };

  const handleApplySuccess = (taskId: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, isApplied: true, proposalCount: t.proposalCount + 1 } : t))
    );
    const target = tasks.find(t => t.id === taskId);
    if (target) {
      setAppliedTasksList((prev) => [
        { id: target.id, title: target.title, budget: target.budget, status: 'Applied ✓' },
        ...prev
      ]);
    }
  };

  const handleBarterSuccess = (barterId: number) => {
    setBarters((prev) =>
      prev.map((b) => (b.id === barterId ? { ...b, isProposed: true, swapCount: b.swapCount + 1 } : b))
    );
    const target = barters.find(b => b.id === barterId);
    if (target) {
      setProposedTradesList((prev) => [
        { id: target.id, title: target.titleNeeded, offered: target.offeredDeliverable, status: 'Trade Proposed ✓' },
        ...prev
      ]);
    }
  };

  const getUserInitials = () => {
    if (!user || !user.name) return 'FS';
    const parts = user.name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  // =========================================================================
  // VIEW 1: PUBLIC ENTRY POINT (WHEN LOGGED OUT)
  // Light warm solid colors, NO gradients, NO "not updated" items, NO duplicates
  // =========================================================================
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#faf7f2] text-[#221814] selection:bg-amber-100 selection:text-amber-900">
        
        {/* Top Header */}
        <header className="h-20 border-b border-[#e6ddce] bg-white px-6 sm:px-12 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <span className="text-xl font-bold tracking-tight text-[#221814]">
              Frndly Saathi
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#fef3c7] border border-[#fde68a] text-[#92400e] px-2.5 py-0.5 rounded-full">
              Platform
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => { setAuthMode('register'); setAuthModalOpen(true); }}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-[#221814] bg-[#faf7f2] border border-[#dfd4c4] hover:bg-[#ede4d8] transition-all"
            >
              Sign Up
            </button>
            <button
              onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }}
              className="px-5 py-2 text-xs font-bold rounded-xl text-white bg-[#b45309] hover:bg-[#9a4408] transition-all shadow-xs"
            >
              Log In
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-6 sm:px-12 pt-14 sm:pt-18 pb-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-[#221814] leading-[1.06]">
              Your Tasks.<br />
              Your Barter.
            </h1>

            <p className="text-base sm:text-lg text-[#6e5e54] font-medium max-w-2xl mx-auto pt-2">
              Deliver paid professional projects or exchange high-impact skills for 100% mutual benefit — clean sidebars, zero friction.
            </p>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => { setAuthMode('register'); setAuthModalOpen(true); }}
                className="px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-[#b45309] hover:bg-[#9a4408] transition-all flex items-center gap-2 shadow-sm"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Running Ticker (Clean, Zero Duplicates) */}
          <div className="mt-14 border-y border-[#e6ddce] py-3.5 overflow-x-auto whitespace-nowrap scrollbar-none">
            <div className="flex items-center gap-6 text-xs text-[#8c796b] font-medium tracking-wide">
              {TICKER_ITEMS.map((item, idx) => (
                <React.Fragment key={idx}>
                  <span className="hover:text-[#221814] transition-colors">{item}</span>
                  <span className="text-[#ded3c2]">·</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Public Tab Switcher: View either Tasks OR Barter */}
          <div className="mt-12 space-y-6">
            <div className="flex items-center justify-center">
              <div className="inline-flex p-1.5 rounded-2xl bg-[#f7f2eb] border border-[#e6ddce] shadow-xs">
                <button
                  onClick={() => setPublicTab('tasks')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    publicTab === 'tasks'
                      ? 'bg-white text-[#221814] shadow-xs border border-[#e6ddce]'
                      : 'text-[#6e5e54] hover:text-[#221814]'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 text-[#b45309]" />
                  <span>Paid Tasks (₹)</span>
                </button>
                <button
                  onClick={() => setPublicTab('barter')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    publicTab === 'barter'
                      ? 'bg-white text-[#221814] shadow-xs border border-[#e6ddce]'
                      : 'text-[#6e5e54] hover:text-[#221814]'
                  }`}
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-[#065f46]" />
                  <span>Peer Skill Barter (⇄)</span>
                </button>
              </div>
            </div>

            {/* Public Tab Content */}
            {publicTab === 'tasks' ? (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-[#e6ddce]">
                  <div className="flex items-center gap-2 text-[#b45309] font-bold text-sm">
                    <Briefcase className="w-4 h-4" />
                    <span>Active Tasks (Paid Direct in INR)</span>
                  </div>
                  <span className="text-xs text-[#8c796b]">Milestone Escrow Protected</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tasks.map((t) => (
                    <div key={t.id} className="p-5 rounded-2xl bg-white border border-[#e6ddce] shadow-xs space-y-3 flex flex-col justify-between hover:border-[#d6cab8] transition-all">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#92400e] uppercase bg-[#fef3c7] px-2.5 py-0.5 rounded-full">{t.category}</span>
                          <span className="text-sm font-bold text-[#b45309] font-mono">₹{t.budget.toLocaleString('en-IN')}</span>
                        </div>
                        <h4 className="text-sm font-bold text-[#221814] leading-snug">{t.title}</h4>
                        <p className="text-xs text-[#6e5e54] line-clamp-3 leading-relaxed">{t.description}</p>
                      </div>

                      <div className="pt-3 border-t border-[#ede4d8] flex items-center justify-between text-xs">
                        <span className="text-[#8c796b]">Posted by {t.clientName}</span>
                        <button
                          onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }}
                          className="px-3 py-1.5 rounded-xl font-bold text-xs text-white bg-[#b45309] hover:bg-[#9a4408] transition-all"
                        >
                          Apply →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-[#e6ddce]">
                  <div className="flex items-center gap-2 text-[#065f46] font-bold text-sm">
                    <ArrowLeftRight className="w-4 h-4" />
                    <span>Active Barter Swaps (100% Mutual Skill Trades)</span>
                  </div>
                  <span className="text-xs text-[#8c796b]">Zero Monetary Transaction</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {barters.map((b) => (
                    <div key={b.id} className="p-5 rounded-2xl bg-white border border-[#e6ddce] shadow-xs space-y-3 flex flex-col justify-between hover:border-[#d6cab8] transition-all">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#065f46] uppercase bg-[#ecfdf5] border border-[#a7f3d0] px-2.5 py-0.5 rounded-full">⇄ SKILL BARTER</span>
                          <span className="text-xs text-[#6e5e54] font-mono font-medium">{b.estimatedHours}</span>
                        </div>
                        
                        <div className="p-3.5 rounded-xl bg-[#faf7f2] border border-[#e6ddce] space-y-2">
                          <div>
                            <div className="text-[10px] uppercase font-bold text-[#8c796b]">They Need:</div>
                            <div className="text-xs font-bold text-[#221814]">{b.titleNeeded}</div>
                          </div>
                          <div className="pt-2 border-t border-[#ede4d8]">
                            <div className="text-[10px] uppercase font-bold text-[#065f46]">In Exchange They Deliver:</div>
                            <div className="text-xs font-bold text-[#b45309]">{b.offeredDeliverable}</div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-[#ede4d8] flex items-center justify-between text-xs">
                        <span className="text-[#8c796b]">by {b.creatorName}</span>
                        <button
                          onClick={() => { setAuthMode('login'); setAuthModalOpen(true); }}
                          className="px-3 py-1.5 rounded-xl font-bold text-xs text-white bg-[#065f46] hover:bg-[#044e3a] transition-all"
                        >
                          Propose Swap ⇄
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>

        <AuthModal
          isOpen={authModalOpen}
          initialMode={authMode}
          onClose={() => setAuthModalOpen(false)}
        />
      </div>
    );
  }

  // =========================================================================
  // VIEW 2: AUTHENTICATED WORKSPACE
  // Whichever sidebar is open, ONLY that marketplace is shown!
  // Left Sidebar: Tasks | Right Sidebar: Barter
  // =========================================================================
  return (
    <div className="min-h-screen flex flex-col bg-[#faf7f2] text-[#221814]">
      
      {/* Top Header */}
      <header className="h-16 border-b border-[#e6ddce] bg-white flex items-center justify-between px-4 sm:px-6 z-20 shrink-0 sticky top-0 shadow-xs">
        
        {/* Left Toggle + Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLeftSidebar}
            title={leftSidebarOpen ? 'Close Left Task Sidebar' : 'Open Left Task Sidebar (Shows Tasks)'}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              leftSidebarOpen
                ? 'bg-[#eedfcc] text-[#221814] border border-[#d8c3a9]'
                : 'bg-[#faf7f2] text-[#6e5e54] border border-[#e6ddce] hover:text-[#221814]'
            }`}
          >
            {leftSidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4 text-[#b45309]" />}
            <span className="hidden sm:inline font-bold">Tasks Sidebar</span>
          </button>

          <span 
            onClick={() => { setActiveMarketplace('tasks'); setCenterView('marketplace'); openLeftSidebar(); }}
            className="text-lg font-bold tracking-tight text-[#221814] cursor-pointer hover:text-[#b45309] transition-colors hidden md:inline"
          >
            Frndly Saathi
          </span>
        </div>

        {/* Center: Marketplace Switcher (Tasks vs Barter) */}
        <div className="flex items-center gap-1.5 bg-[#f7f2eb] p-1 rounded-xl border border-[#e6ddce]">
          <button
            onClick={() => { setActiveMarketplace('tasks'); setCenterView('marketplace'); openLeftSidebar(); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeMarketplace === 'tasks' && centerView === 'marketplace'
                ? 'bg-white text-[#221814] shadow-xs border border-[#e6ddce]'
                : 'text-[#6e5e54] hover:text-[#221814]'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-[#b45309]" />
            <span>Tasks (₹ Paid)</span>
          </button>
          <button
            onClick={() => { setActiveMarketplace('barter'); setCenterView('marketplace'); openRightSidebar(); }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeMarketplace === 'barter' && centerView === 'marketplace'
                ? 'bg-white text-[#065f46] shadow-xs border border-[#a7d7b3]'
                : 'text-[#6e5e54] hover:text-[#221814]'
            }`}
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#065f46]" />
            <span>Barter Swaps (⇄)</span>
          </button>
        </div>

        {/* Right Toggle + User Profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleRightSidebar}
            title={rightSidebarOpen ? 'Close Right Barter Sidebar' : 'Open Right Barter Sidebar (Shows Barter)'}
            className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
              rightSidebarOpen
                ? 'bg-[#e2f1e6] text-[#065f46] border border-[#a7d7b3]'
                : 'bg-[#faf7f2] text-[#6e5e54] border border-[#e6ddce] hover:text-[#221814]'
            }`}
          >
            <span className="hidden sm:inline font-bold">Barter Sidebar</span>
            {rightSidebarOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4 text-[#065f46]" />}
          </button>

          <button
            onClick={() => setCenterView('profile')}
            title={`Signed in as ${user.name}`}
            className="w-9 h-9 rounded-full bg-[#eedfcc] hover:bg-[#e4d2bc] text-[#221814] font-bold text-xs flex items-center justify-center transition-all shadow-xs"
          >
            {getUserInitials()}
          </button>
        </div>
      </header>

      {/* Workspace Body with Mutually Exclusive Sidebars */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left Sidebar: Task Hub (When open, switches view to Tasks) */}
        {leftSidebarOpen && (
          <aside className="w-64 border-r border-[#e6ddce] bg-[#f7f2eb] flex flex-col justify-between p-4 z-30 shrink-0 animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between px-3">
                <span className="text-[11px] font-bold tracking-[0.2em] text-[#b45309] uppercase flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>TASK MENU</span>
                </span>
                <button 
                  onClick={() => setLeftSidebarOpen(false)}
                  className="p-1 text-[#8c796b] hover:text-[#221814]"
                  title="Close sidebar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={() => { setActiveMarketplace('tasks'); setCenterView('marketplace'); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    centerView === 'marketplace' && activeMarketplace === 'tasks'
                      ? 'bg-white text-[#221814] shadow-xs border border-[#e6ddce]'
                      : 'text-[#6e5e54] hover:text-[#221814] hover:bg-[#ede5d8]'
                  }`}
                >
                  <Search className="w-4 h-4 shrink-0 text-[#b45309]" />
                  <span>Browse Tasks (₹)</span>
                </button>

                <button
                  onClick={() => setCenterView('post_task')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    centerView === 'post_task'
                      ? 'bg-white text-[#221814] shadow-xs border border-[#e6ddce]'
                      : 'text-[#6e5e54] hover:text-[#221814] hover:bg-[#ede5d8]'
                  }`}
                >
                  <Plus className="w-4 h-4 shrink-0 text-[#b45309]" />
                  <span>Post a Task</span>
                </button>

                <button
                  onClick={() => setCenterView('my_tasks')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    centerView === 'my_tasks'
                      ? 'bg-white text-[#221814] shadow-xs border border-[#e6ddce]'
                      : 'text-[#6e5e54] hover:text-[#221814] hover:bg-[#ede5d8]'
                  }`}
                >
                  <CheckSquare className="w-4 h-4 shrink-0 text-[#b45309]" />
                  <span>My Posted Tasks</span>
                </button>

                <button
                  onClick={() => openRightSidebar()} // Switches to Barter, closes left!
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#065f46] bg-[#ecfdf5] hover:bg-[#d1fae5] border border-[#a7f3d0] transition-all mt-4"
                >
                  <span className="flex items-center gap-2">
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>Switch to Barter (⇄)</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </nav>
            </div>

            <div className="pt-4 border-t border-[#e6ddce] px-3">
              <div className="text-xs font-bold text-[#221814] truncate">{user.name}</div>
              <div className="text-[11px] text-[#6e5e54] truncate">{user.email}</div>
              <div className="text-[10px] text-[#b45309] font-semibold mt-1">
                Applied Tasks: {appliedTasksList.length}
              </div>
            </div>
          </aside>
        )}

        {/* Center Content: ONLY shows the active marketplace (Whoever's sidebar is open, show that!) */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#faf7f2]">
          
          {/* Main Marketplace View */}
          {centerView === 'marketplace' && (
            <div className="space-y-6 animate-in fade-in max-w-7xl mx-auto">
              
              {/* Conditional Display: Tasks vs Barter */}
              {activeMarketplace === 'tasks' ? (
                /* ==================== TASKS MARKETPLACE ==================== */
                <div className="space-y-6">
                  {/* Tasks Top Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-[#e6ddce] shadow-xs">
                    <div>
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#fef3c7] text-[#92400e] text-[11px] font-bold uppercase mb-2">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Task Gigs Marketplace</span>
                      </div>
                      <h1 className="text-2xl font-extrabold text-[#221814] tracking-tight">
                        Available Tasks (₹ Paid).
                      </h1>
                      <p className="text-xs text-[#6e5e54] mt-0.5">
                        Direct milestone deliverables backed by escrow security
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => setCenterView('post_task')}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#b45309] hover:bg-[#9a4408] text-white shadow-xs flex items-center gap-1.5 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Post a Task</span>
                      </button>
                    </div>
                  </div>

                  {/* Tasks Search & Filters */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#8c796b]" />
                      <input
                        type="text"
                        placeholder="Search tasks by title, skills, or requirements..."
                        value={taskSearch}
                        onChange={(e) => setTaskSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#dfd4c4] rounded-xl text-xs text-[#221814] placeholder-[#a69788] focus:outline-none focus:border-[#b45309]"
                      />
                    </div>
                  </div>

                  {/* Category Filter Chips */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setTaskCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                          taskCategory === cat
                            ? 'bg-[#b45309] text-white shadow-xs'
                            : 'bg-white text-[#6e5e54] hover:text-[#221814] border border-[#e6ddce]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Tasks Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredTasks.length === 0 ? (
                      <div className="col-span-full py-16 text-center rounded-2xl bg-white border border-[#e6ddce] text-xs text-[#8c796b]">
                        No tasks match your search or filter criteria.
                      </div>
                    ) : (
                      filteredTasks.map((task) => (
                        <div
                          key={task.id}
                          className="p-5 rounded-2xl bg-white border border-[#e6ddce] shadow-xs space-y-4 hover:border-[#d6cab8] transition-all flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#92400e] bg-[#fef3c7] border border-[#fde68a] px-2.5 py-0.5 rounded-full">
                                {task.category}
                              </span>
                              <span className="text-base font-bold text-[#b45309] font-mono">
                                ₹{task.budget.toLocaleString('en-IN')}
                              </span>
                            </div>

                            <div>
                              <h3 className="text-sm font-bold text-[#221814] leading-snug">
                                {task.title}
                              </h3>
                              <p className="text-xs text-[#6e5e54] line-clamp-3 mt-1.5 leading-relaxed">
                                {task.description}
                              </p>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-[#ede4d8] space-y-3">
                            <div className="flex items-center justify-between text-xs text-[#8c796b]">
                              <span>Client: <strong className="text-[#221814]">{task.clientName}</strong></span>
                              <span>{task.proposalCount} quotes</span>
                            </div>

                            <div className="flex items-center justify-end">
                              {task.isApplied ? (
                                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]">
                                  Proposal Sent <Check className="w-3.5 h-3.5" />
                                </span>
                              ) : (
                                <button
                                  onClick={() => handleApplyTask(task)}
                                  className="w-full py-2 rounded-xl text-xs font-bold text-white bg-[#b45309] hover:bg-[#9a4408] transition-all shadow-xs"
                                >
                                  Submit Proposal →
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                /* ==================== BARTER EXCHANGE ==================== */
                <div className="space-y-6">
                  {/* Barter Top Banner */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-white border border-[#e6ddce] shadow-xs">
                    <div>
                      <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#ecfdf5] text-[#065f46] text-[11px] font-bold uppercase mb-2">
                        <ArrowLeftRight className="w-3.5 h-3.5" />
                        <span>Skill Barter Exchange</span>
                      </div>
                      <h1 className="text-2xl font-extrabold text-[#221814] tracking-tight">
                        Peer Skill Swaps (⇄).
                      </h1>
                      <p className="text-xs text-[#6e5e54] mt-0.5">
                        Exchange high-value services for 100% mutual benefit — zero monetary transaction
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => setCenterView('post_barter')}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#065f46] hover:bg-[#044e3a] text-white shadow-xs flex items-center gap-1.5 transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Post a Barter</span>
                      </button>
                    </div>
                  </div>

                  {/* Barter Search & Filters */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#8c796b]" />
                      <input
                        type="text"
                        placeholder="Search barter by skill needed, deliverable offered, or member..."
                        value={barterSearch}
                        onChange={(e) => setBarterSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#dfd4c4] rounded-xl text-xs text-[#221814] placeholder-[#a69788] focus:outline-none focus:border-[#065f46]"
                      />
                    </div>
                  </div>

                  {/* Category Filter Chips */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setBarterCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                          barterCategory === cat
                            ? 'bg-[#065f46] text-white shadow-xs'
                            : 'bg-white text-[#6e5e54] hover:text-[#221814] border border-[#e6ddce]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Barter Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
                    {filteredBarters.length === 0 ? (
                      <div className="col-span-full py-16 text-center rounded-2xl bg-white border border-[#e6ddce] text-xs text-[#8c796b]">
                        No barter swaps match your search or filter criteria.
                      </div>
                    ) : (
                      filteredBarters.map((item) => (
                        <div
                          key={item.id}
                          className="p-5 rounded-2xl bg-white border border-[#e6ddce] shadow-xs space-y-4 hover:border-[#d6cab8] transition-all flex flex-col justify-between"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#065f46] bg-[#ecfdf5] border border-[#a7f3d0] px-2.5 py-0.5 rounded-full">
                                ⇄ SKILL BARTER
                              </span>
                              <span className="text-xs text-[#6e5e54] font-mono font-medium">
                                {item.estimatedHours}
                              </span>
                            </div>

                            <div className="p-4 rounded-xl bg-[#faf7f2] border border-[#e6ddce] space-y-2.5">
                              <div>
                                <div className="text-[10px] uppercase font-bold text-[#8c796b]">They Need:</div>
                                <div className="text-xs font-bold text-[#221814]">{item.titleNeeded}</div>
                              </div>
                              <div className="pt-2 border-t border-[#ede4d8]">
                                <div className="text-[10px] uppercase font-bold text-[#065f46]">In Exchange They Deliver:</div>
                                <div className="text-xs font-bold text-[#b45309]">{item.offeredDeliverable}</div>
                              </div>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-[#ede4d8] flex items-center justify-between">
                            <span className="text-xs text-[#8c796b]">
                              by <strong className="text-[#221814]">{item.creatorName}</strong> ({item.creatorOrganization})
                            </span>

                            {item.isProposed ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#f0fdf4] text-[#166534] border border-[#bbf7d0]">
                                Trade Proposed <Check className="w-3.5 h-3.5" />
                              </span>
                            ) : (
                              <button
                                onClick={() => handleProposeBarter(item)}
                                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#065f46] hover:bg-[#044e3a] transition-all shadow-xs flex items-center gap-1.5"
                              >
                                <ArrowLeftRight className="w-3.5 h-3.5" />
                                <span>Propose Swap ⇄</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Dedicated View: Post a Task */}
          {centerView === 'post_task' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-[#221814]">Post a Task.</h1>
                  <p className="text-xs text-[#6e5e54] mt-0.5">Describe deliverables and set a direct monetary budget (₹)</p>
                </div>
                <button
                  onClick={() => { setActiveMarketplace('tasks'); setCenterView('marketplace'); }}
                  className="text-xs text-[#b45309] hover:underline"
                >
                  ← Back to Tasks
                </button>
              </div>

              {taskFormSuccess && (
                <div className="p-3.5 rounded-xl bg-[#f0fdf4] border border-[#bbf7d0] text-[#166534] text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#166534]" />
                  <span>Task posted successfully! Redirecting...</span>
                </div>
              )}

              <div className="p-6 rounded-2xl bg-white border border-[#e6ddce] shadow-xs">
                <form onSubmit={handleTaskSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6e5e54] mb-1.5">TASK TITLE</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Build Next.js 15 Dashboard"
                      value={taskFormTitle}
                      onChange={(e) => setTaskFormTitle(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-[#dfd4c4] rounded-xl text-xs text-[#221814] focus:outline-none focus:border-[#b45309]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6e5e54] mb-1.5">CATEGORY</label>
                    <select
                      required
                      value={taskFormCategory}
                      onChange={(e) => setTaskFormCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-[#dfd4c4] rounded-xl text-xs text-[#221814] focus:outline-none focus:border-[#b45309]"
                    >
                      <option value="" disabled>Select category</option>
                      {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6e5e54] mb-1.5">DESCRIPTION</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Requirements, scope, and deliverables..."
                      value={taskFormDesc}
                      onChange={(e) => setTaskFormDesc(e.target.value)}
                      className="w-full p-3 bg-white border border-[#dfd4c4] rounded-xl text-xs text-[#221814] focus:outline-none focus:border-[#b45309] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6e5e54] mb-1.5">BUDGET (₹)</label>
                      <input
                        type="number"
                        required
                        min={500}
                        value={taskFormBudget}
                        onChange={(e) => setTaskFormBudget(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#dfd4c4] rounded-xl text-xs text-[#221814] font-mono focus:outline-none focus:border-[#b45309]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6e5e54] mb-1.5">DEADLINE</label>
                      <input
                        type="date"
                        value={taskFormDeadline}
                        onChange={(e) => setTaskFormDeadline(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#dfd4c4] rounded-xl text-xs text-[#221814] focus:outline-none focus:border-[#b45309]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-bold text-xs text-white bg-[#b45309] hover:bg-[#9a4408] transition-all mt-2 shadow-xs"
                  >
                    Post Task →
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Dedicated View: Post a Barter */}
          {centerView === 'post_barter' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-[#221814]">Post a Barter Exchange.</h1>
                  <p className="text-xs text-[#6e5e54] mt-0.5">Specify what you need and what skill you will deliver in return</p>
                </div>
                <button
                  onClick={() => { setActiveMarketplace('barter'); setCenterView('marketplace'); }}
                  className="text-xs text-[#065f46] hover:underline"
                >
                  ← Back to Barter
                </button>
              </div>

              {barterFormSuccess && (
                <div className="p-3.5 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-[#065f46] text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#065f46]" />
                  <span>Barter trade posted successfully! Redirecting...</span>
                </div>
              )}

              <div className="p-6 rounded-2xl bg-white border border-[#e6ddce] shadow-xs">
                <form onSubmit={handleBarterSubmit} className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#faf7f2] border border-[#e6ddce] space-y-3">
                    <div className="text-[11px] font-bold text-[#b45309] uppercase">1. What You Need</div>
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Project title you need (e.g. Next.js Analytics Frontend)"
                        value={barterFormNeed}
                        onChange={(e) => setBarterFormNeed(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#dfd4c4] rounded-xl text-xs text-[#221814] focus:outline-none focus:border-[#b45309]"
                      />
                    </div>
                    <div>
                      <select
                        required
                        value={barterFormCategory}
                        onChange={(e) => setBarterFormCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#dfd4c4] rounded-xl text-xs text-[#221814] focus:outline-none focus:border-[#b45309]"
                      >
                        <option value="" disabled>Select category needed</option>
                        {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <textarea
                        rows={3}
                        required
                        placeholder="Detailed requirements you need delivered..."
                        value={barterFormDesc}
                        onChange={(e) => setBarterFormDesc(e.target.value)}
                        className="w-full p-2.5 bg-white border border-[#dfd4c4] rounded-xl text-xs text-[#221814] focus:outline-none focus:border-[#b45309] resize-none"
                      />
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#faf7f2] border border-[#e6ddce] space-y-3">
                    <div className="text-[11px] font-bold text-[#065f46] uppercase">2. What You Offer In Return</div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Your skill (e.g. UI/UX Design)"
                        value={barterFormOfferSkill}
                        onChange={(e) => setBarterFormOfferSkill(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#dfd4c4] rounded-xl text-xs text-[#221814] focus:outline-none focus:border-[#065f46]"
                      />
                      <input
                        type="text"
                        required
                        placeholder="Estimated effort (e.g. ~15 hrs)"
                        value={barterFormHours}
                        onChange={(e) => setBarterFormHours(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#dfd4c4] rounded-xl text-xs text-[#221814] focus:outline-none focus:border-[#065f46]"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Exact deliverable you will provide (e.g. 15 Figma UI Screens & Prototype)"
                        value={barterFormOfferDeliverable}
                        onChange={(e) => setBarterFormOfferDeliverable(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-[#dfd4c4] rounded-xl text-xs text-[#221814] focus:outline-none focus:border-[#065f46]"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl font-bold text-xs text-white bg-[#065f46] hover:bg-[#044e3a] transition-all shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>Post Barter Trade →</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Dedicated View: My Posted Tasks */}
          {centerView === 'my_tasks' && (
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-[#221814]">My Posted Tasks.</h1>
                  <p className="text-xs text-[#6e5e54] mt-0.5">Manage tasks you posted and evaluate candidate quotes</p>
                </div>
                <button onClick={() => { setActiveMarketplace('tasks'); setCenterView('marketplace'); }} className="text-xs text-[#b45309] hover:underline">
                  ← Back to Tasks
                </button>
              </div>

              <div className="space-y-3">
                {tasks.filter(t => t.clientName === user.name).length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-white border border-[#e6ddce] text-xs text-[#8c796b]">
                    You haven&apos;t posted any tasks yet. Click &quot;Post a Task&quot; from the Task Menu to get started.
                  </div>
                ) : (
                  tasks.filter(t => t.clientName === user.name).map((task) => (
                    <div key={task.id} className="p-5 rounded-2xl bg-white border border-[#e6ddce] space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase text-[#92400e] bg-[#fef3c7] px-2 py-0.5 rounded-full">{task.category}</span>
                        <span className="text-sm font-bold text-[#b45309] font-mono">₹{task.budget.toLocaleString('en-IN')}</span>
                      </div>
                      <h3 className="text-sm font-bold text-[#221814]">{task.title}</h3>
                      <p className="text-xs text-[#6e5e54]">{task.description}</p>
                      <div className="pt-2 border-t border-[#ede4d8] flex items-center justify-between text-xs">
                        <span className="text-[#8c796b]">Proposals: {task.proposalCount}</span>
                        <button
                          onClick={() => {
                            const p: Project = {
                              id: task.id,
                              title: task.title,
                              description: task.description,
                              budget: task.budget,
                              deadline: task.deadline || '',
                              status: 'OPEN',
                              clientId: 1,
                              clientName: task.clientName,
                              clientEmail: user.email,
                              category: task.category,
                              skillsRequired: task.category,
                              createdAt: new Date().toISOString(),
                              proposalCount: task.proposalCount
                            };
                            setReviewProposalsProject(p);
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-[#b45309] hover:bg-[#9a4408]"
                        >
                          Review Quotes ({task.proposalCount})
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Dedicated View: My Barter Trades */}
          {centerView === 'my_barters' && (
            <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-extrabold text-[#221814]">My Barter Trades.</h1>
                  <p className="text-xs text-[#6e5e54] mt-0.5">Track your mutual skill trade proposals and exchanges</p>
                </div>
                <button onClick={() => { setActiveMarketplace('barter'); setCenterView('marketplace'); }} className="text-xs text-[#065f46] hover:underline">
                  ← Back to Barter
                </button>
              </div>

              <div className="space-y-3">
                {proposedTradesList.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-white border border-[#e6ddce] text-xs text-[#8c796b]">
                    No barter trade proposals sent yet. Explore the Barter listings to propose a swap!
                  </div>
                ) : (
                  proposedTradesList.map((trade, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white border border-[#e6ddce] flex items-center justify-between shadow-xs">
                      <div>
                        <div className="text-[10px] font-bold text-[#065f46] uppercase">{trade.status}</div>
                        <h4 className="text-sm font-bold text-[#221814]">{trade.title}</h4>
                        <p className="text-xs text-[#b45309]">You deliver: {trade.offered}</p>
                      </div>
                      <span className="text-xs text-[#8c796b]">Mutual Trade</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Dedicated View: Profile */}
          {centerView === 'profile' && (
            <div className="max-w-md mx-auto space-y-6 animate-in fade-in">
              <div>
                <h1 className="text-2xl font-extrabold text-[#221814]">Member Profile.</h1>
                <p className="text-xs text-[#6e5e54] mt-0.5">Manage credentials and platform settings</p>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-[#e6ddce] space-y-4 shadow-xs">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#eedfcc] text-[#221814] font-bold text-lg flex items-center justify-center">
                    {getUserInitials()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#221814]">{user.name}</h3>
                    <p className="text-xs text-[#6e5e54]">{user.email}</p>
                    <div className="text-[11px] text-[#b45309] font-semibold mt-1">
                      Verified Member (Tasks + Barter)
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#ede4d8] flex items-center justify-between">
                  <button
                    onClick={() => { setActiveMarketplace('tasks'); setCenterView('marketplace'); }}
                    className="text-xs text-[#b45309] hover:underline"
                  >
                    Go to Tasks
                  </button>
                  <button
                    onClick={logout}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors flex items-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* Right Sidebar: Barter Hub (When open, switches view to Barter) */}
        {rightSidebarOpen && (
          <aside className="w-64 border-l border-[#e6ddce] bg-[#f7f2eb] flex flex-col justify-between p-4 z-30 shrink-0 animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between px-3">
                <span className="text-[11px] font-bold tracking-[0.2em] text-[#065f46] uppercase flex items-center gap-1.5">
                  <ArrowLeftRight className="w-3.5 h-3.5" />
                  <span>BARTER MENU</span>
                </span>
                <button 
                  onClick={() => setRightSidebarOpen(false)}
                  className="p-1 text-[#8c796b] hover:text-[#221814]"
                  title="Close sidebar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={() => { setActiveMarketplace('barter'); setCenterView('marketplace'); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    centerView === 'marketplace' && activeMarketplace === 'barter'
                      ? 'bg-white text-[#221814] shadow-xs border border-[#e6ddce]'
                      : 'text-[#6e5e54] hover:text-[#221814] hover:bg-[#ede5d8]'
                  }`}
                >
                  <ArrowLeftRight className="w-4 h-4 shrink-0 text-[#065f46]" />
                  <span>Barter Swaps (⇄)</span>
                </button>

                <button
                  onClick={() => setCenterView('post_barter')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    centerView === 'post_barter'
                      ? 'bg-white text-[#221814] shadow-xs border border-[#e6ddce]'
                      : 'text-[#6e5e54] hover:text-[#221814] hover:bg-[#ede5d8]'
                  }`}
                >
                  <Plus className="w-4 h-4 shrink-0 text-[#065f46]" />
                  <span>Post a Barter</span>
                </button>

                <button
                  onClick={() => setCenterView('my_barters')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    centerView === 'my_barters'
                      ? 'bg-white text-[#221814] shadow-xs border border-[#e6ddce]'
                      : 'text-[#6e5e54] hover:text-[#221814] hover:bg-[#ede5d8]'
                  }`}
                >
                  <CheckSquare className="w-4 h-4 shrink-0 text-[#065f46]" />
                  <span>My Barter Trades</span>
                </button>

                <button
                  onClick={() => openLeftSidebar()} // Switches to Task, closes right!
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#92400e] bg-[#fef3c7] hover:bg-[#fde68a] border border-[#fde68a] transition-all mt-4"
                >
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Switch to Tasks (₹)</span>
                  </span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </nav>
            </div>

            <div className="pt-4 border-t border-[#e6ddce] px-3">
              <div className="text-xs font-bold text-[#221814] truncate">{user.name}</div>
              <div className="text-[11px] text-[#6e5e54] truncate">{user.email}</div>
              <div className="text-[10px] text-[#065f46] font-semibold mt-1">
                Active Trades: {proposedTradesList.length}
              </div>
            </div>
          </aside>
        )}

      </div>

      {/* Proposal Submission Modal (Tasks) */}
      <SubmitProposalModal
        isOpen={!!proposalProject}
        project={proposalProject}
        onClose={() => setProposalProject(null)}
        onSuccess={() => {
          if (proposalProject) handleApplySuccess(proposalProject.id);
        }}
      />

      {/* Review Proposals Modal (Client) */}
      <ProposalsModal
        isOpen={!!reviewProposalsProject}
        project={reviewProposalsProject}
        onClose={() => setReviewProposalsProject(null)}
        onHiredSuccess={() => {
          if (reviewProposalsProject) {
            setTasks(prev => prev.map(t => t.id === reviewProposalsProject.id ? { ...t, proposalCount: t.proposalCount + 1 } : t));
          }
        }}
      />

      {/* Barter Swap Proposal Modal */}
      <BarterProposalModal
        isOpen={!!activeBarterForProposal}
        barter={activeBarterForProposal}
        onClose={() => setActiveBarterForProposal(null)}
        onSuccess={handleBarterSuccess}
      />
    </div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
