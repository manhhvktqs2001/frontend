// components/ui/Table.jsx
// Modern Table component with glassmorphism design

import React from 'react';
import { clsx } from 'clsx';
import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const Table = React.forwardRef(({
  children,
  className = '',
  variant = 'default',
  ...props
}, ref) => {
  const variants = {
    default: 'bg-white/10 backdrop-blur-xl border border-white/20',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
    dark: 'bg-slate-900/80 backdrop-blur-xl border border-slate-700/50',
  };

  return (
    <div
      ref={ref}
      className={clsx(
        'relative overflow-hidden rounded-2xl',
        variants[variant],
        className
      )}
      {...props}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          {children}
        </table>
      </div>
    </div>
  );
});

const TableHeader = React.forwardRef(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <thead
      ref={ref}
      className={clsx('bg-white/5 border-b border-white/10', className)}
      {...props}
    >
      {children}
    </thead>
  );
});

const TableBody = React.forwardRef(({
  children,
  className = '',
  ...props
}, ref) => {
  return (
    <tbody
      ref={ref}
      className={clsx('divide-y divide-white/10', className)}
      {...props}
    >
      {children}
    </tbody>
  );
});

const TableRow = React.forwardRef(({
  children,
  className = '',
  hover = true,
  onClick,
  ...props
}, ref) => {
  return (
    <tr
      ref={ref}
      className={clsx(
        'transition-all duration-200',
        hover && 'hover:bg-white/5',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </tr>
  );
});

const TableHead = React.forwardRef(({
  children,
  className = '',
  sortable = false,
  sortDirection = null,
  onSort,
  ...props
}, ref) => {
  const handleSort = () => {
    if (sortable && onSort) {
      onSort();
    }
  };

  return (
    <th
      ref={ref}
      className={clsx(
        'px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider',
        sortable && 'cursor-pointer hover:text-white transition-colors',
        className
      )}
      onClick={handleSort}
      {...props}
    >
      <div className="flex items-center gap-2">
        <span>{children}</span>
        {sortable && (
          <div className="flex flex-col">
            <ChevronUpIcon 
              className={clsx(
                'w-3 h-3',
                sortDirection === 'asc' ? 'text-blue-400' : 'text-gray-500'
              )} 
            />
            <ChevronDownIcon 
              className={clsx(
                'w-3 h-3 -mt-1',
                sortDirection === 'desc' ? 'text-blue-400' : 'text-gray-500'
              )} 
            />
          </div>
        )}
      </div>
    </th>
  );
});

const TableCell = React.forwardRef(({
  children,
  className = '',
  align = 'left',
  ...props
}, ref) => {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <td
      ref={ref}
      className={clsx(
        'px-6 py-4 whitespace-nowrap text-sm text-white',
        alignClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
});

const TableEmpty = React.forwardRef(({
  children = 'No data available',
  className = '',
  ...props
}, ref) => {
  return (
    <tr ref={ref} {...props}>
      <td
        colSpan="100%"
        className={clsx(
          'px-6 py-12 text-center text-gray-400',
          className
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-gray-500/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <span>{children}</span>
        </div>
      </td>
    </tr>
  );
});

const TableLoading = React.forwardRef(({
  children = 'Loading...',
  className = '',
  ...props
}, ref) => {
  return (
    <tr ref={ref} {...props}>
      <td
        colSpan="100%"
        className={clsx(
          'px-6 py-12 text-center text-gray-400',
          className
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span>{children}</span>
        </div>
      </td>
    </tr>
  );
});

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Head = TableHead;
Table.Cell = TableCell;
Table.Empty = TableEmpty;
Table.Loading = TableLoading;

Table.displayName = 'Table';

export default Table; 