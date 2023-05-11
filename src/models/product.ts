// Para los productos 
// deberá almacenar: nombre, descripción, precio, categoría (enumerado con diferentes opciones: deporte, videojuegos, etc.) 
// y usuarios que han comprado el producto. Trate de indicar en el esquema correspondiente los tipos de datos y validadores 
// adecuados.

import { Document, Schema, model } from 'mongoose';
// import validator from 'validator';
import { Preference } from './types.js';
import { UserDocumentInterface } from "./user.js"


export interface ProductDocumentInterface extends Document {
  name: string;
  descripcion: string;
  precio: number;
  categoria: Preference;
  usuarios: UserDocumentInterface[];
}

const ProductSchema = new Schema<ProductDocumentInterface>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
  },
  precio: {
    type: Number,
    required: true,
  },
  categoria: {
    type: String,
    enum: Object.values(Preference),
  },
  usuarios: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
});

export const Product = model<ProductDocumentInterface>('Product', ProductSchema);