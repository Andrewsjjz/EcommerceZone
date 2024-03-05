import { Link, useNavigate, Navigate } from "react-router-dom";
import { loginRequest } from "../api/users";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../store/auth";

const LoginPage = () => {

    const navigate = useNavigate();
    const { isAuth } = useAuthStore();
    const setToken = useAuthStore((state) => state.setToken);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginMutation = useMutation({
        mutationFn: () => loginRequest(email, password),
        onSuccess: (response) => {
            setToken(response.data.access, response.data.refresh)
            toast.success("Inicio de sesion exitoso")
            navigate("/")
        },
        onError: () => {
            toast.error("Correo o contraseña inválido, verifique e intente nuevamente")
        }
    })

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        loginMutation.mutate()
    }

    if (loginMutation.isLoading) return <p>Loading...</p>
    if (isAuth) return (<Navigate to="/"/>)

    return (
      <div className="flex flex-col items-center justify-center px-6 py-10 mx-auto lg:py-10">
        <Link to="/" className="flex items-center mb-6 text-2xl font-semibold text-slate-800">
          <img className="w-8 h-8 mr-2" 
                    src="/logo.png"
          alt="logo"/>
          <span>E-commerce Zone</span>
        </Link>
        <div className="w-full md:w-[400px] lg:w-[500px] bg-white rounded-lg shadow-xl dark:border md:mt-0 
        sm:max-w-md xl:p-0 dark:border-gray-400">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl text-center font-semibold leading-tight tracking-tight text-gray-900 md:text-2xl">
                Iniciar Sesión
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>

              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                  Correo electronico</label>
                <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email" 
                name="email" 
                id="email" 
                className="bg-gray-50 border border-gray-300 text-gray-900
                sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" 
                placeholder="name@company.com"/>
              </div>

              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
                Contraseña</label>
                <input 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password" 
                name="password" 
                id="password" 
                placeholder="••••••••" 
                className="bg-gray-50 border border-gray-300 text-gray-900
                sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"/>
              </div>

              <button 
              type="submit" 
              className="w-full flex items-center justify-center text-white bg-primary-700 
              hover:bg-primary-800 font-medium rounded-lg text-sm px-4 py-2 dark:bg-slate-700 
              dark:hover:bg-slate-800 focus:outline-none">
              Iniciar Sesión</button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                ¿No tienes una cuenta? <Link to={'/register'} className="font-medium text-primary-600 
                hover:underline dark:text-primary-500">Regístrate</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    )
    
}
export default LoginPage;
