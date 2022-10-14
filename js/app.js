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

        if(window.indexedDB.open('crm', 1)){
            obtenerClientes();
        }

    });

    // Crea la base de datos
    function crearDB(){
        const crearDB = window.indexedDB.open('crm', 1);
        
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

    function obtenerClientes(){
        let abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function(){
            console.log('Hubo un error');
        };

        abrirConexion.onsuccess = function(){
            // Guardamos el resultado
            DB = abrirConexion.result;
            
            const objectStore = DB.transaction('crm').objectStore('crm');
        
        
            // Retorna un objeto request o petición
            objectStore.openCursor().onsuccess = function(e){
                // cursor se va a ubicar en el registro indicado para acceder a los datos
                const cursor = e.target.result;
    
                if(cursor){
                    const { nombre, empresa, email, telefono, id } = cursor.value;
    
                    // Crear el listado
                    const listadoClientes = document.querySelector('#listado-clientes');
    
                    const row = document.createElement('tr');
    
                    row.innerHTML = `
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-sm leading-5 font-medium text-gray-700 text-lg font-bold"> ${nombre} </p>
                            <p class="text-sm leading-10 text-gray-700">${email} </p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                            <p class="text-gray-700">${telefono}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">${empresa}</td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                            <a href="editarcliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                            <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900">Eliminar</a>
                        </td>
                    `;
    
                    listadoClientes.appendChild(row);
    
                    // Sigue el cursor
                    cursor.continue();
                } else {
                    console.log('No hay más registros');
                }
            };

        }
    }

})();