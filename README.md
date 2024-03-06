
# Ecommerce Zone

Plataforma de Ecommerce con listado de productos, categorias, carrito de compras, pasarela de pago con Paypal y sección para unicamente los administradores donde pueden realizar las funciones CRUD de los productos, listado de ordenes y de usuarios


## Lenguajes y Frameworks utilizados

Frontend: TypeScript, React 18 y Tailwindcss

Backend: Django, Django RestFramework

Base de datos: SQLite3
## Instalacion

Consideraciones antes de clonar e iniciar el proyecto

✅ Tener instalado Node.js en su ultima versión

✅ Tener instalado Python en su ultima versión

Clonar el repositorio

```bash
git clone https://github.com/Andrewsjjz/EcommerceZone.git
```

Entrar mediante terminal al repositorio (si usas Windows)
    
```bash
cd EcommerceZone
```

## Backend

Crear el entorno virtual

```bash
py -m venv env
```

Dirigirnos a la carpeta Scripts de tu entorno virtual

```bash
cd env/Scripts
activate
```
Una vez activado retroceder hasta el inicio de la carpeta EcommerceZone

Instalar las librerias necesarias

```bash
pip install -r requirements.txt
```

Crear las carpetas estaticas en la raiz del proyecto

```bash
mkdir dist
mkdir dist/static
```

Crear superusuario

```bash
python3 manage.py createsuperuser
```

Iniciar servidor

```bash
python3 manage.py runserver
```

## Frontend

Dirigirnos a la carpeta frontend

```bash
cd frontend
```

Instalar las dependencias

```bash
npm install
```

Levantar servidor

```bash
npm run dev
```
Ir a la dirección e iniciar sesión: 

http://localhost:5173/

