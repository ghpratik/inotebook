import React from 'react'
import Notes from './Notes';
const Home = (props) => {
    const {showAlert, setProgress} = props;
    return (
        <div>
            <Notes showAlert={showAlert} setProgress={setProgress}/>
        </div>
    )
}

export default Home

