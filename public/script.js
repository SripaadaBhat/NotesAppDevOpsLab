async function fetchNotes() {
    const response = await fetch('/notes');
    const notes = await response.json();

    const container = document.getElementById('notesContainer');
    container.innerHTML = '';

    if (notes.length === 0) {
        container.innerHTML = '<p>No notes added yet.</p>';
        return;
    }

    notes.reverse().forEach(note => {
        const card = document.createElement('div');
        card.className = 'note-card';

        card.innerHTML = `
            <div class="note-text">${note.text}</div>
            <button class="delete-btn" onclick="deleteNote(${note.id})">
                Delete
            </button>
        `;

        container.appendChild(card);
    });
}

async function addNote() {
    const input = document.getElementById('noteInput');
    const text = input.value.trim();

    if (!text) {
        alert('Please enter a note');
        return;
    }

    await fetch('/notes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
    });

    input.value = '';
    fetchNotes();
}

async function deleteNote(id) {
    await fetch(`/notes/${id}`, {
        method: 'DELETE'
    });

    fetchNotes();
}

fetchNotes();