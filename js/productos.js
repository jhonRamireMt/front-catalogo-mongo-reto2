let usuarioAutenticado = sessionStorage.getItem("NOMBRE");
const contenedor = document.querySelector("tbody");
const modalProducto = new bootstrap.Modal(
  document.getElementById("modalProducto")
);
const modalEdit = new bootstrap.Modal(document.getElementById("modalEditProducto"));
//const fromulario = document.getElementById("form-usuarios");
let referencia = document.getElementById("crearReferencia");
let marca = document.getElementById("crearMarca");
let categoria = document.getElementById("crearCategoria");
let materiales = document.getElementById("crearMateriales");
let dimensiones = document.getElementById("crearDimensiones");
let descripcion = document.getElementById("crearDescripcion");
let disponibilidad = document.getElementById("crearDisponibilidad");
let precio = document.getElementById("crearPrecio");
let cantidad = document.getElementById("crearCantidad");
let opcion = "";
let resultados = "";

//mostrar elelemtos en la tabla
const mostrar = (producto) => {
    producto.forEach((item) => {
    resultados += `
                <tr>
                    <td>${item.reference}</td>
                    <td>${item.brand}</td>
                    <td>${item.category}</td>
                    <td>${item.materiales}</td>
                    <td>${item.dimensiones}</td>
                    <td>${item.description}</td>
                    <td>${item.availability}</td>
                    <td>${item.price}</td>
                    <td>${item.quantity}</td>
                    <td class="text-center"><a class="btnBorrar btn btn-danger">borrar</a></td>
                    <td class="text-center"><a class="btnEditar btn btn-primary">editar</a></td>
                </tr>
            `;
  });
  contenedor.innerHTML = resultados;
};

// metodo on de jquery - mapea la fila
const on = (element, event, selector, handler) => {
  element.addEventListener(event, (e) => {
    if (e.target.closest(selector)) {
      handler(e);
    }
  });
};

// metodo para borrar un producto
on(document, "click", ".btnBorrar", (e) => {
  const fila = e.target.parentNode.parentNode;
  const id = fila.firstElementChild.innerHTML;
  console.log(id);

  alertify.confirm(
    "Se eliminara el usuario seleccionado. Desea continuar?",
    function () {
      borrarElemento(id)
      alertify.success("Operacion compaletada!");
    },
    function () {
      alertify.error("Operacion cancelada.");
    }
  );
});

//metodo para editar usuario
let referenciaForm = 0;
on(document, "click", ".btnEditar", (e) => {
  const fila = e.target.parentNode.parentNode;
  referenciaForm = fila.children[0].innerHTML;
  const marcaForm = fila.children[1].innerHTML;
  const categoriaForm = fila.children[2].innerHTML;
  const materialesForm = fila.children[3].innerHTML;
  const dimensionesForm = fila.children[4].innerHTML;
  const descripcionForm = fila.children[5].innerHTML;
  const disponibilidadForm = fila.children[6].innerHTML;
  const precioForm = fila.children[7].innerHTML;
  const cantidadForm = fila.children[8].innerHTML;
 
  editReferencia.value = referenciaForm
  editarMarca.value = marcaForm
  editarCategoria.value = categoriaForm
  editMateriales.value = materialesForm
  editDimensiones.value = dimensionesForm
  editDescripcion.value = descripcionForm
  editarDisponibilidad.value = disponibilidadForm
  editPrecio.value = precioForm
  editCantidad.value = cantidadForm
  opcion = "editar";
  modalEdit.show();
  console.log(editReferencia.value );
  console.log(editarMarca.value);
  console.log(editarCategoria.value);
  console.log(editMateriales.value);
  console.log(editDimensiones.value);
  console.log(editDescripcion.value);
  console.log(editarDisponibilidad.value);
  console.log(editPrecio.value);
  console.log(editCantidad.value);
});

// boton crear nuevos usuarios y limpiar campos
btnCrear.addEventListener("click", () => {
  referencia.value = "";
  marca.value = "";
  categoria.value = "";
  materiales.value = "";
  dimensiones.value = "";
  descripcion.value = "";
  disponibilidad.value = "";
  precio.value = "";
  cantidad.value = "";
  modalProducto.show();
  opcion = "crear";
});

// validacion de cargue de pagina - solo permite rol ADM
if (usuarioAutenticado != null) {
  admin(usuarioAutenticado);
} else {
  window.location.href = "./index.html";
}

function admin(a) {
  console.log(a);
  obtenerUsuario(a);
}

// peticion ajax que trae los usuarios
function getProductos() {
  $.ajax({
    url: "http://144.22.57.2:8082/api/cookware/all",
    type: "GET",
    dataType: "json",
    success: function (json) {
      mostrar(json);
    },
  });
}

// cerrar sesion del usuario
function cerrarSesion() {
  alertify.confirm(
    "Se terminara la sesion actual. Desea continuar?",
    function () {
      sessionStorage.removeItem("NOMBRE");
      alertify.success("Vuelve pronto!");
      retardar();
    },
    function () {
      alertify.error("Operacion cancelada.");
    }
  );
}

//mostrar usuarios en el header
function obtenerUsuario(b) {
  $("#nombreUser").html(sessionStorage.getItem("NOMBRE"));
  $("#rolUser").html(sessionStorage.getItem("ROL"));
  $("#sesionRol").html(sessionStorage.getItem("ROL"));
  $("#sesionZona").html(sessionStorage.getItem("ZONA"));
  $("#sesionTel").html(sessionStorage.getItem("TELEFONO"));
  $("#sesionDir").html(sessionStorage.getItem("DIRECCION"));
  $("#sesionCorreo").html(sessionStorage.getItem("CORREO"));
  $("#sesionNombre").html(sessionStorage.getItem("NOMBRE"));
  let nombre = document.getElementById("NOMBRE");
  
}

//borrar un producto
function borrarElemento(id) {
  $.ajax({
    url: "http://144.22.57.2:8082/api/cookware/" + id,
    type: "DELETE",
    dataType: "json",
    contentType: "application/json",
    success: function () {
      alertify.success("Producto borrado correctamante!");
      retardar();
    },
  });
}

//registrar un usuario
function crearProducto(e) {
  const d = document;
  d.addEventListener("submit", (e) => {
    e.preventDefault();
    let data={
        reference: d.getElementById("crearReferencia").value,
        brand: d.getElementById("crearMarca").value,
        category: d.getElementById("crearCategoria").value,
        materiales: d.getElementById("crearMateriales").value,
        dimensiones: d.getElementById("crearDimensiones").value,
        description: d.getElementById("crearDescripcion").value,
        availability: d.getElementById("crearDisponibilidad").value,
        price: d.getElementById("crearPrecio").value,
        quantity: d.getElementById("crearCantidad").value,
    }
    let dataToSend = JSON.stringify(data);
    $.ajax({
        url: "http://144.22.57.2:8082/api/cookware/new",
        type:"POST",
        contentType: "application/json",
        data: dataToSend,
        success: function (){
            modalProducto.hide();
            alertify.success("Producto creado correctamante !!")
            retardar()
        }
    }); 
  });
}

//registrar un usuario
function editarProducto(e) {
  const d = document;
  d.addEventListener("submit", (e) => {
    e.preventDefault();
    let data={
        reference: referenciaForm,
        brand: d.getElementById("editarMarca").value,
        category: d.getElementById("editarCategoria").value,
        materiales: d.getElementById("editMateriales").value,
        dimensiones: d.getElementById("editDimensiones").value,
        description: d.getElementById("editDescripcion").value,
        availability: d.getElementById("editarDisponibilidad").value,
        price: d.getElementById("editPrecio").value,
        quantity: d.getElementById("editCantidad").value,
    }
       let dataToSend = JSON.stringify(data);
    $.ajax({
        url: "http://144.22.57.2:8082/api/cookware/update",
        type:"PUT",
        contentType: "application/json",
        data: dataToSend,
        success: function (){
            modalEdit.hide();
            alertify.success("Producto Actualizado correctamente !!")
            retardar()
        }
    }); 
  });
}
// funcion para retardar el cargado de la pagina
function retardar(){
    function retrasarCarga() {
        location.reload();
      }
      setTimeout(retrasarCarga, 2000);
}

