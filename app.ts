import express, { type Request, type Response } from 'express';
import { FileService } from './FileService.ts';

const app = express();
app.use(express.json());

let dataStore: Note[] = [];

let id = 1;

interface Note {
    id: number,
    title: string,
    description?: string,
    createdAt: Date
}

app.use((req, res, next) => {
    console.log(req.method + " " + req.path);
    next();
})

app.post('/notes', (req, res, next) => {
    try {
        const note:Note = req.body;
        
        if(!note.title) throw new Error('Title is required.');
        
        note.id = id++;
        note.createdAt = new Date();

        dataStore.push(note);
        res.status(201).send(note);
    } catch(err) {
        next(err);
    }
});

app.get('/notes/:id', (req, res, next) => {
    try {
        const id:number = Number(req.params.id);
        if(isNaN(id)) throw new Error('Id should be a number');

        const note = dataStore.find((v) => v.id == id);
        if(!note) throw new Error('Note not found');
        console.log(":", note);
        res.status(200).send(note);
    } catch(err) {
        next(err);
    }
})

app.get('/notes', (req, res) => {
    res.status(200).send(dataStore);
})

app.put('/notes/:id', (req, res, next) => {
    try {
        const id:number = Number(req.params.id);
        if(isNaN(id)) throw new Error('Id should be a number');

        const noteIndex: number = dataStore.findIndex((v) => v.id == id);
        if(noteIndex === -1) throw new Error('Note not found');
        
        if(dataStore[noteIndex]) {
            if(req.body?.title) dataStore[noteIndex].title = req.body.title;
            if(req.body?.description) dataStore[noteIndex].description = req.body.description;
        }
        res.status(200).send("Updated note");
    } catch(err) {
        next(err);
    }
})

app.delete('/notes/:id', (req, res, next) => {
    try {
        const id:number = Number(req.params.id);
        if(isNaN(id)) throw new Error('Id should be a number');

        dataStore = dataStore.filter(v => v.id !== id); 
        res.status(200).send('Deleted note if present with id ' + id);
    } catch(err) {
        next(err);
    }
})

app.get('/read', async (req, res, next) => {
    const fileService = new FileService();
    const result = await fileService.readFiles(['/files/f1', '/files/f2', '/files/f3']);
    res.send(result);
})

app.use((err:Error, req:Request, res:Response) => {
    console.error("Error: ", err.message);
    res.status(400).send("Error: " + err.message);
})

app.listen(3000, ()=> {
    console.log('App Listening: http://localhost:3000');
})