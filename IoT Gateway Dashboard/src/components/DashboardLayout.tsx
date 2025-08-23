import { ReactNode } from 'react';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from './ui/sidebar';
import { Activity, BarChart3, History, Settings, Zap, Gauge } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'parameters', label: 'Parameters', icon: Gauge },
  { id: 'controls', label: 'Controls', icon: Zap },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'history', label: 'History', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function DashboardLayout({ children, activeTab, onTabChange }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <Sidebar className="bg-gradient-to-b from-slate-900 to-blue-900 border-r-0">
          <SidebarContent>
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <h2 className="mb-2 text-white">IoT Gateway Dashboard</h2>
              <p className="text-blue-100">Monitor & Control</p>
            </div>
            <SidebarGroup>
              <SidebarGroupLabel className="text-slate-300">Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() => onTabChange(item.id)}
                        isActive={activeTab === item.id}
                        className={`${
                          activeTab === item.id 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600' 
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        } transition-all duration-200`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <main className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
          <header className="border-b border-slate-200 dark:border-slate-800 p-4 flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <SidebarTrigger className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100" />
            <h1 className="capitalize bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-medium">{activeTab}</h1>
          </header>
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}