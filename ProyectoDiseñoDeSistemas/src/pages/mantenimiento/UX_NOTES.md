# Mantenimiento: contratos y simulación

- Una máquina y un técnico por orden. El código de maquinaria se genera al guardar; las horas son un dato registrado, sin categorías automáticas de desgaste.
- Sin prioridad ni inventario de repuestos. Los repuestos se mencionan en descripción u observaciones del trabajo.
- Crear una orden deja la máquina sin cambios y la orden pendiente. La operación de creación es la misma desde Maquinaria y Órdenes; sus datos se mantienen locales a cada pantalla.
- Iniciar registra fecha/hora de Buenos Aires y pasa la máquina a mantenimiento o reparación según el tipo.
- Finalizar exige trabajo realizado y estado resultante, registra fin y actualiza la copia local de la máquina. El detalle de la orden muestra el resultado.
- Las fechas de avance se registran mediante Iniciar/Finalizar. La edición muestra esos valores como información de consulta para no omitir la validación de cierre.
- No hay contexto/global store ni cambios en App, layout, tema o dependencias. Salir de una pantalla reinicia su simulación y los cambios no se propagan a otra pantalla.
- La creación rápida desde Maquinaria permite consultar la orden en la confirmación local.

## Presentación

Se mantienen los patrones de MUI con `sx`, diálogos completos bajo `sm`, listados en tarjetas bajo `md`, tabla desplazable, filtros identificados, controles de al menos 44 px y estados con texto. Los estilos compartidos dentro del módulo están en `components/mantenimiento/ModuleUI.jsx`; no dependen de Compras ni de componentes globales nuevos.

Pruebas: `node --test src/pages/mantenimiento/logic.test.mjs`.
