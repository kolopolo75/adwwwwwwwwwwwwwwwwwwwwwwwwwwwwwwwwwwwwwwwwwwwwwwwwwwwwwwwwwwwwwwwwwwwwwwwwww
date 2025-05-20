import { ReactNode, useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import { useLocation } from "wouter";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [activeTab, setActiveTab] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [location] = useLocation();

  // Update active tab based on location
  useEffect(() => {
    const path = location === "/" ? "dashboard" : location.substring(1);
    setActiveTab(path);
    localStorage.setItem("activeTab", path);
  }, [location]);

  // Load active tab from local storage on initial render
  useEffect(() => {
    const storedTab = localStorage.getItem("activeTab");
    if (storedTab) {
      setActiveTab(storedTab);
    }
  }, []);

  return (
    <div className="bg-gray-50 font-sans text-gray-800">
      {/* Mobile Top Navigation Bar */}
      <nav className="bg-white shadow md:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-primary">Print Shop</h1>
            </div>
            <div className="flex items-center">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)} 
                className="p-2 rounded-md text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              >
                <span className="sr-only">Open menu</span>
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        <MobileNav 
          activeTab={activeTab} 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
        />
      </nav>

      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar for desktop */}
        <Sidebar activeTab={activeTab} />
        
        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none pb-16 md:pb-0">
            {children}
          </main>
        </div>
      </div>
      
      {/* Mobile bottom navigation */}
      <MobileNav 
        activeTab={activeTab} 
        showBottomNav={true} 
      />
    </div>
  );
}
