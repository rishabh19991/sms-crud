const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const dummyData = require('../data/dummydata');

// const dbHost = 'mongodb://127.0.0.1:27017/dummydata';
const dbHost = 'mongodb://database/dummydata';

// Connect to mongodb
mongoose.connect(dbHost, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
}).then(
    () => console.log("connected to db.."),
    (err) => console.log("error in connecting to db..", err.reason)
);

mongoose.connection.on('error', err => {
    console.log("error occurred");
});

const dummySchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    city: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    price: { type: Number, required: true },
    status: { type: String, required: true },
    color: { type: String, required: true }
});

const Entry = mongoose.model('modelSchema', dummySchema);

router.get('/', (req, res) => {
    res.send('api works');
});

router.get('/entries', (req, res) => {
    Entry.find({}, (err, entries) => {
        if (err) res.status(500).send(error)

        res.status(200).json(entries);
    });
});

router.get('/entries/:id', (req, res) => {
    Entry.findById(req.params.id, (err, entries) => {
        if (err) res.status(500).send(error)

        res.status(200).json(entries);
    });
});

router.post('/entries/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const entry = await Entry.findOneAndUpdate({ id }, req.body, { new: true, runValidators: true });

        if (!entry) {
            return res.status(404).send();
        }
        res.send(entry);
    } catch (err) {
        return res.status(400).send();
    }
});

router.post('/deleteEntries/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const entry = await Entry.findOneAndRemove({ id });
        if (!entry) {
            return res.status(404).send();
        }
        res.send(entry);
    } catch (err) {
        res.status(500).send();
    }
});

router.post('/entries', async (req, res) => {
    const entry = new Entry(req.body);

    try {
        // save the data to db
        await entry.save();
        res.status(201).json({
            message: "Data Inserted",
            data: entry
        });
    } catch (err) {
        res.status(400).json({
            message: "error"
        });
    }
});

router.get('/dummyEntries', async (req, res) => {
    try {
        let entry = await Entry.deleteMany();
        entry = await Entry.insertMany(dummyData);
        res.status(201).send(entry);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
