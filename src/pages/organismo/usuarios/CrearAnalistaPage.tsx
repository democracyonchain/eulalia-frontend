import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/services/axiosInstance";
import { toast } from "react-toastify";

export default function CrearAnalistaPage() {
  const [form, setForm] = useState({
    cedula_Ciudadano: "",
    nombre: "",
    apellido: "",
    fecha_Nacimiento: "",
    direccion: "",
    telefono: "",
    correo: "",
    contrasena: ""
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        rol_Id: 5 // Rol analista
      };
      await axiosInstance.post("/usuario/crear-con-ciudadano", payload);
      toast.success("✅ Usuario analista creado correctamente");
      navigate("/organismo/usuarios");
    } catch (error) {
      console.error("❌ Error al crear analista:", error);
      toast.error("Error al crear el usuario");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-2">Nuevo Usuario Analista</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          name="cedula_Ciudadano"
          placeholder="Cédula"
          className="border border-gray-300 px-4 py-2 rounded-md"
          onChange={handleChange}
        />
        <input
          name="nombre"
          placeholder="Nombre"
          className="border border-gray-300 px-4 py-2 rounded-md"
          onChange={handleChange}
        />
        <input
          name="apellido"
          placeholder="Apellido"
          className="border border-gray-300 px-4 py-2 rounded-md"
          onChange={handleChange}
        />
        <input
          type="date"
          name="fecha_Nacimiento"
          className="border border-gray-300 px-4 py-2 rounded-md"
          onChange={handleChange}
        />
        <input
          name="direccion"
          placeholder="Dirección"
          className="border border-gray-300 px-4 py-2 rounded-md col-span-2"
          onChange={handleChange}
        />
        <input
          name="telefono"
          placeholder="Teléfono"
          className="border border-gray-300 px-4 py-2 rounded-md"
          onChange={handleChange}
        />
        <input
          name="correo"
          type="email"
          placeholder="Correo electrónico"
          className="border border-gray-300 px-4 py-2 rounded-md"
          onChange={handleChange}
        />
        <input
          name="contrasena"
          type="password"
          placeholder="Contraseña"
          className="border border-gray-300 px-4 py-2 rounded-md col-span-2"
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end mt-6 gap-4">
        <button
          onClick={() => navigate("/organismo/usuarios")}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-6 py-2 rounded-md"
        >
          Cancelar
        </button>
        <button
          onClick={handleSubmit}
          className="bg-primary hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-md"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
