// Libraries import
import React from "react";

// css import
import './Comment.css'

let teste = "12345"

// function Component
function Comment(props){
    // Return JSX element
    return(
        <>
            <section className="comment">
                <p className="title">{props.title}</p>
                <p className="text">Texto do comentário</p>
                <p className="author">{props.author}</p>
                <p>{teste}</p>
            </section>
        </>
    );

}

export default Comment;