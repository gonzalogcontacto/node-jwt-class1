import dotenv from 'dotenv';
import express from 'express';
import jwt from 'jsonwebtoken';

// dot env config
dotenv.config();

// Reading env variables
console.log(process.env.TEST);

const app = express();

// able to load json from body
app.use(express.json());

const checkJWT = (req, res, next) => {
    
    console.log("Hola este es mi middleware");
    console.log(req.headers.token);

    try{
        // verify the token of header
        const isTokenValid = jwt.verify(req.headers.token, process.env.JWT_TOKEN);
        console.log(' Result verify -> ',isTokenValid);

        next()
    } catch(e){
        res.sendStatus(401);
    }
}

app.get('/users', [checkJWT], (req, res) =>{
    res.json({ msg: "Hola" })
})

// SECURITY PASS
app.post('/auth', (req, res) =>{

    // generating the token with expected payload of the user
    const payload = {
        email: req.body.email,
        username: req.body.username
    }

    // Sign the token with the payload and the secret
    const secret = process.env.JWT_TOKEN
    const token = jwt.sign(payload, secret, { expiresIn: 40000});
    
    res.json({ token: token })
})

app.listen(4000, () => {
    console.log('Server is running');
})
