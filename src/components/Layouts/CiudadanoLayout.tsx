// src/components/Layouts/AdminLayout.tsx
import { Outlet } from "react-router-dom";
export default function CiudadanoLayout() {
  return (
    <div>
      {/* Aquí tu menú de Admin */}
      <Outlet />
    </div>
  );
}
