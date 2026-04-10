import React from 'react';
import { FaBox, FaCalendarAlt, FaSearch } from 'react-icons/fa';

const EmptyStateIcons = {
  products: FaBox,
  slots: FaCalendarAlt,
  search: FaSearch,
};

export const EmptyState = ({ 
  type = 'products', 
  title = 'No items found',
  message = 'Try adjusting your filters or search criteria.',
  action = null
}) => {
  const Icon = EmptyStateIcons[type] || FaBox;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-blue-200 mb-4">
        <Icon size={64} />
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">{title}</h3>
      <p className="text-gray-600 text-center max-w-md mb-6">{message}</p>
      {action && (
        <button className="px-6 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors">
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
