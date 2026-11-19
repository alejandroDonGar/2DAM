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
  { nombre: 'Spring', detalle: 'En curso' },
];

export const REPO_AD = 'https://github.com/alejandroDonGar/Acceso-a-Datos-2026---2027/';
