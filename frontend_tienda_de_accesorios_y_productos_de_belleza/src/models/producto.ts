export interface Producto {
  id?: number
  codigo: string
  nombre: string
  precioUnitario: number
  stock: number
  fechaVencimiento: Date
  cantidadMinimaStock: number

  categoria?: { id: number; nombre: string }
  marca?: { id: number; nombre: string }
  unidadMedida?: { id: number; descripcion: string }
  proveedor?: { id: number; nombreEmpresa: string }
  imagen?: string
}
