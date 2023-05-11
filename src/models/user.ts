import { Document, Schema, model } from 'mongoose';
import validator from 'validator';
import { Preference } from './types.js';


// La información a almacenar para un usuario será: nombre, correo electrónico, nombre de usuario (único), 
// preferencia de compras (enumerado con diferentes opciones: deporte, videojuegos, etc.). 

export interface UserDocumentInterface extends Document {
  name: string;
  email: string;
  username: string;
  preference: Preference;
}

const UserSchema = new Schema<UserDocumentInterface>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value: string) {
      if (!validator.default.isEmail(value)) {
        throw new Error('La dirección de correo electrónico no es válida');
      }
    }
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  preference: {
    type: String,
    enum: Object.values(Preference),
  }
});

export const User = model<UserDocumentInterface>('User', UserSchema);
