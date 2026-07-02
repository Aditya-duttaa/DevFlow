import {
  LayoutDashboard,
  Building2,
  FolderKanban,
  ListTodo,
  Bell,
  User,
  Settings,
} from "lucide-react";

import { NavLink } from "react-router-dom";

const links = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },
  {
    name: "Organizations",
    icon: Building2,
    path: "/organizations",
  },
  {
    name: "Projects",
    icon: FolderKanban,
    path: "/projects",
  },
  {
    name: "Tasks",
    icon: ListTodo,
    path: "/tasks",
  },
  {
    name: "Notifications",
    icon: Bell,
    path: "/notifications",
  },
  {
    name: "Profile",
    icon: User,
    path: "/profile",
  },
  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="text-3xl font-bold p-6 border-b border-slate-700">
        DevFlow
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-indigo-600"
                    : "hover:bg-slate-800"
                }`
              }
            >
              <Icon size={20} />
              {link.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;