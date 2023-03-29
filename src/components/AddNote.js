import React, { useContext, useState } from 'react'
import noteContext from '../context/notes/noteContext';

const AddNote = (props) => {

    const context = useContext(noteContext);
    const { addNote } = context;
    const { setProgress } = props;


    const [note, setNote] = useState({ title: "", description: "", tag: "" })

    const handleAddNote = (e) => {
        setProgress(30);
        e.preventDefault();
        setProgress(50);
        addNote(note.title, note.description, note.tag);
        setProgress(70);
        setNote({ title: "", description: "", tag: "" })
        setProgress(100);
        props.showAlert("Added Successfully", "success")
    }

    const onChange = (e) => {
        setNote({ ...note, [e.target.name]: e.target.value })
    }
    return (
        <div>
            <div className="container my-3 border rounded border-primary p-3">
                <h2>Add a Note</h2>
                <form className="my-3">
                    <div className="d-flex flex-row justify-content-between">
                    <div className="mb-3 flex-grow-1 me-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <input type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp" value={note.title} onChange={onChange}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tag" className="form-label">Tag</label>
                        <input type="text" className="form-control" id="tag" name="tag" value={note.tag} onChange={onChange} />
                    </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <textarea type="text" className="form-control" id="description" name="description" value={note.description} onChange={onChange} row="3"/>
                    </div>
                    
                    <button disabled={note.title.length<3 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleAddNote}>Add Note</button>
                </form>
            </div>
        </div>
    )
}

export default AddNote
