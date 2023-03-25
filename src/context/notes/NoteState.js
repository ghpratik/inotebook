import { useState } from "react";
import { host } from "../../App";
import noteContext from "./noteContext";


const NoteState = (props) => {
    const notesInitial = [];
    const userDataInitial = [];
    const [notes, setNotes] = useState(notesInitial);
    const [userData, setUserData] = useState(userDataInitial);

    //GET ALL USER NOTES
    const getNotes = async () => {
        //API call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = await response.json();
        setNotes(json);
    }

    //GET USER DATA
    const getUserData = async () => {
        //API call
        const response = await fetch(`${host}/api/auth/getuser`, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "auth-token": localStorage.getItem('token')
            }
        });
        const json = await response.json();
        setUserData(json);
    }

    //Add a Note
    const addNote = async (title, description, tag) => {
        //API call
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            body: JSON.stringify({ title, description, tag }), // body data type must match "Content-Type" header
        });
        const note = await response.json();
        setNotes(notes.concat(note))
        // client side add note
    }

    //Delete a note
    const deleteNote = async (id) => {
        console.log("deleting note with id " + id)
        const newNote = notes.filter((note) => { return note._id !== id })
        setNotes(newNote);
        //API call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: "DELETE", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
        });
        const json = await response.json();
    }

    //Edit a note
    const editNote = async (id, title, description, tag) => {
        //API call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: "PUT", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem('token')
            },
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({ title, description, tag }), // body data type must match "Content-Type" header
        });
        const json = await response.json();

        let newNotes = JSON.parse(JSON.stringify(notes))
        // edit in client side
        for (let i = 0; i < newNotes.length; i++) {
            const element = newNotes[i];
            if (element._id === id) {
                newNotes[i].title = title;
                newNotes[i].description = description;
                newNotes[i].tag = tag;
                break;
            }
        }
        setNotes(newNotes);
    }


    return (
        <noteContext.Provider value={{ notes, setNotes, addNote, deleteNote, editNote, getNotes, getUserData, userData, setUserData }}>
            {props.children}
        </noteContext.Provider>
    )

}
export default NoteState;