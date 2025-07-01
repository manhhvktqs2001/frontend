import React from 'react';

// Base Skeleton Component
const Skeleton = ({ 
  className = '', 
  variant = 'rectangular',
  animation = 'pulse',
  children 
}) => {
  const baseClasses = 'bg-gray-200 animate-pulse';
  
  const variantClasses = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded h-4',
    card: 'rounded-2xl'
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-wave',
    none: ''
  };

  return (
    <div className={`
      ${baseClasses} 
      ${variantClasses[variant]} 
      ${animationClasses[animation]} 
      ${className}
    `}>
      {children}
    </div>
  );
};

// Dashboard Loading Skeleton
export const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
    {/* Header Skeleton */}
    <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 px-8 py-6 mb-8 rounded-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton variant="circular" className="w-12 h-12" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    </div>

    {/* Stats Cards Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Skeleton variant="circular" className="w-12 h-12" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-2 w-16" />
              </div>
            </div>
          </div>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>

    {/* Charts Section Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mb-8">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-5 w-32" />
            <Skeleton variant="circular" className="w-8 h-8" />
          </div>
          <div className="h-80 flex items-center justify-center">
            <Skeleton variant="circular" className="w-48 h-48" />
          </div>
        </div>
      ))}
    </div>

    {/* Recent Activity Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, j) => (
              <div key={j} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-start space-x-3">
                  <Skeleton variant="circular" className="w-8 h-8" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Table Loading Skeleton
export const TableSkeleton = ({ rows = 5, columns = 6 }) => (
  <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
    {/* Table Header */}
    <div className="bg-gray-50/80 backdrop-blur-sm border-b border-gray-100 px-6 py-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {[...Array(columns)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
    
    {/* Table Body */}
    <div className="divide-y divide-gray-100">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="px-6 py-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {[...Array(columns)].map((_, j) => (
              <div key={j} className="flex items-center space-x-2">
                {j === 0 && <Skeleton variant="circular" className="w-6 h-6" />}
                <Skeleton className="h-4 flex-1" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Card Grid Loading Skeleton
export const CardGridSkeleton = ({ count = 6, columns = 3 }) => (
  <div className={`grid grid-cols-1 lg:grid-cols-${columns} gap-6`}>
    {[...Array(count)].map((_, i) => (
      <div key={i} className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Skeleton variant="circular" className="w-4 h-4" />
            <Skeleton variant="circular" className="w-12 h-12" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
        
        <div className="mb-4">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        <div className="space-y-3 mb-4">
          {[...Array(3)].map((_, j) => (
            <div key={j} className="flex items-center justify-between">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[...Array(3)].map((_, j) => (
            <div key={j} className="text-center p-2 bg-gray-50 rounded-lg">
              <Skeleton variant="circular" className="w-6 h-6 mx-auto mb-1" />
              <Skeleton className="h-3 w-12 mx-auto" />
            </div>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    ))}
  </div>
);

// List Loading Skeleton
export const ListSkeleton = ({ count = 5 }) => (
  <div className="space-y-4">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
        <div className="flex items-start space-x-4">
          <Skeleton variant="circular" className="w-4 h-4 mt-1" />
          <Skeleton variant="circular" className="w-12 h-12" />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <Skeleton className="h-5 w-3/4 mb-2" />
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />
            <div className="flex items-center space-x-3">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-28" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Stats Card Loading Skeleton
export const StatsCardSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton variant="circular" className="w-12 h-12" />
        </div>
      </div>
    ))}
  </div>
);

// Chart Loading Skeleton
export const ChartSkeleton = ({ height = 320 }) => (
  <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
    <div className="flex items-center justify-between mb-6">
      <Skeleton className="h-5 w-32" />
      <Skeleton variant="circular" className="w-8 h-8" />
    </div>
    <div className={`h-${height} flex items-center justify-center`}>
      <div className="w-full h-full flex items-end justify-center space-x-2">
        {[...Array(12)].map((_, i) => (
          <Skeleton 
            key={i} 
            className="w-8" 
            style={{ height: `${Math.random() * 80 + 20}%` }}
          />
        ))}
      </div>
    </div>
  </div>
);

// Page Loading Skeleton with Header
export const PageSkeleton = ({ 
  showHeader = true, 
  showStats = true, 
  showTable = true, 
  showCards = false 
}) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    {showHeader && (
      <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Skeleton variant="circular" className="w-12 h-12" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    )}

    <div className="p-8">
      {showStats && (
        <div className="mb-8">
          <StatsCardSkeleton />
        </div>
      )}

      <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Skeleton className="h-10 w-80" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      {showTable && <TableSkeleton />}
      {showCards && <CardGridSkeleton />}
    </div>
  </div>
);

export default Skeleton;