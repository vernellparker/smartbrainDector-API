import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import knex from 'knex';
import bcrypt from 'bcrypt-nodejs';
import register from './controllers/register'
import signIn from './controllers/signIn'
import profile from './controllers/profile'
import image from './controllers/image'
import users from './controllers/users'

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

app.get('/getAllUsers', (req, res)=>{users.getAllUsers(res, db)})

app.get('/profile/:id', (req, res) => {profile.getProfile(req,res, db)});


app.post('/signIn', (req, res) => {signIn.handleSignIn(req,res, db, bcrypt)});

app.post('/register', (req,res) => {register.handleRegister(req,res, db, bcrypt)});

app.post('/imageUrl', (req, res)=>{image.handleAPICall(req,res)})

app.put('/image', (req, res)=>{image.handleImage(req,res,db)})

app.listen(portNumber, () =>{
    console.log(`app is running ${portNumber}`)
});

