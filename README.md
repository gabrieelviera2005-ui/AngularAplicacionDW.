# Tallermecanico

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.2.

## Información general

Tallermecanico es una aplicación web para gestionar mecánicos, vehículos y órdenes de taller.

**Persistencia de datos:** la API local de mecánicos guarda los registros solo en memoria; no utiliza una base de datos. Los mecánicos creados se pierden cuando se detiene o reinicia el servidor.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## API local

En una terminal, inicia la API con:

```bash
npm run start:api
```

La API queda disponible en `http://localhost:3000/api`. Inicia Angular en otra terminal con `npm start`.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Configuracion del VPS

Reemplaza `<IP_DEL_VPS>` por la direccion del servidor. No guardes contrasenas ni tokens en este documento, en el repositorio ni en comandos que queden en el historial del shell.

### Crear el usuario administrador

Conectate inicialmente con la cuenta administrativa del VPS:

```bash
ssh root@<IP_DEL_VPS>
adduser sergio
usermod -aG sudo sergio
groups sergio
```

Luego conecta con el usuario nuevo:

```bash
ssh sergio@<IP_DEL_VPS>
```

### Firewall

Instala y configura UFW antes de habilitarlo, para no perder el acceso SSH:

```bash
sudo apt update
sudo apt install -y ufw
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw status
sudo ufw enable
sudo ufw status
```

### Instalar herramientas y servicios

```bash
sudo apt install -y git curl wget unzip zip nano htop vim \
  software-properties-common ca-certificates gnupg
sudo apt install -y nginx mariadb-server
sudo mysql_secure_installation
```

Instala PHP 8.4 y sus extensiones de la misma version:

```bash
sudo apt install -y php8.4 php8.4-fpm php8.4-cli php8.4-mysql \
  php8.4-xml php8.4-mbstring php8.4-curl php8.4-zip php8.4-intl \
  php8.4-bcmath php8.4-gd
```

Si el proyecto requiere otra version de PHP, cambia el numero de version de forma consistente en todos los paquetes. No mezcles extensiones de PHP 8.3 con PHP 8.4.

### Crear la base de datos MariaDB

Entra en MariaDB con una cuenta administrativa y crea un usuario de aplicacion con una contrasena unica y segura:

```sql
CREATE DATABASE restaurante;
CREATE USER 'ci4_user'@'localhost' IDENTIFIED BY '<CONTRASENA_SEGURA>';
GRANT SELECT, INSERT, UPDATE, DELETE ON restaurante.* TO 'ci4_user'@'localhost';
FLUSH PRIVILEGES;
```

Importa el volcado desde el servidor, sustituyendo la ruta por la ubicacion real del archivo:

```bash
mysql -u root -p restaurante < /ruta/a/restaurante.sql
```

Para retirar los permisos del usuario de aplicacion sobre esa base de datos:

```sql
REVOKE ALL PRIVILEGES ON restaurante.* FROM 'ci4_user'@'localhost';
FLUSH PRIVILEGES;
```

No uses la cuenta `root` de MariaDB desde la aplicacion. No compartas credenciales ni tokens de GitHub en documentos o repositorios. Si un token ya fue publicado, revocalo y crea uno nuevo.
