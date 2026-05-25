# Sanctuary Health — TuSalud

Plataforma de telemedicina premium con diseño "Clinical Sanctuary". Mobile-first, accesible, y centrada en la experiencia del paciente.

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
```

### Credenciales de prueba

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Admin | admin@admin.com | admin |
| Doctor | doctor@test.com | 123 |
| Paciente | patient@test.com | 123 |

### Comandos Supabase

```bash
supabase link --project-ref ymzmjrmruyiqrhkpjyow
supabase db push          # Aplicar migraciones
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
| `npx tsx scripts/seed.ts` | Seed de datos iniciales |

## Deploy (Vercel)

```bash
npm run build
npm run start
```

Configurar en Vercel: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
