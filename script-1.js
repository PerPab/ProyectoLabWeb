
let listaCarrito = document.getElementById('lista-productos-carrito'); // donde se renderizan los productos en el carro
let productos = [];  /*  por el momento los producto se guardan aca */
let listaProductosCarrito = []; /* la lista de productos en el carrito */
let listaCarritoStorage = [];


//--------------------------------------------------------------------------------//
//                                                                                //
//                               MOSTRAR TOSTADA                                  //
//                                                                                //
//--------------------------------------------------------------------------------//

function MostrarMensaje(mensaje) {
    try {
        Toastify({
            text: mensaje,
            duration: 1000,
            //destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            className: "tostada"
            //onClick: function () { } // Callback after click
        }).showToast();
    } catch (err) {
        console.error(err);
    }
}


//--------------------------------------------------------------------------------//
//                                                                                //
//                                 AGREGAR A CARRITO                              //
//                                                                                //
//--------------------------------------------------------------------------------//

/* clase del objeto con los detalles del producto */
class Producto {
    constructor(id, title, price, description, category, image, rating, cantidad) {
        this.id = id,
            this.title = title.replace("'", " "),
            this.price = price,
            this.description = description.replace("'", " "),
            this.category = category.replace("'", " "),
            this.image = image,
            this.rating = rating.rate
        this.cantidad = cantidad;
    }
}

function SincronizarLocalStorage() {
    try {
        localStorage.setItem('carrito', JSON.stringify(listaProductosCarrito));
    } catch (err) {
        console.error(err);
    }
}

function ValidarDuplicados(id) {
    try {
        let flag = listaProductosCarrito.some(pro => pro.id === id)
        return flag;
    } catch (err) {
        console.error(err);
    }
}

function AumentarCantidad(id) {
    listaProductosCarrito.forEach((prod) => {
        if (prod.id == id) {
            prod.cantidad++;
        }
    });
}

function GuardarProducto(id, title, price, description, category, image, rating) {
    try {
        listaProductosCarrito.push(new Producto(
            id = id,
            title = title,
            price = price,
            description = description,
            category = category,
            image = image,
            rating = rating,
            cantidad = 1)
        );
    } catch (err) {
        console.error(err);
    }
}

function ActualizarIconoCarrito() {
    try {
        if (listaProductosCarrito.length >= 0) {

            let arrayProductos = [...listaProductosCarrito];
            let total = 0;
            arrayProductos.forEach((prod) => total += prod.cantidad);
            let icono = document.getElementById('icono-cantidad')
            icono.innerText = total;
            icono.classList.remove('hide');

            if (listaProductosCarrito.length == 0) {
                //let icono = document.getElementById('icono-cantidad')
                icono.innerText = 0;
                icono.classList.add('hide');

            }
        }
    } catch (err) {
        console.error(err);
    }
}

/* funcion que crea un objeto del tipo Producto y lo inserta en una lista */
function BtnAgregarProducto(id, title, price, description, category, image, rating) {
    try {

        if (ValidarDuplicados(id) === false) {
            GuardarProducto(id, title, price, description, category, image, rating);

        } else if (ValidarDuplicados(id)) {
            AumentarCantidad(id);
        }
        MostrarMensaje("Producto agregado al carrito!"); /* despliega una tostada con un mensaje */
        SincronizarLocalStorage();
        ActualizarIconoCarrito();
    } catch (err) {
        console.log(err)
    }
}

//--------------------------------------------------------------------------------//
//                                                                                //
//                               FUNCIONES DEL CARRITO                            //
//                                                                                //
//--------------------------------------------------------------------------------//

function LimpiarCarrito() { // reemplaza la plantilla del carrito con un string vacio
    try {
        listaCarrito.innerHTML = ``;
    } catch (err) {
        console.error(err);
    }
}

/* Esta funcion evita duplicar los items del carrito */
let carrito = document.getElementById('offcanvasRight');
carrito.addEventListener('hidden.bs.offcanvas', function () {
    LimpiarCarrito();
    ActualizarIconoCarrito();
}
)

function EliminarProducto(id) {
    try {
        Swal.fire({
            title: "Desea eliminar este producto del carrito?",
            showCancelButton: true,
            confirmButtonText: "Ok"

        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                let indice = listaProductosCarrito.indexOf(listaProductosCarrito.find((prod) => prod.id == id))
                listaProductosCarrito.splice(indice, 1);
                LimpiarCarrito();
                SincronizarLocalStorage();
                RenderizarCarrito();
                CalcularTotal();
                if (listaProductosCarrito.length == 0) {
                    OcultarBotonComprar();
                }
                Swal.fire("Producto eliminado!", "", "success");
            }
        });

    } catch (err) {
        console.error(err)
    }
}


/* suma el total de los items en el carrito */
function CalcularTotal() {
    try {
        let arrayProductos = [...listaProductosCarrito];
        let total = document.getElementById('total');
        let inicio = 0;
        let sumaTotal = arrayProductos.reduce(
            (acumulador, valor) => acumulador + parseFloat(valor.price) * valor.cantidad, inicio
        );
        let TotalFormateado = sumaTotal.toFixed(2);
        total.innerHTML = `$${TotalFormateado}`;
    } catch (err) {
        console.error(err);
    }
}

/* plantilla para los productos cargados en el carrito */
function platillaProducto(producto) {
    try {

        let plantilla =
            `
                <div id="item-carrito" class="producto-carrito lista-productos d-flex flex-row justify-content-around mb-2">
                    <div class="item imagen-carrito">
                    <img class="img-carrito" src=${producto.image}>
                    <p class="pa pe-item precio-item">$${producto.price}</p>  
                    </div>
                    <div class="item texto-nombre"><p class="pa">${producto.title}</p></div>
                    <div class="container-precio-botones">
                        <div class="">   
                            <div class="container-btn-sumar-restar">
                                <button id="btn-restar"  class="btn-sumar-restar" onclick="Restar(${producto.id})"> <p class="btn-signo">-</p></button>
                                <p id="cantidad-item" class="cantidad"> ${producto.cantidad} </p> 
                                <button id="btn-sumar" onclick="Sumar(${producto.id})" class="btn-sumar-restar"> <p class="btn-signo">+</p></button>
                                <button id="btn-eliminar" onclick="EliminarProducto(${producto.id})" class="btn-sumar-restar btn-eliminar"> <p class="btn-signo"><img src="/recursos/img/remove-logo.png" alt="" width="30" height="24"
                                class="d-inline-block align-text-top"></button>
                            </div>
                        </div>
                </div>`

        return plantilla;
    } catch (err) {
        console.error(err);
    }
}

/* sumar y restar cantidad en el carrito*/
function Sumar(id) {
    try {
        listaProductosCarrito.forEach((prod) => {
            if (prod.id == id) {
                prod.cantidad++;
                LimpiarCarrito();
                SincronizarLocalStorage();
                RenderizarCarrito();
                CalcularTotal();
            }
        })
    } catch (err) {
        console.error(err);
    }
}

function Restar(id) {
    try {
        listaProductosCarrito.forEach((prod) => {
            if (prod.id == id) {
                if (prod.cantidad > 1) {
                    prod.cantidad--;
                    LimpiarCarrito();
                    SincronizarLocalStorage();
                    RenderizarCarrito();
                    CalcularTotal();
                    ActualizarIconoCarrito()
                }
            }
        })
    } catch (err) {
        console.error(err);
    }
}

/* cuando el carrito esta vacio se muestra este mensaje */
function platillaError() {
    try {
        let plantilla = `<div class="d-flex flex-column align-items-center justify-content-center m-2">
    <h4> No hay productos en el carro </h4>
    <img class="img-fluid" src="recursos/img/empty-cart-illustration.png"></img>
    </div>`
        return plantilla;
    } catch (err) {
        console.error(err);
    }
}

function MostrarCarroVacio() {
    let divError = document.createElement("div");
    divError.innerHTML = platillaError();
    listaCarrito.append(divError);
}

function OcultarBotonComprar() {
    document.getElementById('btn-contenedor-carro').classList.add('hide');
}

/* esta funcion inserta y renderiza cada prodcuto de la listaProductosCarrito en el canvas del carrito */
function RenderizarCarrito() {
    try {
        let arrayProductos = [...listaProductosCarrito];
        if (listaProductosCarrito.length > 0) {
            document.getElementById('btn-contenedor-carro').classList.remove('hide');
            arrayProductos.forEach((producto => {
                let div = document.createElement("div");
                div.innerHTML = platillaProducto(producto);
                listaCarrito.append(div);
            }));
            CalcularTotal();
        } else {
            MostrarCarroVacio()
        }
    } catch (err) {
        console.error(err);
    }
}

function ComprarCarrito() {
    try {
        Swal.fire({
            title: "Desea finalizar la compra?",
            showCancelButton: true,
            confirmButtonText: "Aceptar"
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                listaProductosCarrito = [];
                LimpiarCarrito();
                SincronizarLocalStorage();
                RenderizarCarrito();
                ActualizarIconoCarrito();
                OcultarBotonComprar();
                Swal.fire("Gracias por comprar!", "", "success");
            }
        });
    } catch (err) {
        console.error(err);
    }
}
//--------------------------------------------------------------------------------//
//                                                                                //
//                             CREAR PLANTILLA DE ITEM                            //
//                                                                                //
//--------------------------------------------------------------------------------//

function CrearTarjeta(item) {
    try {
        let cardPlantilla = `<div class="card-elemento">
<div class="card">
    <img src="${item.image}" class="img-fluid img" alt="Imagen no disponible">
    <div class="card-body">
        <h5 class="card-title">${item.title}</h5>
        <p class="card-text">Calificacion ${item.rating}</p>
        <p class="pe precio-item card-text">$${item.price}</p>
        <button  id="btn-carrito" onclick="CrearModal('${item.id}','${item.title}','${item.price}','${item.description}','${item.category}','${item.image}','${item.rating}')" data-bs-toggle="modal" data-bs-target="#staticBackdrop" class="boton-carrito btn btn-primary">Detalles</button>
    </div>
</div>
</div>`
        return cardPlantilla;
    } catch (err) {
        console.error(err);
    }
}

//--------------------------------------------------------------------------------//
//                                                                                //
//                                  CREAR MODAL                                   //
//                                                                                //
//--------------------------------------------------------------------------------//


/* en el modal se cargan los detalles de cada producto */
function CrearModal(id, title, price, description, category, image, rating) { // crear en html solo la cabeza del modal y el cuerpo renderizarlo dinamicamente
    try {
        document.getElementById('staticBackdropLabel').innerHTML = `<h4 class="titulo-modal">${title}</h4>`;
        document.getElementById('image-modal').innerHTML = `<img class="imagen-modal" src="${image}">`;
        document.getElementById('description-modal').innerHTML = `<h5 class="descripcion-modal">${description}</h5>`;
        document.getElementById('precio-modal').innerHTML = `<h4 class="descripcion-modal precio-modal">Precio: $${price}</h4>`;
        document.getElementById('btn-modal').innerHTML = `<button  type="button" class="btn btn-primary" data-bs-dismiss="modal" 
        onclick="BtnAgregarProducto('${id}', '${title}', '${price}', '${description}', '${category}', '${image}', '${rating}')"
        >Agregar al Carrito</button>`;

    } catch (err) {
        console.error(err);

    }
}

//--------------------------------------------------------------------------------//
//                                                                                //
//                             RENDERIZADO DE ITEMS                               //
//                                                                                //
//--------------------------------------------------------------------------------//

// Funcion para renderizar items en pantalla
function Renderizar(productos) {
    let listaElementos = document.getElementById('lista-elementos'); // donde se renderizan los productos en el main
    try {
        // aca tenemos que poner un if por si la lista esta vacia
        productos.forEach(item => {
            const div = document.createElement("div");
            div.innerHTML = CrearTarjeta(item);
            listaElementos.append(div);
        })
    } catch (err) {
        console.error(err);
    }
}

//--------------------------------------------------------------------------------//
//                                                                                //
//                              CONEXION A LA API                                 //
//                                                                                //
//--------------------------------------------------------------------------------//


/* esta funcion toma los productos desde la api y los guarda como objetos en una lista */
function GuardarProductosEnLista(data) {
    data.forEach(producto => {
        productos.push(new Producto(
            producto.id,
            producto.title,
            producto.price,
            producto.description,
            producto.category,
            producto.image,
            producto.rating,
            producto.cantidad)
        )
    })
};

/* conexion a la api */
function ConexionApi() {
    try {
        // URL base de la API
        const apiUrl = 'https://fakestoreapi.com';
        // Endpoint para obtener todos los productos
        const endpoint = '/products';
        // Función para obtener los productos de la API
        fetch(apiUrl + endpoint)
            .then(response => response.json())
            .then(data => {
                //Renderizar(data);
                GuardarProductosEnLista(data);
                console.log('Aplicacion conectada');
                Renderizar(productos);
            })
    } catch (err) {
        MostrarMensaje(err);
    }
}

//--------------------------------------------------------------------------------//
//                                                                                //
//                           INICIO DE LA APLICACION                              //
//                                                                                //
//--------------------------------------------------------------------------------//

function iniciarApp() {
    try {
        ConexionApi();

    } catch (err) {
        console.error(err);
    }
}

window.addEventListener('onload', iniciarApp());
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('carrito') != null) {
        listaProductosCarrito = JSON.parse(localStorage.getItem('carrito'));
        ActualizarIconoCarrito();
    }
})








