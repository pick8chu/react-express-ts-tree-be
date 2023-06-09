import express, { Application, NextFunction, Request, Response } from 'express';
import { treeRouter } from './routes/treeRouter';
import bodyParser from 'body-parser';

const app: Application = express();

const port = 3001;

// cors
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/trees', treeRouter);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
