

function logIn(e){
   e.preventDefault();
    if($("#login-email").val() == "" || $("#login-password").val() == ""){
        alert("Todos los campos son obligatorios");
    }else{
        let email = $("#login-email").val()
        let password = $("#login-password").val()  
        $.ajax({
            dataType:"json",
            typ:"GET",
            url: "http://144.22.57.2:8082/api/user/"+email+"/"+password,
            success:function(json){
                if(json.id == null || json.name == null){
                    $("#inicio-fail").empty();
                    $("#inicio-ok").empty();
                    $("#inicio-fail").append("Error al iniciar sesion: usuario o contraseña incorrecto");
                }else{
                    $("#inicio-fail").empty();
                    $("#inicio-ok").empty();
                    $("#inicio-ok").append(json.name + " ha iniciado sesion")
                    alert("Bienvenido al sistema " + json.name)
                    console.log("enviando.."+json)
                    
                    if(json.type == "ADM"){
                        sessionStorage.setItem("ROL",json.type);
                        sessionStorage.setItem("ZONA",json.zone);
                        sessionStorage.setItem("DIRECCION",json.address);
                        sessionStorage.setItem("TELEFONO",json.cellPhone);
                        sessionStorage.setItem("CORREO",json.email);
                        sessionStorage.setItem("NOMBRE",json.name);
                        window.location="./admin.html"; 
                        alertify.success(json.name + " ha iniciado sesion");
                        
                    }if(json.type == "COORD"){
                        window.location="./cordinadores.html";
                    }if(json.type == "ASC"){
                        window.location="./asesores.html";
                    }
                    
                }    
            }
        }) 
    }
}



