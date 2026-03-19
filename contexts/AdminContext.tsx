'use client';

import React, { useEffect, useState, createContext, useContext } from 'react';
import { AdminUser } from '@/types/store';

interface AdminContextType {
  adminUser: AdminUser | null;
  login: (email: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  members: AdminUser[];
  addMember: (member: Omit<AdminUser, 'id'>) => void;
  removeMember: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const initialMembers: AdminUser[] = [
  { id: 'admin-1', name: 'Super Admin', email: 'admin@nexusfit.com', role: 'superadmin' },
];

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [members, setMembers] = useState<AdminUser[]>(initialMembers);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('nexusfit_admin');
    if (storedAdmin) {
      try {
        setAdminUser(JSON.parse(storedAdmin));
      } catch (e) {
        console.error('Failed to parse admin user', e);
      }
    }
    const storedMembers = localStorage.getItem('nexusfit_admin_members');
    if (storedMembers) {
      try {
        setMembers(JSON.parse(storedMembers));
      } catch (e) {
        console.error('Failed to parse admin members', e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('nexusfit_admin_members', JSON.stringify(members));
  }, [members]);

  const login = (email: string) => {
    const member = members.find((m) => m.email === email);
    if (member) {
      setAdminUser(member);
      localStorage.setItem('nexusfit_admin', JSON.stringify(member));
    } else {
      const mockAdmin: AdminUser = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email,
        role: 'admin',
      };
      setAdminUser(mockAdmin);
      localStorage.setItem('nexusfit_admin', JSON.stringify(mockAdmin));
    }
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('nexusfit_admin');
  };

  const addMember = (member: Omit<AdminUser, 'id'>) => {
    const newMember = { ...member, id: `admin-${Date.now()}` };
    setMembers((prev) => [...prev, newMember]);
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <AdminContext.Provider
      value={{ adminUser, login, logout, isAuthenticated: !!adminUser, members, addMember, removeMember }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
