import type { Producto } from "./producto"
import type { Venta } from "./venta"

export interface DetalleVenta {
  id: number

  idVenta:number

  idProducto:number

  cantidad:number

  precioUnitario:number

  descuento:number

  subtotal:number

  venta: Venta

  producto: Producto
}

