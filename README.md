# Sanctuary Health — TuSalud

Plataforma de telemedicina premium con diseño "Clinical Sanctuary". Mobile-first, accesible, y centrada en la experiencia del paciente.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v4
- **Tipografía:** Manrope (headlines) + Inter (body)
- **Iconos:** Material Symbols
- **Datos:** Mock data layer (preparado para Supabase)

## Design System

Inspirado en el concepto **"Clinical Sanctuary"**: estética editorial premium, sin líneas divisorias (uso de jerarquía de fondos y espacio), glassmorphism, gradientes sutiles y tipografía de alto contraste.

[Ver especificación completa](ui-stitch/lumina_health/DESIGN.md)

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
| `/patient/new` | Nueva consulta (intake) |
| `/patient/messages` | Bandeja de mensajes |
| `/patient/tokens` | Libro de tokens |
| `/patient/profile` | Perfil y preferencias |

### Doctor
| Ruta | Vista |
|------|-------|
| `/doctor` | Dashboard con métricas y cola |
| `/doctor/consultations` | Lista de consultas asignadas |
| `/doctor/consultations/[id]` | Vista de consulta + chat |
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

En modo development aparece un botón **"Debug"** (arriba a la derecha) con un navbar de acceso rápido a todas las rutas.

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servir build |
| `npm run lint` | Linter ESLint |

## Estructura

```
app/
├── admin/           # Panel de administración
├── doctor/          # Panel del doctor
├── patient/         # Panel del paciente
├── login/           # Inicio de sesión
├── signup/          # Registro
├── verify/          # Verificación de email
├── page.tsx         # Landing page
├── layout.tsx       # Layout raíz (fonts + metadata)
└── globals.css      # Design system tokens
components/          # Componentes compartidos
lib/                 # Mock data y tipos
```
