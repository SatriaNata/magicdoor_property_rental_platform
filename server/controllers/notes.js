let notes = [
  { id: 1, 
    title: "Sample Note 1", 
    content: "This is a note for testing 1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
let nextId = 2;

// POST /notes to create a new note.
exports.createNotes = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    
    const newNote = {
      id: nextId++,
      title,
      content: content || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    notes.push(newNote)
    res.status(201).json(newNote)
  } catch (error) {
    res.status(500).json({ error });
  }
}

// GET /notes to retrieve all notes.
exports.getAllNotes = async (req, res) => {
  try {
    console.log("masuk sini ga?===>")
    res.json(notes)
  } catch (error) {
    res.status(500).json({error});
  }
}

// GET /notes/:id to retrieve a specific note by ID.
exports.getOneNote = async (req, res) => {
  const noteId = Number(req.params.id);
  try {
    const note = notes.find((data) => data.id === noteId)
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    
    res.status(200).json({ message: "Get Note successfully", data: note });
  } catch (error) {
    res.status(500).json({ error });
  }
}

// PUT /notes/:id to update a note.
exports.updateNote = async (req, res) => {
  const noteId = Number(req.params.id)
  const { title, content } = req.body
  try {
    const note = notes.findIndex((data) => data.id === noteId)

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }
    const existing = notes[note]
    const updated = {
      ...existing,
      title: title ?? existing.title,
      content: content ?? existing.content,
      updatedAt: new Date().toString()
    }

    notes[note] = updated

    console.log("note[noteId]===>", notes[noteId])

    res.status(200).json({ 
      message: "Update Note successfully", 
      updateNote: updated 
    });
  } catch (error) {
    res.status(500).json({ error });
  }
}


// DELETE /notes/:id to delete a note.
exports.deleteNote = async (req, res) => {
  const noteId = Number(req.params.id);

  try {
    const index = notes.findIndex((data) => data.id === noteId);

    // kalau tidak ketemu
    if (index === -1) {
      return res.status(404).json({ message: "Note not found" });
    }

    // hapus 1 item di posisi index
    notes.splice(index, 1);

    res.status(200).json({
      message: "Delete Note successfully",
    });
  } catch (error) {
    console.error("Error delete note:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}