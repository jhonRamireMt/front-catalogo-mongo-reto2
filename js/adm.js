let usuarioAutenticado = sessionStorage.getItem("NOMBRE");
const contenedor = document.querySelector("tbody");
const modalUsuarios = new bootstrap.Modal(
  document.getElementById("modal-usuario")
);
const modalEdit = new bootstrap.Modal(document.getElementById("modal-edit"));
const fromulario = document.getElementById("form-usuarios");
let nombre = document.getElementById("registroNombre");
let identificacion = document.getElementById("registroNumeroIdentificacion");
let direccion = document.getElementById("registroDireccion");
let telefono = document.getElementById("registroTelefono");
let email = document.getElementById("registroEmail");
let password = document.getElementById("registroPassword1");
let zona = document.getElementById("registroZona");
let rol = document.getElementById("registroRol");
let opcion = "";
let resultados = "";

//mostrar elelemtos en la tabla
const mostrar = (usuarios) => {
  usuarios.forEach((user) => {
    resultados += `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.identification}</td>
                    <td>${user.address}</td>
                    <td>${user.cellPhone}</td>
                    <td>${user.zone}</td>
                    <td>${user.type}</td>
                    <td class="text-center"><a class="btnBorrar btn btn-danger">borrar</a></td>
                    <td class="text-center"><a class="btnEditar btn btn-primary">editar</a></td>
                </tr>
            `;
  });
  contenedor.innerHTML = resultados;
};

// metodo on de jquery
const on = (element, event, selector, handler) => {
  element.addEventListener(event, (e) => {
    if (e.target.closest(selector)) {
      handler(e);
    }
  });
};

// metodo para borrar un usuario
on(document, "click", ".btnBorrar", (e) => {
  const fila = e.target.parentNode.parentNode;
  const id = fila.firstElementChild.innerHTML;
  console.log(id);

  alertify.confirm(
    "Se eliminara el usuario seleccionado. Desea continuar?",
    function () {
      borrarElemento(id);
      alertify.success("Operacion compaletada!");
    },
    function () {
      alertify.error("Operacion cancelada.");
    }
  );
});

//metodo para editar usuario
let idForm = 0;
let emailForm = "";
on(document, "click", ".btnEditar", (e) => {
  const fila = e.target.parentNode.parentNode;
  idForm = fila.children[0].innerHTML;
  const nameForm = fila.children[1].innerHTML;
  emailForm = fila.children[2].innerHTML;
  const identityForm = fila.children[3].innerHTML;
  const dirForm = fila.children[4].innerHTML;
  const telForm = fila.children[5].innerHTML;
  const zoneForm = fila.children[6].innerHTML;
  const rolForm = fila.children[7].innerHTML;

  editNombre.value = nameForm;
  editNumeroId.value = identityForm;
  editDir.value = dirForm;
  editTel.value = telForm;
  editZona.value = zoneForm;
  editRol.value = rolForm;
  opcion = "editar";
  modalEdit.show();
  console.log(idForm);
});

// boton crear nuevos usuarios y limpiar campos
btnCrear.addEventListener("click", () => {
  nombre.value = "";
  identificacion.value = "";
  direccion.value = "";
  telefono.value = "";
  email.value = "";
  password.value = "";
  zona.value = "";
  rol.value = "";
  modalUsuarios.show();
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
function getUsers() {
  $.ajax({
    url: "http://144.22.57.2:8082/api/user/all",
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
    "Se cerrara la sesion actual. Desea continuar?",
    function () {
      alertify.success("Operacion compaletada!");
      sessionStorage.removeItem("NOMBRE");
      location.reload();
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

//borrar un usuario
function borrarElemento(id) {
  $.ajax({
    url: "http://144.22.57.2:8082/api/user/" + id,
    type: "DELETE",
    dataType: "json",
    contentType: "application/json",
    success: function () {
      alertify.success("Usuario borrado correctamante!");
      function retrasarCarga() {
        location.reload();
      }
      setTimeout(retrasarCarga, 2000);
    },
  });
}

//registrar un usuario
function setRegistro(e) {
  const d = document;
  d.addEventListener("submit", (e) => {
    e.preventDefault();
    if ($("#registroPassword1").val() == $("#registroPassword2").val()) {
      $("#error").empty();
      $("#ok").empty();
      $("#ok").append("Perfecto: Las contraseñas coinciden");
      $("#ok").empty();
      $("#ok").append("Contraseñas son Identicas");
      let email = $("#registroEmail").val();
      $.ajax({
        dataType: "json",
        typ: "GET",
        url: "http://144.22.57.2:8082/api/user/emailexist/" + email,
        success: function (respuesta) {
          if (respuesta == true) {
            $("#error-email").empty();
            $("#error-email").append(
              "Uppss!. Ya existe una cuenta registrada a este email. Por favor intenta con un email diferente"
            );
          } else {
            let myData = {
              identification: $("#registroNumeroIdentificacion").val(),
              name: $("#registroNombre").val(),
              address: $("#registroDireccion").val(),
              cellPhone: $("#registroTelefono").val(),
              email: $("#registroEmail").val(),
              password: $("#registro-password-1").val(),
              zone: $("#registroZona").val(),
              type: $("#registroRol").val(),
            };
            let dataToSend = JSON.stringify(myData);
            $.ajax({
              url: "http://144.22.57.2:8082/api/user/new",
              type: "POST",
              contentType: "application/json",
              dataType: "json",
              data: dataToSend,
              success: function () {
                alertify.success("Usuario creado correctamante!");
                modalUsuarios.hide();
                function retrasarCarga() {
                    location.reload();
                  }
                  setTimeout(retrasarCarga, 2000);
              },
            });
          }
        },
      });
    } else {
      $("#ok").empty();
      $("#error").empty();
      $("#error").append("ERROR: Las contraseñas no coinciden");
    }
  });
}

//registrar un usuario
function editarRegistro(e) {
  const d = document;
  d.addEventListener("submit", (e) => {
    e.preventDefault();
    if ($("#editPassword1").val() == $("#editPassword2").val()) {
      let myData = {
        id: idForm,
        identification: $("#editNumeroId").val(),
        name: $("#editNombre").val(),
        address: $("#editDir").val(),
        cellPhone: $("#editTel").val(),
        email: emailForm,
        password: $("#editPassword1").val(),
        zone: $("#editZona").val(),
        type: $("#editRol").val(),
      };
      console.log(myData);
      let dataToSend = JSON.stringify(myData);
      $.ajax({
        url: "http://144.22.57.2:8082/api/user/update",
        type: "PUT",
        contentType: "application/json",
        dataType: "json",
        data: dataToSend,
        success: function () {     
          alertify.success("Datos actualizados !!");
          modalEdit.hide();
          function retrasarCarga() {
            location.reload();
          }
          setTimeout(retrasarCarga, 2000);
        },
      });
    }
  });
}
