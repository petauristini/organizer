import React from "react";
import ToDoList from "../components/todolist/ToDoList";

const container_style = {display: "flex", justifyContent: "center", alignItems: "center"};

function ToDo() {

  return (
    <div style={container_style}>
      <ToDoList type="Daily" />
      <ToDoList type="Weekly" />
      <ToDoList type="Monthly" />
    </div>
  );
}

export default ToDo;
