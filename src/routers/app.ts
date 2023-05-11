import express from 'express';
import '../db/mongoose.js';
import { userRouter } from './users.js';
import { productRouter } from './products.js';


export const server = express();
server.use(express.json()); // para que nos funcione el body

server.use('/users',userRouter)
server.use('/products',productRouter)



//* MANEJO DE PETICIONES INCORRECTAS

server.post('*', (_, res) => {
  res.status(404).send('404 Not Found');
});

server.delete('*', (_, res) => {
  res.status(404).send('404 Not Found');
});

server.get('*', (_, res) => {
  res.status(404).send('404 Not Found');
});

server.patch('*', (_, res) => {
  res.status(404).send('404 Not Found');
});


//* PUERTO DE ESCUCHA
const port = process.env.PORT;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});