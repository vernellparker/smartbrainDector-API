import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt-nodejs';


const app = express();
const portNumber = 3000;
const status={
    Status: 'Healthy'
}

const db = knex({
    client:'pg',
    connection: {
        host:'127.0.0.1',
        user: 'postgres',
        password:'AMber_8605',
        database: 'test'
    }
})

app.use(cors())
app.use(bodyParser.json());



app.get('/', (req, res)=>{
    res.json(status)
})

app.get('/getAllUsers', (req, res)=>{
    db.select('*').from('users').then(users =>
        res.json(users));
})

app.get('/profile/:id', (req, res)=>{
    const {id} = req.params;
    db.select('*').from('users').where({id})
    .then(user => {
        if(user.length){
            res.json(user[0])
        }else{
            res.status(404).json('Not Found')
        }
   
    }).catch(err=> res.status(400).json('error getting user'));
});


app.post('/signIn',(req,res)=>{
    const {email, password} = req.body;
   db.select('email', 'hash').from('login')
   .where('email', '=', email)
   .then(data => {
    const isVaild = bcrypt.compareSync(password, data[0].hash)
    if(isVaild){
    return db.select('*').from('users')
        .where('email', '=', email)
        .then(user => {
            res.json(user[0])
        })
        .catch(err => res.status(404).json('unable to get user'))
    }else{
        res.status(401).json('Not Authorized')
    }
   })
});

app.post('/register', (req,res)=>{

    const {email,name, password} = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx =>{
        trx.insert({
            hash:hash,
            email:email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users').returning('*').insert({
                email: loginEmail[0],
                name: name,
                joined: new Date()
            }).then(user => {
                res.json(user[0])
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    }).catch(err => res.status(400).json('Unable to register'))



});


app.put('/image', (req, res)=>{
    const {id} = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json([entries[0]])
    })
    .catch(err => res.status(400).json("unable to get entries"))
 
})

app.listen(portNumber, () =>{
    console.log(`app is running ${portNumber}`)
});

