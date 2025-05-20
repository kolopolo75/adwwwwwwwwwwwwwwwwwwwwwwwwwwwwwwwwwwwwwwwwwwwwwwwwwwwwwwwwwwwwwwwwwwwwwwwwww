import { Link } from "wouter";

interface MobileNavProps {
  activeTab: string;
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  showBottomNav?: boolean;
}

export default function MobileNav({ 
  activeTab, 
  sidebarOpen = false,
  setSidebarOpen,
  showBottomNav = false 
}: MobileNavProps) {
  
  if (showBottomNav) {
    return (
      <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-10">
        <div className="flex justify-between">
          <Link href="/">
            <a className={`flex-1 py-3 text-xs text-center focus:outline-none ${activeTab === 'dashboard' ? 'text-primary' : 'text-gray-500 hover:text-gray-900'}`}>
              <svg className="h-6 w-6 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Dashboard</span>
            </a>
          </Link>
          <Link href="/products">
            <a className={`flex-1 py-3 text-xs text-center focus:outline-none ${activeTab === 'products' ? 'text-primary' : 'text-gray-500 hover:text-gray-900'}`}>
              <svg className="h-6 w-6 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <span>Products</span>
            </a>
          </Link>
          <Link href="/clients">
            <a className={`flex-1 py-3 text-xs text-center focus:outline-none ${activeTab === 'clients' ? 'text-primary' : 'text-gray-500 hover:text-gray-900'}`}>
              <svg className="h-6 w-6 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>Clients</span>
            </a>
          </Link>
          <Link href="/orders">
            <a className={`flex-1 py-3 text-xs text-center focus:outline-none ${activeTab === 'orders' ? 'text-primary' : 'text-gray-500 hover:text-gray-900'}`}>
              <svg className="h-6 w-6 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <span>Orders</span>
            </a>
          </Link>
        </div>
      </div>
    );
  }
  
  // Top mobile menu
  if (setSidebarOpen) {
    return (
      <div 
        className={`${sidebarOpen ? 'block' : 'hidden'} md:hidden`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="pt-2 pb-3 space-y-1">
          <Link href="/">
            <a className={`block px-3 py-2 rounded-md text-base font-medium ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              Dashboard
            </a>
          </Link>
          <Link href="/products">
            <a className={`block px-3 py-2 rounded-md text-base font-medium ${activeTab === 'products' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              Products
            </a>
          </Link>
          <Link href="/clients">
            <a className={`block px-3 py-2 rounded-md text-base font-medium ${activeTab === 'clients' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              Clients
            </a>
          </Link>
          <Link href="/orders">
            <a className={`block px-3 py-2 rounded-md text-base font-medium ${activeTab === 'orders' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
              Orders
            </a>
          </Link>
        </div>
      </div>
    );
  }
  
  return null;
}
