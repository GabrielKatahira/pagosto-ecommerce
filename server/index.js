const express = require('express');
const db = require('./knex');
const app = express();
const port = 5000;
const cors = require('cors');

const path = require('path');
const fs = require('fs');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());

app.get('/api/productimages', async (req, res) => {
  try {
    fs.readdir(path.join(__dirname,'..','web','public','products'),(err,files) => {
      if (err) {
        console.error(err);
        res.status(500).json('Erro em buscar imagens!');
        return;
      }
      const images = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg','.jpeg','.png'].includes(ext);
      })
      res.json(images);
    })
  } catch (error) {
    console.error(error);
    res.status(500).json('Erro em buscar imagens!');
  }
})


app.post('/api/users', async (req, res) => {
  try {
    const {name, password, userType} = req.body;
    const hasUser = await db('users').where('name',name).first();
    if(hasUser) {
      return res.status(409).json('Usuário já existe!');
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    await db('users').insert({name, userType, password:hashedPassword, cart:'[]'});
    const user = await db('users').where('name',name).first();
    const token = jwt.sign({id: user.id, type:user.userType, name:user.name},'key_super_secreta_confia',{expiresIn:'1h'})
    res.status(200).json({token});
  } catch (error) {
    console.error(error);
    res.status(500).json('Erro ao cadastrar usuário!');
  }
})
app.get('/api/users', async (req, res) => {
  try {
    const {id} = req.query
    const users = await db('users').where('id',id).first();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json('Erro ao buscar usuários: ' + error);
  }
})

app.get('/api/login', async (req, res) => {
  try {
    const {name, password} = req.query;
    const user = await db('users').where('name', name).first();
    if (!user) {
      return res.status(401).json('Usuário ou senha inválidos!');
    }
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json('Usuário ou senha inválidos!');
    }
    const token = jwt.sign({id: user.id, type:user.userType, name:user.name},'key_super_secreta_confia',{expiresIn:'1h'})
    res.status(200).json({token});
  } catch (error) {
    console.error(error);
    res.status(500).json('Erro ao fazer login!');
  }
})
app.put('/api/cart', async(req,res) => {
  try {
    const {id} = req.query;
    const {cart} = req.body;
    await db('users').where('id',id).update({cart});
    res.status(200).json('Carrinho atualizado com sucesso!');

  } catch (error) {
    console.error(error);
    res.status(500).json('Erro ao adicionar ao carrinho:'+error);
  }
})





app.post('/api/products', async (req, res) => {
  try {
    const {name, description, prices, sizes, category, image} = req.body;
    await db('products').insert({name, description, category, prices, sizes, image});
    res.status(201).json('Sucesso!');
  } catch (error) {
    console.error(error);
    res.status(500).json('Erro ao cadastrar produto!');
  }
})
app.delete('/api/products', async (req, res) => {
  try {
    const {id} = req.query;
    await db('products').where('id', id).del();
    res.status(200).json('Sucesso!')
  } catch (error) {
    console.error(error);
    res.status(500).json('Erro em deletar pães!');
  }
})
app.put('/api/products',async (req, res) => {
  try {
    const {id, name, description, prices, sizes, category, image} = req.body;
    await db('products').where('id', id).update({name, description, category, prices, sizes, image});
    res.status(200).json('Sucesso!');
  } catch (error) {
    console.error(error);
    res.status(500).json('Erro ao atualizar produto!');
  }
})





app.get('/api/breads', async (req, res) => {
  try {
    const products = await db('products').where('category','=','Breads').select('*')
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json('Erro em buscar pães!');
  }
});




app.listen(port, () => {
  console.log(`Server rodando na porta ${port}`);
});
