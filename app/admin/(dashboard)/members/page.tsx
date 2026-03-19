'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Shield } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AdminMembersPage() {
  const { members, addMember, removeMember, adminUser } = useAdmin();
  const [isAdding, setIsAdding] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', email: '', role: 'admin' as 'admin' | 'superadmin' });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addMember(newMember);
    setIsAdding(false);
    setNewMember({ name: '', email: '', role: 'admin' });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white mb-2">TEAM MEMBERS</h1>
          <p className="text-text-secondary">Manage admin access to the portal.</p>
        </div>
        {adminUser?.role === 'superadmin' && (
          <Button onClick={() => setIsAdding(!isAdding)}><Plus className="w-4 h-4 mr-2" /> ADD MEMBER</Button>
        )}
      </div>

      {isAdding && (
        <div className="bg-background-secondary border border-border p-6 mb-6">
          <h3 className="font-heading font-bold text-white mb-4 border-b border-border pb-2">ADD NEW ADMIN</h3>
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <Input label="Name" value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} required />
            </div>
            <div className="flex-1 w-full">
              <Input label="Email" type="email" value={newMember.email} onChange={(e) => setNewMember({ ...newMember, email: e.target.value })} required />
            </div>
            <div className="w-full sm:w-48 flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-secondary">Role</label>
              <select
                className="w-full bg-background border border-border px-4 py-3 text-text-primary focus:outline-none focus:border-neon"
                value={newMember.role}
                onChange={(e) => setNewMember({ ...newMember, role: e.target.value as 'admin' | 'superadmin' })}
              >
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
            <Button type="submit" className="w-full sm:w-auto">SAVE</Button>
          </form>
        </div>
      )}

      <div className="bg-background-secondary border border-border p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-text-secondary border-b border-border bg-background/50">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-background/50 transition-colors">
                <td className="p-4 font-medium text-white flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neon/10 text-neon flex items-center justify-center font-bold">
                    {member.name.charAt(0)}
                  </div>
                  {member.name}
                  {member.id === adminUser?.id && (
                    <span className="text-xs bg-border px-2 py-0.5 rounded text-text-secondary ml-2">You</span>
                  )}
                </td>
                <td className="p-4 text-text-secondary">{member.email}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border ${member.role === 'superadmin' ? 'border-neon text-neon bg-neon/10' : 'border-border text-text-secondary bg-background'}`}>
                    {member.role === 'superadmin' && <Shield className="w-3 h-3" />}
                    <span className="capitalize">{member.role}</span>
                  </span>
                </td>
                <td className="p-4 text-right">
                  {adminUser?.role === 'superadmin' && member.id !== adminUser.id && (
                    <button
                      onClick={() => { if (window.confirm('Remove this member?')) removeMember(member.id); }}
                      className="p-2 text-text-secondary hover:text-status-warning transition-colors cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
