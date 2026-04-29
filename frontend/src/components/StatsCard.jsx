import React from 'react';

const StatsCard = ({ title, value, icon, color }) => {
  const IconComponent = icon;
  return (
    <div className="glass-card p-6 flex items-center gap-4 animate-slide-up">
      <div className={`p-4 rounded-xl bg-opacity-10`} style={{ backgroundColor: `${color}20` }}>
        <IconComponent className="w-8 h-8" style={{ color: color }} />
      </div>
      <div>
        <p className="text-text-muted text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-1">{value}</h3>
      </div>
    </div>
  );
};

export default StatsCard;
