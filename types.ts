import { ReactNode } from 'react';

export enum UserStatus {
  IDLE = 'IDLE',
  REGISTERED = 'Registered',
  ACTIVE = 'Active',
  NOT_FOUND = 'NOT_FOUND',
  ERROR = 'ERROR',
  LOADING = 'LOADING'
}

export interface RegistrationData {
  name: string;
  email: string;
}

export interface User {
  timestamp: string;
  name: string;
  email: string;
  status: string;
  notes: string;
  expiryDate?: string; // New field for 30-day validity
}

export interface ApiResponse {
  result: 'success' | 'error';
  status?: string;
  message?: string;
  expiryDate?: string; // API returns this on checkStatus
  data?: any;
}

export interface BenefitsCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}