# Plan de conexión backend–frontend para horarios

Este flujo documenta cómo encadenar el backend con las pantallas existentes para que el usuario pueda habilitar semanas, cargar borradores/semanales, gestionar empleados, incidencias y permisos.

## 1. Habilitar una semana antes de crear horarios
- **Pantalla**: `app/horarios/crearHorarios/page.tsx` usa el componente `WeeklyScheduleSelector` (`components/selectsemana.tsx`).
- **Acción recomendada**: al pulsar **Crear semana**, llamar a un endpoint como `POST /api/weeks` con `{ startDate, endDate }` y guardar el `weekId` retornado (por ejemplo en contexto global o en la URL como query `?weekId=`).
- **Transición**: tras recibir el `weekId`, redirigir al usuario a:
  - **Borrador diario** (`/horarios/borrador`) si quiere armar horarios día a día.
  - **Semanal** (`/horarios/semanal`) si quiere cargar directamente los bloques semanales.
- **Estado persistente**: mantener el `weekId` en `localStorage` o en un store de estado para rehidratarlo al abrir las demás vistas.

## 2. Borrador diario (guardar avances)
- **Pantalla**: `app/horarios/borrador/page.tsx`.
- **Carga inicial**: en `useEffect`, leer el `weekId` almacenado y la fecha actual (`dateKey`). Llamar a `GET /api/weeks/{weekId}/days/{dateKey}` para poblar `schedule` y `requiredBySlot` con datos reales.
- **Guardado como borrador**: reutilizar el botón **Guardar** del modal para enviar `PUT /api/weeks/{weekId}/days/{dateKey}` con la grilla de empleados (`mode`, `startIndex`, `endIndex`, `box`). Marcar el registro como `status=draft` hasta que el usuario decida publicar.
- **Cambio de día**: en `goToPrevDay/goToNextDay`, volver a sincronizar con el backend usando la misma ruta por fecha.

## 3. Horario semanal
- **Pantalla**: `app/horarios/semanal/page.tsx` (usa `SelectHoras` y `SelectCajas`).
- **Carga inicial**: con el `weekId` vigente, solicitar `GET /api/weeks/{weekId}/weekly` para llenar la tabla con los turnos existentes.
- **Guardado**: enviar `PUT /api/weeks/{weekId}/weekly` con la matriz completa (empleado + turnos por día). Agregar un botón **Guardar semanal** que dispare la llamada. Este guardado puede marcarse como `status=draft` igual que el diario.
- **Publicación**: cuando el usuario confirme, llamar a `POST /api/weeks/{weekId}/publish` para mover los registros de borrador a vigentes.

## 4. Gestión de empleados (requisito previo)
- **Pantalla**: `app/horarios/empleados/page.tsx` con `components/dataTable.tsx`.
- **Listado**: sustituir los datos mock (`data`) por `GET /api/employees` y mapear `{ id, name, horas }`.
- **Creación/edición**: añadir un modal de alta/edición que haga `POST /api/employees` y `PUT /api/employees/{id}`; al guardar, refrescar el listado. Sin empleados creados no se deben permitir guardados de horarios.

## 5. Incidencias y aceptaciones de permisos
- **Incidencias**: `app/horarios/report/page.tsx` usa `ReporteIncidencias`; conectarlo a `GET /api/incidents` y `POST /api/incidents` para registrar o mostrar incidencias por empleado y fecha.
- **Permisos**: `app/horarios/permisos/page.tsx` usa `PermissionsInbox`. Reemplazar `mockRequests` por `GET /api/permissions`. Al aceptar/rechazar, llamar a `POST /api/permissions/{id}/approve` o `/reject` y actualizar el estado local.

## 6. Consejos de estado compartido
- Centralizar `weekId` y el estado de borrador/publicado en un contexto (por ejemplo, Zustand o React Context) que lean todas las vistas de horarios.
- Incluir indicadores en UI (badge o alert) cuando la semana está en borrador o publicada para evitar confusiones al guardar.

## 7. Checklist rápido de integración
- [ ] Exponer endpoints `weeks`, `weekly/daily`, `employees`, `incidents`, `permissions` en el backend.
- [ ] Propagar `weekId` desde `WeeklyScheduleSelector` al resto de pantallas.
- [ ] Reemplazar datos mock en borrador, semanal, empleados, permisos e incidencias por respuestas reales.
- [ ] Añadir feedback (loaders/toasts) en cada acción de guardar o publicar.
