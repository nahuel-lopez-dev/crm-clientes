// IIFE: Expresión de función ejecutada inmediatamente
// Es un patrón de diseño también conocido como función autoejecutable
// o sólo función autoinvocada: 
// las variables y las funciones declaradas dentro de ella no son accesibles desde fuera
// Van a ser locales del contexto de la función.
// si hay una variable cliente, no se va a pisar con la variable cliente que se declara dentro de la función
(function(){
    
    let DB;

    document.addEventListener('DOMContentLoaded', function(){
        crearDB();
    });

    // Crea la base de datos
    function crearDB(){
        const crearDB = indexedDB.open('crm', 1);
        
        crearDB.onerror = function(){
            console.log('Hubo un error');
        }

        crearDB.onsuccess = function(){
            DB = crearDB.result;
        };

        // Definir el schema
        // se ejecuta una única vez para crear la tabla
        crearDB.onupgradeneeded = function(e){
            const db = e.target.result;
            const objectStore = db.createObjectStore('crm', { keyPath: 'id', autoIncrement: true });
            // Crear los indices y campos de la base de datos
            objectStore.createIndex('nombre', 'nombre', {unique: false});
            objectStore.createIndex('email', 'email', {unique: true});
            objectStore.createIndex('telefono', 'telefono', {unique: false});
            objectStore.createIndex('empresa', 'empresa', {unique: false});
            objectStore.createIndex('id', 'id', {unique: true});

            console.log('DB creada y lista');
        }

    }

})();