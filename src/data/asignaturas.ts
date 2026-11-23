// Las ocho asignaturas del curso. `clase` elige el color de resaltador en apuntes.css.
export const asignaturas = [
  { slug: 'acceso-a-datos', clase: 'ad', nombre: 'Acceso a Datos',
    sobre: 'De ficheros CSV a JPA y Spring, rehaciendo el mismo CRUD',
    entrada: 'Cómo guarda y recupera datos una aplicación Java. Todo el curso gira alrededor de un mismo CRUD de productos que se rehace cada vez que aprendemos una forma nueva de guardarlo.' },
  { slug: 'servicios-y-procesos', clase: 'psp', nombre: 'Programación de Servicios y Procesos', sobre: 'Hilos, sincronización y sockets en Python' },
  { slug: 'interfaces', clase: 'di', nombre: 'Desarrollo de Interfaces', sobre: 'Flutter: widgets, estado y componentes reutilizables' },
  { slug: 'despliegue', clase: 'daw', nombre: 'Despliegue de Aplicaciones Web', sobre: 'Servidores, nginx, SSH y Docker' },
  { slug: 'multimedia', clase: 'pmdm', nombre: 'Programación Multimedia y Dispositivos Móviles', sobre: 'React Native, multimedia y motores de videojuegos' },
  { slug: 'sge', clase: 'sge', nombre: 'Sistemas de Gestión Empresarial', sobre: 'ERP y CRM con Odoo' },
  { slug: 'itinerario', clase: 'ipe', nombre: 'Itinerario Personal para la Empleabilidad II', sobre: 'La empresa, el mercado y el plan de empresa' },
  { slug: 'sostenibilidad', clase: 'ipe', nombre: 'Sostenibilidad', sobre: 'Agenda 2030, energía y sostenibilidad en el sector TIC' },
];

// Acceso a Datos: el mismo CRUD rehecho con cada tecnología
export const pasosCrud = [
  { nombre: 'A mano', detalle: 'JSON escrito con split' },
  { nombre: 'Ficheros', detalle: 'CSV, JSON y XML' },
  { nombre: 'JDBC', detalle: 'SQL escrito por mí' },
  { nombre: 'JPA', detalle: 'Hibernate escribe el SQL' },
  { nombre: 'Spring', detalle: 'API REST con Spring Boot' },
];

export const REPO_AD = 'https://github.com/alejandroDonGar/Acceso-a-Datos-2026---2027/';

// Itinerario: los apartados del modelo de plan de empresa y la unidad que explica cada uno.
// u = unidad (sin asignatura), a = anclaje del tema en esa página, t = texto del enlace.
type Enlace = { u: string; a: string; t: string };
export const planEmpresa: { n: number; apartado: string; enlaces: Enlace[]; nota?: string }[] = [
  { n: 2, apartado: 'Equipo promotor', enlaces: [{ u: 'ut2-iniciativa-emprendedora', a: 'emprender-modalidades-y-perfil', t: 'Perfil y acuerdos de equipo' }] },
  { n: 3, apartado: 'Del problema a la idea', enlaces: [{ u: 'ut2-iniciativa-emprendedora', a: 'creatividad-y-oportunidades-en-canarias', t: 'Creatividad y oportunidades' }] },
  { n: 4, apartado: 'Entorno y mercado en Canarias', enlaces: [
    { u: 'ut1-empresa-entorno', a: 'el-entorno-pestel-y-porter', t: 'PESTEL y Porter' },
    { u: 'ut2-iniciativa-emprendedora', a: 'creatividad-y-oportunidades-en-canarias', t: 'DAFO' },
    { u: 'ut3-mercado-marketing', a: 'el-mercado-la-segmentación-y-la-demanda', t: 'Mercado' },
  ] },
  { n: 5, apartado: 'Validación', enlaces: [{ u: 'ut2-iniciativa-emprendedora', a: 'diseño-centrado-en-las-personas-y-validación-ágil', t: 'Entrevistas y PMV' }] },
  { n: 6, apartado: 'Modelo de negocio', enlaces: [{ u: 'ut2-iniciativa-emprendedora', a: 'propuesta-de-valor-y-modelo-de-negocio', t: 'Canvas' }] },
  { n: 7, apartado: 'Plan comercial y comunicación', enlaces: [
    { u: 'ut3-mercado-marketing', a: 'marketing-mix-y-marketing-online', t: 'Marketing mix' },
    { u: 'ut3-mercado-marketing', a: 'el-plan-de-marketing-y-el-estudio-de-mercado', t: 'Plan de marketing' },
  ] },
  { n: 8, apartado: 'Operaciones y personas', enlaces: [{ u: 'ut1-empresa-entorno', a: 'la-empresa-como-sistema', t: 'Subsistemas' }] },
  { n: 9, apartado: 'Sostenibilidad e impacto en Canarias', enlaces: [
    { u: 'ut1-empresa-entorno', a: 'responsabilidad-social-balance-social-y-ética', t: 'RSE y balance social' },
    { u: 'ut2-iniciativa-emprendedora', a: 'ética-economía-social-y-economía-circular', t: 'Indicadores de impacto' },
  ] },
  { n: 10, apartado: 'Forma jurídica, trámites y REF', enlaces: [
    { u: 'ut1-empresa-entorno', a: 'clasificar-una-empresa-y-el-ref-canario', t: 'REF' },
    { u: 'ut2-iniciativa-emprendedora', a: 'elegir-forma-jurídica-primera-aproximación', t: 'Forma jurídica' },
  ], nota: 'Los trámites, en la UT5' },
  { n: 11, apartado: 'Plan económico y financiero', enlaces: [
    { u: 'ut4-viabilidad-financiacion', a: 'el-plan-de-inversiones', t: 'Inversiones' },
    { u: 'ut4-viabilidad-financiacion', a: 'fuentes-de-financiación-propias-y-ajenas', t: 'Financiación' },
    { u: 'ut4-viabilidad-financiacion', a: 'previsión-de-resultados-y-tesorería', t: 'Resultados y tesorería' },
    { u: 'ut4-viabilidad-financiacion', a: 'el-umbral-de-rentabilidad-y-los-escenarios', t: 'Umbral' },
  ] },
  { n: 12, apartado: 'Riesgos y decisión de viabilidad', enlaces: [{ u: 'ut4-viabilidad-financiacion', a: 'el-umbral-de-rentabilidad-y-los-escenarios', t: 'Escenarios' }] },
  { n: 13, apartado: 'Calendario de puesta en marcha', enlaces: [], nota: 'En la UT5' },
  { n: 15, apartado: 'Presentación y defensa', enlaces: [{ u: 'ut3-mercado-marketing', a: 'el-plan-de-marketing-y-el-estudio-de-mercado', t: 'Pitch de 90 segundos' }] },
];
