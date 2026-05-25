import type { Categoria } from './categoria'
import type { Marca } from './marca'
import type { Proveedor } from './proveedor'
import type { UnidadMedida } from './unidad_medida'

export interface Producto {
  id: number
  idCategoria: number
  idMarca: number
  idUnidadMedida: number
  idProveedor: number
  codigo: string
  nombre: string
  precioUnitario: number
  stock: number
  cantidadMinimaStock: number
  fechaVencimiento: Date
  imagen?: string
  categoria: Categoria
  marca: Marca
  unidadMedida: UnidadMedida
  proveedor: Proveedor
}
