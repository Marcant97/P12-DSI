import { Product } from '../models/product.js';
import { User } from '../models/user.js';

import express from 'express';

export const userRouter = express.Router();

//*Añadir un usuario
userRouter.post('/', async (req, res) => {
  const newUser = new User(req.body);
  try {
    await newUser.save();
    return res.status(201).send(newUser);
  } catch (error) {
    return res.status(400).send(error);
  }
});


//* Obtener usuarios por nombre
userRouter.get('/', async (req, res) => { 
  const filter = req.query.name?{name: req.query.name.toString()}:{};
  // si el name está en la query, filtramos por name, si no, devolvemos todo

  try {
    console.log(filter);
    const userToFind = await User.find(filter);
    if (userToFind.length !== 0) {
      return res.status(200).send(userToFind);
    }
    return res.status(400).send({error: "No se encontró un usuario con ese nombre en la base de datos"});
  } catch (error) {
    return res.status(400).send(error);
  }
});


//* Actualizar usuario
userRouter.patch('/', async (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({error: "Se debe añadir un nombre de usuario para poder actualizarlo"});
  }

  const allowedUpdates = ['name', 'email', 'username', 'preference'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({error: "Actualización no permitida"});
  }

  try {
    const userUpdated = await User.findOneAndUpdate({name: req.body.name.toString()}, req.body, {new: true, runValidators: true});
    if (userUpdated) {
      return res.status(200).send(userUpdated);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(400).send(error);  
  }
});



//* Borrar usuario
userRouter.delete('/', async (req, res) => {

  if (!req.query.name) {
    return res.status(400).send({error: "Se debe añadir un nombre de usuario para poder borrarlo"});
  }
  
  try {

    // ? ALMACENO EL ID DEL USUARIO A BORRAR
    const userDeletedID = await User.findOne({nombre: req.query.name.toString()}).select('id');
    
    //? BORRAMOS EL USUARIO
    console.log(req.query.name.toString());
    const userDeleted = await User.deleteOne({name: req.query.name.toString()});

    //? BORRAMOS EL USUARIO DE LOS PRODUCTOS
    const productos = await Product.find();
    productos.forEach(async (producto) => {
      producto.usuarios.forEach(async (usuario, index) => {
        if (userDeletedID !== null) {
          if (usuario.toString() === userDeletedID.id.toString()) {
            producto.usuarios.splice(index,1);
            await producto.save();
          }
        }
        else {
          return res.status(400).send({error: "No se encontró un producto con este usuario en la base de datos"});
        }
      });
    });

    if (!userDeleted.acknowledged) {
      return res.status(500).send({error: "No se pudo borrar el producto, no existe en la base de datos"});
    }
    return res.status(200).send(userDeleted);
  } catch (error) {
    return res.status(400).send(error);
  }

});