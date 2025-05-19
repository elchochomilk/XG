const container = document.getElementById('carrito-container');
const totalElement = document.getElementById('total');
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

function mostrarCarrito() {
  container.innerHTML = '';
  let total = 0;

  if (carrito.length === 0) {
    container.innerHTML = '<p>Tu carrito está vacío.</p>';
    totalElement.textContent = 'Total: $0.00';
    return;
  }

  carrito.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'carrito-item';
    div.innerHTML = `
      <div class="info">
        <strong>${item.nombre}</strong><br>
        Cantidad: ${item.cantidad}<br>
        Precio unitario: $${item.precio.toFixed(2)}<br>
        Subtotal: $${(item.precio * item.cantidad).toFixed(2)}
      </div>
      <button onclick="eliminarProducto(${index})">❌</button>
    `;
    container.appendChild(div);
    total += item.precio * item.cantidad;
  });

  totalElement.textContent = `Total: $${total.toFixed(2)}`;
}

function eliminarProducto(index) {
  carrito.splice(index, 1);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  mostrarCarrito();
}

mostrarCarrito();

document.getElementById('pagar').addEventListener('click', () => {
  if (carrito.length === 0) {
    alert('Tu carrito está vacío.');
    return;
  }
  document.getElementById('pago-formulario').style.display = 'block';
});

document.getElementById('formPago').addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre-completo').value.trim();
  const tarjeta = document.getElementById('numero-tarjeta').value.replace(/\s/g, '');
  const vencimiento = document.getElementById('fecha-vencimiento').value.trim();
  const cvv = document.getElementById('cvv').value.trim();

  if (nombre.length < 3) {
    alert('Nombre demasiado corto.');
    return;
  }

  if (!/^\d{16}$/.test(tarjeta)) {
    alert('Número de tarjeta inválido.');
    return;
  }

  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(vencimiento)) {
    alert('Formato de fecha inválido.');
    return;
  }

  if (!/^\d{3,4}$/.test(cvv)) {
    alert('CVV inválido.');
    return;
  }

  alert(`¡Gracias por tu compra, ${nombre}!`);
  localStorage.removeItem('carrito');
  carrito = [];
  mostrarCarrito();
  document.getElementById('formPago').reset();
  document.getElementById('pago-formulario').style.display = 'none';
});

// Formatear inputs
document.getElementById('numero-tarjeta').addEventListener('input', (e) => {
  let value = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
  e.target.value = value.slice(0, 19);
});

document.getElementById('fecha-vencimiento').addEventListener('input', (e) => {
  let value = e.target.value.replace(/[^\d]/g, '');
  if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2, 4);
  e.target.value = value.slice(0, 5);
});
