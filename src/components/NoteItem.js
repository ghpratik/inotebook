import React, { useContext } from 'react'
import noteContext from '../context/notes/noteContext';

const NoteItem = (props) => {
    const context = useContext(noteContext);
    const { deleteNote } = context;
    const { note, updateNote, setProgress } = props;
    return (
        <div className='col-md-3'>
            <div className="card my-3">
                <div className="card-header">{note.tag}</div>
                <div className="card-body">
                    <div className="d-flex align-item-center">
                        <h5 className="card-title">{note.title}</h5>
                        <i className="fa-solid fa-trash mx-2" onClick={() => { setProgress(30); deleteNote(note._id); setProgress(100); props.showAlert("Deleted Successfully", "success") }}></i>
                        <i className="fa-solid fa-pen-to-square mx-2" onClick={() => { setProgress(30); updateNote(note); setProgress(100); }}></i>
                    </div>
                    <p className="card-text">{note.description}</p>

                </div>
                <div className="card-footer text-muted">{new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(note.date)}</div>
            </div>
        </div>
    )
}

export default NoteItem
