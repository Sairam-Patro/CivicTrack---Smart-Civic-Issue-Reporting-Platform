import React from 'react';

export const PriorityBadge = ({ priority }) => {
  const p = (priority || 'Medium').toLowerCase();

  const styles = {
    critical: 'bg-red-50 text-red-700 border-red-200 ring-red-500/20',
    high: 'bg-orange-50 text-orange-700 border-orange-200 ring-orange-500/20',
    medium: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
  };

  const dots = {
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-amber-500',
    low: 'bg-emerald-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
        styles[p] || styles.medium
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[p] || dots.medium}`}></span>
      {priority || 'Medium'} Priority
    </span>
  );
};

export default PriorityBadge;
