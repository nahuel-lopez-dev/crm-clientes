// IIFE: Expresión de función ejecutada inmediatamente
(function(){
    let DB;
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', function(){
        conectarDB();
        formulario.addEventListener('submit', validarCliente);
    });

    // Conecta a la base de datos
    function conectarDB(){
        const abrirConexion = indexedDB.open('crm', 1);

        abrirConexion.onerror = function(){
            console.log('Hubo un error');
        };

        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;
        };
    }

    // Valida el formulario
    function validarCliente(e){
        e.preventDefault();

        // Leer todos los inputs
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if(nombre === '' || email === '' || telefono === '' || empresa === ''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }

        // Crear un objeto con la información
        const cliente = {
            nombre,
            email,
            telefono,
            empresa,
            id: Date.now()
        };
        // función para crear un nuevo cliente (la voy a tener que incorporar después)
        // función a desarrollar
        crearNuevoCliente(cliente);
    }
    // Función para imprimir el alerta
    function imprimirAlerta(mensaje, tipo){
        
        const alerta = document.querySelector('.alerta');
        if(!alerta){
            // Crear el div
            const divMensaje = document.createElement('div');
            divMensaje.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');
    
            if(tipo === 'error'){
                divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
            } else {
                divMensaje.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
            }
    
            // Mensaje de error
            divMensaje.textContent = mensaje;
    
            // Insertar en el HTML
            formulario.appendChild(divMensaje);
    
            setTimeout(() => {
                divMensaje.remove();
            }, 3000);
        }
    }
})();