export type Role = 'CLIENT' | 'FREELANCER';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export type ProjectStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Project {
  id: number;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  status: ProjectStatus;
  clientId: number;
  clientName: string;
  clientEmail: string;
  category: string;
  skillsRequired: string;
  createdAt: string;
  proposalCount: number;
}

export type ProposalStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface Proposal {
  id: number;
  projectId: number;
  projectTitle: string;
  freelancerId: number;
  freelancerName: string;
  freelancerEmail: string;
  coverLetter: string;
  bidAmount: number;
  estimatedDays: number;
  status: ProposalStatus;
  createdAt: string;
}

export type ContractStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

export interface Contract {
  id: number;
  projectId: number;
  projectTitle: string;
  clientId: number;
  clientName: string;
  freelancerId: number;
  freelancerName: string;
  agreedAmount: number;
  startDate: string;
  endDate: string;
  status: ContractStatus;
  createdAt: string;
}

export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
export type PaymentMethod = 'CARD' | 'UPI' | 'WALLET';

export interface Payment {
  id: number;
  contractId: number;
  projectTitle: string;
  amount: number;
  feeAmount: number;
  netAmount: number;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId: string;
  createdAt: string;
}

export type NotificationType = 'EMAIL' | 'SMS' | 'IN_APP';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
