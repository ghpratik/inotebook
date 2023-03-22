import React from 'react'

export default function Alert(props) {
    const capitalize = (word)=>{
        if(word==="danger"){
            word = "error";
        }
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
  return (
    <div style={{height: '50px', marginTop: '50px'}}>
      {props.alert && //    ele1 && ele2 => if ele1 is false or null, ele2 will not execute vice versa if ele1 is true or not null then ele2 will get executed
      <div>
        <div className={`alert alert-${props.alert.type} alert-dismissible fade show`} role="alert">
            <strong>{capitalize(props.alert.type)}</strong>: {props.alert.msg}
        </div>
      </div>}
    </div>
  )
}

