import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    // Default to dark mode but check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isTransitioning, setIsTransitioning] = useState(false);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      // Only follow system preference if user hasn't manually set a theme
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    
    // Add smooth transition classes
    if (isTransitioning) {
      root.classList.add('theme-transitioning');
    } else {
      root.classList.remove('theme-transitioning');
    }

    if (isDarkMode) {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#0f172a';
      document.body.style.color = '#f1f5f9';
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#1e293b';
    }

    // Save preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode, isTransitioning]);

  const toggleTheme = () => {
    setIsTransitioning(true);
    
    // Use CSS View Transitions API if available (Chrome 111+)
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setIsDarkMode(!isDarkMode);
      }).finished.finally(() => {
        setTimeout(() => setIsTransitioning(false), 300);
      });
    } else {
      // Fallback smooth animation
      setTimeout(() => {
        setIsDarkMode(!isDarkMode);
        setTimeout(() => setIsTransitioning(false), 300);
      }, 150);
    }
  };

  const value = {
    isDarkMode,
    toggleTheme,
    isTransitioning,
    setDarkMode: setIsDarkMode,
    setLightMode: () => setIsDarkMode(false)
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
      
      {/* Global CSS for smooth transitions */}
      <style>{`
        :root {
          --transition-duration: 0.3s;
          --transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Smooth transitions for all elements during theme change */
        .theme-transitioning,
        .theme-transitioning * {
          transition: background-color var(--transition-duration) var(--transition-timing),
                      border-color var(--transition-duration) var(--transition-timing),
                      color var(--transition-duration) var(--transition-timing),
                      box-shadow var(--transition-duration) var(--transition-timing) !important;
        }
        
        /* View Transitions API support for modern browsers */
        @supports (view-transition-name: none) {
          ::view-transition-old(root),
          ::view-transition-new(root) {
            animation-duration: 0.4s;
            animation-timing-function: var(--transition-timing);
          }
          
          ::view-transition-old(root) {
            animation-name: theme-fade-out;
          }
          
          ::view-transition-new(root) {
            animation-name: theme-fade-in;
          }
        }
        
        @keyframes theme-fade-out {
          from { 
            opacity: 1; 
            transform: scale(1);
          }
          to { 
            opacity: 0; 
            transform: scale(0.98);
          }
        }
        
        @keyframes theme-fade-in {
          from { 
            opacity: 0; 
            transform: scale(1.02);
          }
          to { 
            opacity: 1; 
            transform: scale(1);
          }
        }
        
        /* Enhanced scrollbar styling */
        .dark ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .dark ::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 3px;
        }
        
        .dark ::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 3px;
        }
        
        .dark ::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
        
        /* Light mode scrollbar */
        :not(.dark) ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        :not(.dark) ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }
        
        :not(.dark) ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        
        :not(.dark) ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        
        /* Dark mode color scheme */
        .dark {
          color-scheme: dark;
        }
        
        /* Ensure smooth transitions for common elements */
        .transition-theme {
          transition: all var(--transition-duration) var(--transition-timing);
        }
      `}</style>
    </ThemeContext.Provider>
  );
};