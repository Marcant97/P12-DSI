import { User } from '../models/user.js';
import { Product } from '../models/product.js';

import express from 'express';

export const productRouter = express.Router();


//*Añadir un Producto
productRouter.post('/', async (req, res) => {
  const newProduct = new Product(req.body);
  try {

    // comprobar que los usuarios existen en la base de datos primero
    if (req.body.usuarios) {
      //iterar sobre el array de amigos
      while (req.body.usuarios.length) {
        //sacar el primer elemento del array
        const usuario_aux = req.body.usuarios.shift();
        //buscar en la bbdd de usuarios ese id
        const user = await User.findById(usuario_aux);
        //si no existe, devolver error
        if (!user) {
          return res.status(400).send({error: "Alguno de los usuarios no existe"});
        }
      }
    }
    await newProduct.save();
    return res.status(201).send(newProduct);
  } catch (error) {
    return res.status(400).send(error);
  }
});

//* Obtener un producto por nombre
productRouter.get('/', async (req, res) => { 
  const filter = req.query.name?{name: req.query.name.toString()}:{};
  // si el name está en la query, filtramos por name, si no, devolvemos todo

  try {
    console.log(filter);
    const productToFind = await Product.find(filter);
    if (productToFind.length !== 0) {
      return res.status(200).send(productToFind);
    }
    return res.status(400).send({error: "No se encontró un producto con ese nombre en la base de datos"});
  } catch (error) {
    return res.status(400).send(error);
  }
});


//* Actualizar Producto
productRouter.patch('/', async (req, res) => {
  if (!req.body.name) {
    return res.status(400).send({error: "Se debe añadir un nombre de producto para poder actualizarlo"});
  }

  const allowedUpdates = ['name', 'descripcion', 'precio', 'categoria', 'usuarios'];
  const actualUpdates = Object.keys(req.body);
  const isValidUpdate = actualUpdates.every((update) => allowedUpdates.includes(update));

  if (!isValidUpdate) {
    return res.status(400).send({error: "Actualización no permitida"});
  }

  try {
    const productUpdated = await Product.findOneAndUpdate({name: req.body.name.toString()}, req.body, {new: true, runValidators: true});
    if (productUpdated) {
      return res.status(200).send(productUpdated);
    }
    return res.status(404).send();
  } catch (error) {
    return res.status(400).send(error);  
  }
});


//* Borrar producto
productRouter.delete('/', async (req, res) => {
  

  if (!req.query.name) {
    return res.status(400).send({error: "Se debe añadir un nombre de producto para poder borrarlo"});
  }
  
  try {
    
    //? BORRAMOS EL PRODUCTO
    console.log(req.query.name.toString());
    const productDeleted = await Product.deleteOne({name: req.query.name.toString()});
    if (!productDeleted.acknowledged) {
      return res.status(500).send({error: "No se pudo borrar el producto, no existe en la base de datos"});
    }

    //? BORRAMOS EL PRODUCTO
    return res.status(200).send(productDeleted);
  } catch (error) {
    return res.status(400).send(error);
  }

});