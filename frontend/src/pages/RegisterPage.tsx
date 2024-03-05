import { Link, useNavigate, Navigate } from "react-router-dom";
import { registerRequest } from "../api/users";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/auth";

const RegisterPage = () => {

    const navigate = useNavigate();
    const { isAuth } = useAuthStore();

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [last_name, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [re_password, setRePassword] = useState("");

    const registerMutation = useMutation({
        mutationFn: () => registerRequest(email, name, last_name, password),
        onSuccess: () => {
            toast.success("Se ha registrado existosamente")
            navigate("/login")
        },
        onError: () => {
            toast.error("Ocurrió un error, intente nuevamente")
        }
    })

    const handleMatch = () => {
        if (password !== re_password) {
            return false
        } else {
            return true
        }
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (password !== re_password) {
            toast.error("Las contraseñas deben coincidir")
        } else {
            registerMutation.mutate()
        }
    }

    if (registerMutation.isLoading) return <p>Loading...</p>
    if (isAuth) return (<Navigate to="/"/>)

    return (
      <div className="flex flex-col items-center justify-center px-6 py-10 mx-auto lg:py-10">
        <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900">
          <img className="w-8 h-8 mr-2" 
                    src="/logo.png"
          alt="logo"/>
          <span>E-commerce Zone</span>
        </Link>
        <div className="w-full md:w-[400px] lg:w-[500px] bg-white rounded-lg shadow-xl dark:border md:mt-0 
        sm:max-w-md xl:p-0 dark:border-gray-400">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 
            md:text-2xl">
              Crear una nueva cuenta
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>

              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                Correo electronico</label>
                <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email" 
                required
                name="email" 
                id="email" 
                className="bg-gray-50 border border-gray-300 text-gray-900
                sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                placeholder="name@company.com"/>
              </div>

              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                Nombre</label>
                <input 
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                type="name" 
                name="name" 
                id="name" 
                className="bg-gray-50 border border-gray-300 text-gray-900
                sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                placeholder="Name"/>
              </div>

              <div>
                <label htmlFor="last_name" className="block mb-2 text-sm font-medium text-gray-900 
              ">
                  Apellido</label>
                <input 
                value={last_name}
                required
                onChange={(e) => setLastName(e.target.value)}
                type="last_name" 
                name="last_name" 
                id="last_name" 
                className="bg-gray-50 border border-gray-300 text-gray-900
                sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                placeholder="Last name"/>
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 
              ">Contraseña</label>
                <input 
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
                type="password" 
                name="password" 
                id="password" 
                placeholder="••••••••" 
                className="bg-gray-50 border border-gray-300 text-gray-900
                sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
              </div>

              <div>
                <label htmlFor="re-password" 
                className="block mb-2 text-sm font-medium text-gray-900">Confirmar contraseña</label>
                <input 
                value={re_password}
                required
                onChange={(e) => setRePassword(e.target.value)}
                type="password" 
                name="re-password" 
                id="re-password" 
                placeholder="••••••••" 
                className="bg-gray-50 border border-gray-300 text-gray-900
                sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" />
              </div>

            {handleMatch() ? false : <p className="text-sm font-medium text-red-500">Las contraseñas no coinciden</p>}

              <button 
              type="submit" 
              className="w-full flex items-center justify-center text-white bg-primary-700 
              hover:bg-primary-800 font-medium rounded-lg text-sm px-4 py-2 dark:bg-slate-700 
              dark:hover:bg-slate-800 focus:outline-none">
              Registrarse</button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Have an account? <Link to={'/login'} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    )
    
}
export default RegisterPage;
