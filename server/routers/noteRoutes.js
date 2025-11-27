const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notes');
// const authenticateToken = require('../middleware/auth');

// Define the route to get the notes inventory
router.post("/create", notesController.createNotes);
router.get("/all_notes", notesController.getAllNotes);
router.get("/:id", notesController.getOneNote);
router.put("/:id", notesController.updateNote);
router.delete("/:id/delete", notesController.deleteNote);

module.exports = router;
