import React from 'react';

export const IssueStatusBadge = ({ status }) => {
  const s = (status || 'Pending').toLowerCase();

  const styles = {
    reported: 'bg-blue-50 text-blue-700 border-blue-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    'under review': 'bg-purple-50 text-purple-700 border-purple-200',
    assigned: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    scheduled: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    'in progress': 'bg-blue-50 text-blue-700 border-blue-200',
    resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: 'bg-rose-50 text-rose-700 border-rose-200',
    duplicate: 'bg-gray-50 text-gray-700 border-gray-200',
    reopened: 'bg-orange-50 text-orange-700 border-orange-200',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        styles[s] || 'bg-gray-50 text-gray-700 border-gray-200'
      }`}
    >
      {status || 'Pending'}
    </span>
  );
};

export default IssueStatusBadge;
