"use client";
import { ChevronLeft, ChevronRight, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { BookOpen } from "lucide-react";
interface NavbarProps {
  collapsed: boolean;
  setCollapsed: (val: boolean) => void;
}
export default function Navbar({ collapsed, setCollapsed }: NavbarProps) {
  const router = useRouter();
  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-screen transition-all duration-300 border-r shadow-md
      ${collapsed ? "w-16" : "w-60"}
      bg-gradient-to-br from-[#F0F4FF] via-[#E0E7FF] to-[#F0F4FF] border-[#E2E8F0] p-4`}
    >
      <div className="flex items-center justify-between">
        {!collapsed && (
          <span className="text-[#7C3AED] text-xl font-extrabold">BlogScrapper</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-[#7C3AED] hover:bg-transparent"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </Button>
      </div>
      <nav className="flex flex-col mt-6 space-y-2">
        <Button
          variant="ghost"
          className="justify-start text-[#1E293B]"
          onClick={() => router.push("/")}
        >
          <Home className="w-4 h-4 mr-2" />
          {!collapsed && "Home"}
        </Button>
<Button
  variant="ghost"
  className="justify-start text-[#1E293B]"
  onClick={() => {
    toast("Refreshing page...", {
      description: "Session will be reset.",
      duration: 2000,
      style: {
        background: "#E0E7FF", 
        color: "#4C1D95",      
        border: "1px solid #C4B5FD",
      },
    });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }}
>
  <RefreshCw className="w-4 h-4 mr-2" />
  {!collapsed && "Refresh"}
</Button>

        <Button
  variant="ghost"
  className="justify-start text-[#1E293B]"
  onClick={() => router.push("/full-text")}
>
  <BookOpen className="w-4 h-4 mr-2" />
  {!collapsed && "Full Text"}
</Button>

      </nav>
      {!collapsed && (
        <div className="absolute bottom-4 left-4 text-xs text-gray-500">
          © {new Date().getFullYear()} BlogScrapper
        </div>
      )}
    </aside>
  );
}
