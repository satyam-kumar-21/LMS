import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js';
import errorMiddleware from './middlewares/error.middleware.js';


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: [process.env.CLIENT_URL],
    credentials: true
}))
app.use(morgan('dev'));

app.use('/', (req,res) =>{
    res.send('________Welcome to Learning management system _______');
});

app.use('/api/v1/user',userRoutes);

app.all('*',(req,res) =>{
    res.status(404).send('OOPS!! 404 page not found');
})

app.use(errorMiddleware);

export default app;