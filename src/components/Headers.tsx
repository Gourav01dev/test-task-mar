import { useState } from "react";
import { Bell, ChevronDown, Menu, User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const [notifications, setNotifications] = useState<number>(2);

  const logout = () => {
    console.log("Logging out...");
  };

  return (
    <header className="sticky top-0 bg-white shadow-md border-b border-gray-200 z-50 mb-5">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Sidebar Toggle & Logo */}
        <div className="flex items-center gap-4">
          {/* Sidebar Toggle Button */}
          <button
            className="text-gray-600 hover:text-gray-800 transition md:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
      
            <span className="text-lg font-semibold text-gray-700">Test Project</span>
          </Link>
        </div>

        {/* Right Side: Notifications, Profile */}
        <div className="flex items-center gap-6">
          {/* Notification Button */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-600 hover:text-gray-800 transition" />
            {notifications > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white font-bold">
                {notifications}
              </span>
            )}
          </Button>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-gray-100 rounded-md transition">
                <div className="h-9 w-9 rounded-full border bg-gray-200 flex items-center justify-center">
                  <User className="h-5 w-5 text-gray-600" />
                </div>
                <ChevronDown className="h-4 w-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 shadow-md rounded-md border">
              <DropdownMenuItem className="flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer">
                <User className="h-4 w-4 text-gray-600" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 p-3 hover:bg-gray-100 cursor-pointer">
                <Settings className="h-4 w-4 text-gray-600" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex items-center gap-2 p-3 hover:bg-red-100 text-red-600 cursor-pointer"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
