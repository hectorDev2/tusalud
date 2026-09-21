# TuSalud — Resumen de flujos de la plataforma

## 1. Objetivo

TuSalud es una plataforma de telemedicina que conecta pacientes con doctores mediante consultas digitales, chat en tiempo real, gestión de tokens y administración operativa.

La plataforma contempla tres perfiles principales:

- **Paciente:** solicita consultas, consulta su historial, administra sus tokens y conversa con el doctor.
- **Doctor:** configura su disponibilidad, recibe consultas, atiende pacientes y cierra la atención.
- **Administrador:** supervisa usuarios, doctores, consultas, tokens y métricas generales.

## 2. Flujo de acceso

1. El usuario crea una cuenta o inicia sesión.
2. El sistema valida sus credenciales mediante Supabase Auth.
3. Se carga su perfil y rol correspondiente.
4. El sistema lo dirige automáticamente al área correspondiente:
   - Paciente → `/patient`
   - Doctor → `/doctor`
   - Administrador → `/admin`
5. Cada sección valida nuevamente la sesión y los permisos antes de mostrar o modificar información.

## 3. Flujo del paciente

### Solicitar una consulta

1. El paciente ingresa el motivo y la prioridad de la consulta.
2. El sistema verifica que tenga tokens disponibles.
3. Se descuenta un token de forma segura.
4. La consulta se asigna a un doctor disponible.
5. Si no hay doctores disponibles, queda en estado **Pendiente**.
6. El paciente puede consultar el estado desde su historial.

### Estados principales

```text
Pendiente → Asignada → En progreso → Cerrada
```

Al cerrar la consulta, el doctor registra un resumen y puede indicar si se requiere una consulta formal posterior.

## 4. Flujo del doctor

1. El doctor inicia sesión y accede a su panel.
2. Activa o desactiva su disponibilidad.
3. El sistema mantiene actualizada su actividad mientras está conectado.
4. Puede ver sus consultas asignadas y la cola de consultas pendientes.
5. Reclama una consulta pendiente.
6. Accede a la información clínica permitida del paciente.
7. Atiende la consulta mediante el chat.
8. Cambia el estado de la consulta y la cierra con un resumen.

Una consulta pendiente solo puede ser reclamada por un doctor. Si dos doctores intentan tomarla al mismo tiempo, el sistema conserva una única asignación válida.

## 5. Chat en tiempo real

El paciente y el doctor pueden intercambiar mensajes dentro de la consulta.

- Los mensajes nuevos aparecen en tiempo real.
- Solo pueden acceder el paciente involucrado y el doctor asignado.
- La conversación queda asociada a la consulta correspondiente.
- El chat se mantiene disponible mientras la consulta está activa.

## 6. Tokens

Los tokens representan la unidad utilizada para iniciar consultas.

- El paciente puede consultar su saldo y movimientos.
- Cada nueva consulta descuenta un token.
- El sistema contempla asignaciones semanales automáticas.
- El administrador puede otorgar tokens manualmente.
- El sistema evita duplicar asignaciones semanales.

## 7. Administración

El administrador puede:

- Consultar métricas generales.
- Revisar y aprobar solicitudes de doctores.
- Gestionar usuarios.
- Consultar registros de pacientes autorizados.
- Revisar movimientos globales de tokens.
- Otorgar tokens manualmente.

Las acciones administrativas quedan protegidas por permisos específicos y registran eventos relevantes para auditoría.

## 8. Reporte de errores

Desde cualquier pantalla autenticada, el usuario puede abrir **Reportar un problema** y enviar:

- Título del problema.
- Descripción detallada y pasos para reproducirlo.
- Prioridad.
- Captura de pantalla o fotografía opcional.
- Pantalla desde la que se realizó el reporte.
- Contexto técnico del error cuando el navegador detecta una falla no controlada.

Los reportes llegan a la bandeja administrativa `/admin/bug-reports`, donde el equipo puede filtrarlos, revisar la captura y cambiar su estado:

```text
Abierto → En revisión → Resuelto → Cerrado
```

Las imágenes se guardan en un bucket privado y solo se muestran mediante enlaces temporales al personal autorizado.

## 9. Seguridad y privacidad

La plataforma aplica las siguientes medidas:

- La identidad se obtiene exclusivamente desde la sesión autenticada.
- No se permite identificar usuarios mediante encabezados manipulables por el cliente.
- Cada API valida sesión y rol antes de operar.
- Los datos clínicos se restringen mediante políticas de acceso en la base de datos.
- Las claves administrativas permanecen en el servidor.
- Los usuarios comunes no pueden cambiar su propio rol.
- La información del chat solo está disponible para los participantes de la consulta.

## 10. Estado actual

### Implementado y verificado

- Registro e inicio de sesión.
- Redirección por rol.
- Protección de rutas y APIs.
- Creación de consultas.
- Descuento atómico de tokens.
- Asignación y reclamo de consultas.
- Disponibilidad de doctores.
- Chat en tiempo real.
- Cierre de consultas.
- Panel administrativo conectado a datos reales.
- Migraciones de base de datos aplicadas en el proyecto remoto.
- Sistema de reportes de errores con adjuntos y bandeja administrativa.

### Pendiente de validación final

- Confirmar en el entorno productivo el despliegue y la programación de las tareas automáticas de tokens y disponibilidad.
- Completar las pruebas de aceptación con usuarios reales de cada rol.
- Retirar el mecanismo temporal de respaldo de métricas antes de declarar el módulo administrativo como definitivo.

## 11. Próximos pasos recomendados

1. Ejecutar una prueba guiada con un paciente, un doctor y un administrador.
2. Validar los casos de error: sin tokens, consulta cerrada y consulta ya reclamada.
3. Confirmar las tareas automáticas en Supabase.
4. Revisar textos, políticas comerciales y criterios de atención antes de producción.
5. Realizar la aprobación final del flujo completo.

> Las credenciales de prueba y las claves de infraestructura deben compartirse por un canal seguro separado de este documento.
