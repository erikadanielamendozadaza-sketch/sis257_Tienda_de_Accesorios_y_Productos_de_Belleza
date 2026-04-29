# sis257_Tienda_de_Accesorios_y_Productos_de_Belleza
Tienda de Accesorios y productos de belleza "Ze_Da Store"
Esta es una tienda que vende productos de belleza y accesorios, ofreciendo una amplia variedad de artículos como maquillaje, productos de cuidado facial (skincare), perfumes, cremas, así como accesorios como aretes, colleres, manillas y más.
Entidades finales:
1. UnidadMedida
Propósito: definir cómo se mide cada producto.

- id
  
- descripcion
  
Relación:
•	UnidadMedida puede aplicarse a muchos Productos (1–N)
 
2. Proveedor
Propósito: registrar los datos de quienes venden productos a la tienda.

id

nombreEmpresa

telefono

direccion

email

Relaciones:
•	Un Proveedor puede tener muchos Productos (1–N)
•	Un Proveedor puede realizar muchas Compras (1–N)

3. Producto
Propósito: almacenar toda la información de los productos que maneja la tienda.

id

idUnidadMedida

idProveedor 

idcategoria

idmarca

codigo

nombre

precioUnitario

stock

fechaVencimiento

precioCompra

cantidadMinimaStock

Relaciones:
•	Pertenece a una Unidad de Medida (N–1)
•	Pertenece a un Proveedor (N–1)
•	Participa en muchos DetallesVenta(N–N mediante esas tablas)

4. Empleado
Propósito: registrar al personal que trabaja en la tienda (vendedores, encargados, etc.)

id

nombres

primerApellido

segundoApellido

cedulaIdentidad

usuario

clave

telefono

Relaciones:
•	Puede registrar muchas Ventas(1–N)

5. Cliente
Propósito: registrar a los compradores frecuentes o que requieren facturación.

id

razonSocial

cedulaIdentidad

Relaciones:
•	Un cliente puede tener muchas Ventas (1–N)

6. Venta
Propósito: registrar la transacción de venta realizada al cliente.

Id

idCliente

idEmpleado

fecha

total

Relaciones:
•	Una Venta tiene muchos DetallesVenta (1–N)
•	Una Venta la realiza un Empleado
•	Una Venta pertenece a un Cliente

7. DetalleVenta
Propósito: registrar los productos vendidos dentro de cada venta.

id

idVenta 

idProducto

cantidad

precioUnitario

descuento

subtotal

Relaciones:
•	Pertenece a una Venta (N–1)
•	Se refiere a un Producto (N–1)

8.Marca
Propósito: identificar la marca del producto (Dapop, Italia Deluxe etc.)

id

nombre

Relaciones:
Una Marca puede tener muchos Productos (1–N)

9.Categoría
Propósito: clasificar los productos según su tipo (ej. perfumes, aretes, labiales).

id

nombre

Relaciones:
Una Categoría puede contener muchos Productos (1–N)
