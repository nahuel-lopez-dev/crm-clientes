(function(){

    let DB;

    document.addEventListener('DOMContentLoaded', ()=>{
        conectarDB();
        // verificar el ID de la URL
        const parametrosURL = new URLSearchParams(window.location.search);
        
        const idCliente = parametrosURL.get('id');
        
        if(idCliente){
            setTimeout(()=>{
                obtenerCliente(idCliente);
            }, 100);
        }

    })

    function obtenerCliente(id){

        const transaction = DB.transaction(['crm'], 'readwrite');
        
        const objectStore = transaction.objectStore('crm');

        // console.log(objectStore);

        const cliente = objectStore.openCursor();

        cliente.onsuccess = function(e){
            const cursor = e.target.result;

            if(cursor){
                if(cursor.value.id === Number(id)){
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }
        }
    }

    function conectarDB(){
        const abrirConexion = indexedDB.open('crm', 1);

        abrirConexion.onerror = function(){
            console.log('Hubo un error');
        };

        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;
        };
    }

    function llenarFormulario(datosCliente){
        const { nombre, email, telefono, empresa, id } = datosCliente;

        document.querySelector('#nombre').value = nombre;
        document.querySelector('#email').value = email;
        document.querySelector('#telefono').value = telefono;
        document.querySelector('#empresa').value = empresa;
        document.querySelector('#id').value = id;
    }

})();