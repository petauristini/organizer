import React, { useState } from "react";

function ToDoItem(props) {
  const [crossed, setCrossed] = useState(false);

  return (
    <div
      onClick={() => {
        props.onChecked(props.id);
      }}
      onMouseOver={() => setCrossed(true)}
      onMouseOut={() => setCrossed(false)}
      style={
        crossed
          ? {
              textDecoration: "line-through",
              textDecorationColor: "#B95CF4",
              textDecorationThickness: "3px",
            }
          : null
      }
    >
      <li>{props.text}</li>
    </div>
  );
}

export default ToDoItem;
