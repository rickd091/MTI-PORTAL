// src/components/ui/StatisticCard.js
import { FileText } from 'lucide-react';
import React from 'react';

const icons = {
  document: FileText,
  // Add other icons as needed
};

export const StatisticCard = ({ title, value, icon, subtitle }) => {
  const Icon = icons[icon] || FileText;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <h3 className="text-2xl font-bold mt-2 text-gray-900">{value}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );
};