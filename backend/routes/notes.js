const express = require('express');
const router = express.Router();
var fetchUser = require('../middleware/fetchUser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

// GET ALL NOTES USING GET : "/api/auth/fetchallnotes"  === login required ROUTE1
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
})

// ADD NEW NOTES USING POST : "/api/auth/addnote"  === login required ROUTE2
router.post('/addnote', fetchUser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Enter atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // check validation of bad requests and send errors 
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const notes = new Notes({
            title, description, tag, user: req.user.id
        })
        const saveNote = await notes.save();
        res.json(saveNote);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
})

// UPDATE EXISTING NOTES USING PUT : "/api/auth/updatenote"  === login required ROUTE3
router.put('/updatenote/:id', fetchUser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        //create a newNote object
        const newNote = {};
        if (title) { newNote.title = title }
        if (description) { newNote.description = description }
        if (tag) { newNote.tag = tag }
        // FIND THE NOTE TO BE UPDATE AND UPDATE IT
        let note = await Notes.findById(req.params.id);
        if (!note) {
            res.status(404).send("Note Found");
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
})

// DELETE EXISTING NOTE USING DELETE : "/api/auth/updatenote"  === login required ROUTE4
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
    try {
        // FIND THE NOTE TO BE deleted AND delete IT
        let note = await Notes.findById(req.params.id);
        if (!note) {
            res.status(404).send("Note Found");
        }
        // Allow deletion only if user owns this note
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({ "Success": "Note has been Deleted!", note: note });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal server error");
    }
})



module.exports = router