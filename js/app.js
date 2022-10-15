// IIFE: Expresión de función ejecutada inmediatamente
// Es un patrón de diseño también conocido como función autoejecutable
// o sólo función autoinvocada: 
// las variables y las funciones declaradas dentro de ella no son accesibles desde fuera
// Van a ser locales del contexto de la función.
// si hay una variable cliente, no se va a pisar con la variable cliente que se declara dentro de la función
(function() {
    
    let DB;
    const listadoClientes = document.querySelector('#listado-clientes');
    
    document.addEventListener('DOMContentLoaded', () => {
        crearDB();
    
        if(window.indexedDB.open('crm', 1)) {
            obtenerClientes();
        } 

        listadoClientes.addEventListener('click', eliminarRegistro);
    });

    function eliminarRegistro(e) {
        if(e.target.classList.contains('eliminar')) {
            const idEliminar = Number(e.target.dataset.cliente);
            const confirmar = confirm('¿Deseas eliminar este cliente?');
    
            if(confirmar) {
                const transaction = DB.transaction(['crm'], 'readwrite');
                const objectStore = transaction.objectStore('crm');
                objectStore.delete(idEliminar);
                
                transaction.oncomplete = function() {
                    console.log('Eliminado');
                    e.target.parentElement.parentElement.remove();
                }
                
                transaction.onerror = function() {
                    console.log('Hubo un error');
                }
            }
        }
    }

    // Código de IndexedDB
    function crearDB() {
        // Crea la base de datos con la versión 1
        const crearDB = window.indexedDB.open('crm', 1);
        // Si hay un error, lo lanza
        crearDB.onerror = function() {
            console.log('Hubo un error');
        };
        // Si todo esta bien, asigna a database el resultado
        crearDB.onsuccess = function() {
            // Se guarda el resultado
            DB = crearDB.result;
        };
        // Este método solo corre una vez
        crearDB.onupgradeneeded = function(e) {
            // el evento que se va a correr, toma la base de datos
            const db = e.target.result;
            
            // Definir el objectstore, primer parametro el nombre de la BD, segundo las opciones
            // keypath es de donde se van a obtener los indices
            const objectStore = db.createObjectStore('crm', { keyPath: 'id',  autoIncrement: true } );
    
            //createindex, nombre y keypath, 3ro los parametros
            objectStore.createIndex('nombre', 'nombre', { unique: false } );
            objectStore.createIndex('email', 'email', { unique: true } );
            objectStore.createIndex('telefono', 'telefono', { unique: false } );
            objectStore.createIndex('empresa', 'empresa', { unique: false } );
            objectStore.createIndex('id', 'id', { unique: true } );
      
            console.log('Database creada y lista');
        };    
    }

    function obtenerClientes() {

        let abrirConexion = window.indexedDB.open('crm', 1);

        // Si hay un error, lo muestra
        abrirConexion.onerror = function() {
            console.log('Hubo un error');
        };
    
        // Si todo esta bien, asigna a database el resultado
        abrirConexion.onsuccess = function() {
            // Se guarda el resultado
            DB = abrirConexion.result;

            const objectStore = DB.transaction('crm').objectStore('crm');

            // retorna un objeto request o petición, 
            objectStore.openCursor().onsuccess = function(e) {
                 // cursor se va a ubicar en el registro indicado para acceder a los datos
                 const cursor = e.target.result;

                //  console.log(e.target);
     
                 if(cursor) {
                    const { nombre, empresa, email, telefono, id } = cursor.value;
                    
                    listadoClientes.innerHTML += `
                        <tr>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                                <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                                <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                                <p class="text-gray-700">${telefono}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                                <p class="text-gray-600">${empresa}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                                <a href="editar-cliente.html?id=${id}" class="text-teal-700 hover:text-teal-900 mr-5">Editar</a>
                                <a href="#" data-cliente="${id}" class="text-red-700 hover:text-red-900 eliminar">Eliminar</a>
                            </td>
                        </tr>
                    `;
        
                    cursor.continue();
                 } else {
                     console.log('No hay más registros');
                 }
             };
        };
    }
})();