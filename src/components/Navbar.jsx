import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Compass, MessageCircle, Bell, User, Plane } from "lucide-react";

const TABS = [
  { to: "/", icon: Home, end: true },
  { to: "/explore", icon: Compass },
  { to: "/messages", icon: MessageCircle },
  { to: "/notifications", icon: Bell },
  { to: "/profile", icon: User },
];

export default function Navbar({ unreadMessages = 0, unreadNotifs = 0 }) {
  return (
    <>
      <header className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-bg z-10">
        <div className="flex items-center gap-1.5">
          <Plane size={19} className="text-accent -rotate-45" />
          <span className="font-display font-extrabold text-lg">Vyoma</span>
        </div>
      </header>

      <nav className="flex justify-around py-2.5 border-t border-border bg-bg fixed bottom-0 left-0 right-0 max-w-[420px] mx-auto">
        {TABS.map(({ to, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className="p-1 relative">
            {({ isActive }) => (
              <>
                <Icon size={22} color={isActive ? "#FF8A3D" : "#9CA3C4"} strokeWidth={isActive ? 2.4 : 2} />
                {to === "/messages" && unreadMessages > 0 && <Badge n={unreadMessages} />}
                {to === "/notifications" && unreadNotifs > 0 && <Badge n={unreadNotifs} />}
                {isActive && <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}

function Badge({ n }) {
  return (
    <span className="absolute -top-1 -right-1.5 bg-accent text-[#1A1204] text-[9px] font-bold rounded-full min-w-[15px] h-[15px] flex items-center justify-center px-1">
      {n > 9 ? "9+" : n}
    </span>
  );
}
