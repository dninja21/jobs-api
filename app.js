require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

//extra security packages
const helmet=require('helmet')  // the wide known security package  
const cors=require('cors')  // makes our api accessible from different domains 
const xss=require('xss-clean') // controls any http injections by attacker requests control req.query req.body and req.params
const rateLimiter=require('express-rate-limit')//limits the amounts of requests that can be done 


// Swagger

const swaggerUI=require('swagger-ui-express')
const YAML=require('yamljs')
const swaggerDocument=YAML.load('./swagger.yaml')




// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

const authRouter=require('./routes/auth')
const jobRouter=require('./routes/jobs')

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(rateLimiter());

// extra packages
//connect db
const authenticateUser=require('./middleware/authentication')
const connectDB=require('./db/connect')
// routes
app.get('/', (req, res) => {
  res.send('jobs api<h1><a href="api-docs">Documentation</a></h1>');
});

app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocument));



//base route
app.use('/api/v1/auth/',authRouter)
app.use('/api/v1/jobs/',authenticateUser,jobRouter)

//error handler middlewares

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = process.env.PORT || 3000;

const start = async () => {
  try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
  } catch (error) {
    console.log(error);
  }
};

start();
