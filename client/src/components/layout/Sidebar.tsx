import { Link } from "wouter";

interface SidebarProps {
  activeTab: string;
}

export default function Sidebar({ activeTab }: SidebarProps) {
  return (
    <aside className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white shadow">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold text-primary">Print Shop Manager</h1>
          </div>
          <div className="mt-8 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-2">
              <Link href="/">
                <a className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                  <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </a>
              </Link>
              <Link href="/products">
                <a className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${activeTab === 'products' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                  <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Products
                </a>
              </Link>
              <Link href="/clients">
                <a className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${activeTab === 'clients' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                  <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Clients
                </a>
              </Link>
              <Link href="/orders">
                <a className={`group flex items-center px-4 py-3 text-sm font-medium rounded-md ${activeTab === 'orders' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}>
                  <svg className="mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Orders
                </a>
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </aside>
  );
}
