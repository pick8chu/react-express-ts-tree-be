import express, { Application, NextFunction, Request, Response } from 'express';

const app: Application = express();

const port = 3001;

// cors
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world');
});

app.get('/get', (req: Request, res: Response) => {
  res.send('get request');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
