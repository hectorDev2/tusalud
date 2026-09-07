# Sanctuary Health — TuSalud

Plataforma de telemedicina premium con diseño "Clinical Sanctuary". Mobile-first, accesible, y centrada en la experiencia del paciente.

## Estado de la plataforma

La aplicación está conectada a Supabase y cuenta con autenticación y autorización por rol para los flujos de paciente, doctor y administración. Las migraciones de `supabase/migrations/` están aplicadas en el proyecto remoto vinculado.

### Seguridad implementada

- Supabase Auth es la única fuente de identidad; no se acepta `x-user-id` ni identidad desde `localStorage`.
- Las API Routes reutilizan `requireAuth()`, `requireAdmin()`, `requireDoctor()` y `requirePatient()` desde `lib/route-auth.ts`.
- Las rutas privadas están protegidas desde `proxy.ts`.
- `SUPABASE_SERVICE_ROLE_KEY` se utiliza únicamente en el servidor y después de validar la sesión y el rol.
- Las RPC sensibles validan `auth.uid()` y las políticas RLS restringen el acceso a los datos clínicos.
- Los usuarios comunes no pueden cambiar su rol y las consultas no aceptan inserción directa desde el cliente.
- La asignación de consultas de doctores es atómica y los créditos semanales tienen restricciones contra duplicados.

Para revisar el estado remoto sin exponer secretos:

```bash
supabase migration list --linked
```

## Stack

| Capa | Tecnología |
|------|-----------|
| **Framework** | Next.js 16 (App Router) |
| **Lenguaje** | TypeScript |
| **Estilos** | Tailwind CSS v4 |
| **Tipografía** | Manrope (headlines) + Inter (body) |
| **Iconos** | Material Symbols |
| **Base de datos** | PostgreSQL via Supabase |
| **Autenticación** | Supabase Auth |
| **ORM / Client** | Supabase JS + SSR |

## Design System

Inspirado en el concepto **"Clinical Sanctuary"**: estética editorial premium, sin líneas divisorias (uso de jerarquía de fondos y espacio), glassmorphism, gradientes sutiles y tipografía de alto contraste.

Colores: palette Material 3 custom (M3), modo claro únicamente por ahora.

## Rutas

### Públicas
| Ruta | Vista |
|------|-------|
| `/` | Landing page |
| `/login` | Inicio de sesión |
| `/signup` | Registro |
| `/verify` | Verificación de email |

### Paciente
| Ruta | Vista |
|------|-------|
| `/patient` | Dashboard con tokens y alertas |
| `/patient/consultations` | Historial de consultas |
| `/patient/consultations/[id]` | Chat con el doctor |
| `/patient/new` | Nueva consulta |
| `/patient/messages` | Bandeja de mensajes |
| `/patient/tokens` | Libro de tokens |
| `/patient/profile` | Perfil y preferencias |

### Doctor
| Ruta | Vista |
|------|-------|
| `/doctor` | Dashboard con métricas y cola |
| `/doctor/consultations` | Lista de consultas asignadas |
| `/doctor/consultations/[id]` | Consulta + historial clínico |
| `/doctor/agenda` | Agenda semanal |
| `/doctor/profile` | Perfil y disponibilidad |

### Admin
| Ruta | Vista |
|------|-------|
| `/admin` | Panel con estadísticas globales |
| `/admin/patient-records` | Registros de pacientes |
| `/admin/doctor-approvals` | Aprobaciones de doctores |
| `/admin/user-management` | Gestión de usuarios |
| `/admin/token-ledger` | Libro de tokens global |

## Desarrollo

```bash
npm run dev
# http://localhost:3000
```

En desarrollo aparece un botón **"Debug"** (arriba a la derecha) para navegar rápidamente entre rutas.

## Configuración de Supabase

El proyecto está conectado a Supabase. Las migraciones están en `supabase/migrations/`.

### Variables de entorno requeridas

```env
NEXT_PUBLIC_SUPABASE_URL=https://ymzmjrmruyiqrhkpjyow.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>
SUPABASE_DB_PASSWORD=<database_password>
```

`SUPABASE_SERVICE_ROLE_KEY` y `SUPABASE_DB_PASSWORD` son secretos de servidor. Guardalos únicamente en `.env.local` o en el proveedor de deploy; nunca los expongas al navegador ni los commitees.

### Credenciales de prueba locales

Estas cuentas son únicamente para desarrollo/demo y deben reemplazarse o eliminarse antes de un despliegue productivo.

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | admin@admin.com | admin |
| Doctor | doctor@test.com | 123 |
| Paciente | patient@test.com | 123 |

### Comandos Supabase

```bash
supabase link --project-ref ymzmjrmruyiqrhkpjyow
set -a; source .env.local; set +a
supabase db push --linked # Aplicar migraciones
supabase migration list --linked
supabase gen types typescript --linked > lib/database.types.ts
```

## Estructura

```
app/
├── admin/              # Panel de administración
├── doctor/             # Panel del doctor
├── patient/            # Panel del paciente
├── login/              # Inicio de sesión
├── signup/             # Registro
├── verify/             # Verificación de email
├── api/                # API routes (todas conectadas a Supabase)
│   ├── auth/           #   login, signup, logout, verify
│   ├── patient/        #   profile, consultations, tokens, messages
│   ├── doctor/         #   profile, consultations, agenda
│   └── admin/          #   stats, patients, approvals, users, tokens
├── page.tsx            # Landing page
└── layout.tsx          # Layout raíz
components/             # Componentes compartidos
lib/                    # Supabase client, hooks, tipos, api-types
proxy.ts                # Middleware de autenticación
scripts/                # Scripts de seed
supabase/
├── migrations/         # Migraciones SQL
└── config.toml         # Configuración local
```

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servir build |
| `npm run lint` | Linter ESLint |
| `npx tsc --noEmit --incremental false` | Verificación de tipos sin generar build |
| `npx tsx scripts/seed.ts` | Seed de datos iniciales |

## Deploy (Vercel)

```bash
npm run build
npm run start
```

Configurar en Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
