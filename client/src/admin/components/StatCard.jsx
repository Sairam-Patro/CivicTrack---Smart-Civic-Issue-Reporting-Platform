import React from 'react';
import { useNavigate } from 'react-router-dom';

export const StatCard = ({
  title,
  value,
  trend,
  icon: Icon,
  iconBg = 'bg-blue-50',
  iconColor = 'text-blue-600',
  linkTo,
}) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => linkTo && navigate(linkTo)}
      className={`bg-white rounded-2xl p-3.5 xl:p-4 border border-slate-100/90 shadow-xs flex items-center gap-3 transition-all duration-200 ${
        linkTo ? 'cursor-pointer hover:shadow-md hover:border-slate-200 hover:-translate-y-0.5' : ''
      }`}
    >
      <div className={`w-10 h-10 xl:w-11 xl:h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg} ${iconColor}`}>
        {Icon && <Icon className="w-5 h-5 xl:w-5.5 xl:h-5.5" />}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg xl:text-xl font-black text-[#102544] tracking-tight leading-none truncate">
          {value}
        </h3>
        <p className="text-[11px] xl:text-xs font-semibold text-slate-500 mt-1 truncate">
          {title}
        </p>
        {trend && (
          <div className="text-[10px] xl:text-[11px] font-bold text-emerald-600 flex items-center gap-0.5 mt-0.5">
            <span>{trend.startsWith('↑') || trend.startsWith('+') ? trend : `↑ ${trend}`}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
