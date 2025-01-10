//muestra los usuarios
function mostrarUsuarios(usuarios){
    const listaUsuarios = document.getElementById('lista-usuarios');
    listaUsuarios.innerHTML = '';
    usuarios.forEach(usuario=>{
        const div = document.createElement('div');
        div.className='usuario';
        div.innerHTML=`
            <h3>${usuario.nombre}</h3>
            <p>Edad: ${usuario.edad}</p>
            <p>ID: ${usuario.id}</p>
        `;
        listaUsuarios.appendChild(div);
    });
}

//obtiene los usuarios al cargar la página
function obtenerTodosLosUsuarios(){
    fetch('/api/usuarios')
        .then(response =>response.json())
        .then(usuarios=>mostrarUsuarios(usuarios))
        .catch(error=>console.error('Error al obtener usuarios:', error));
}

//busca un usuario 
document.getElementById('boton-buscar').addEventListener('click', ()=>{
    const query = document.getElementById('buscarInput').value.trim();
    if (!query){
        alert('Por favor, ingresa un nombre o ID para buscar.');
        return;
    }
    fetch(`/api/usuarios/${query}`)
        .then(response=>{
            if (!response.ok) throw new Error('Usuario no encontrado');
            return response.json();
        })
        .then(usuarios=>mostrarUsuarios(usuarios))
        .catch(error=>alert(error.message));
});

//crea un usuario
document.getElementById('formulario-crear').addEventListener('submit', e=>{
    e.preventDefault();
    const nombre=document.getElementById('nombreInput').value.trim();
    const edad=document.getElementById('edadInput').value.trim();

    if (!nombre || !edad){
        alert('Por favor, completa todos los campos.');
        return;
    }

    fetch('/api/usuarios',{
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ nombre, edad })
    })
        .then(response=>{
            if (!response.ok) throw new Error('Error al crear usuario');
            return response.json();
        })
        .then(()=>{
            alert('Usuario agregado exitosamente.');
            obtenerTodosLosUsuarios();
        })
        .catch(error=>alert(error.message));
});
obtenerTodosLosUsuarios();
