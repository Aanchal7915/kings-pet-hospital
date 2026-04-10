import React from 'react';

export const SkeletonCard = ({ className = '' }) => (
  <div className={`rounded-2xl border border-gray-100 bg-white p-4 animate-pulse ${className}`}>
    <div className="h-40 bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl mb-4"></div>
    <div className="h-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-2/3 mb-3"></div>
    <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-5/6 mb-4"></div>
    <div className="h-10 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg"></div>
  </div>
);

export const SkeletonGrid = ({ count = 3, className = '' }) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
    {[...Array(count)].map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonCard;
