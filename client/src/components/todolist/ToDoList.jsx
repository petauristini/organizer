import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ToDoItem from "./ToDoItem";
import InputArea from "./InputArea";
import axios from "axios";
import "./ToDoList.css";

function ToDoList(props) {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const getItems = useCallback(async () => {
    try {
      const response = await axios.get("api/todo", {
        params: { type: props.type },
      });
      setItems(response.data);
    } catch (error) {
      navigate("/login");
      console.log(error);
    }
  }, [navigate, props.type]);

  const addItem = useCallback(
    async (inputText) => {
      try {
        await axios.post("api/todo", { item: inputText, type: props.type });
        getItems();
      } catch (error) {
        console.log(error);
      }
    },
    [getItems, props.type]
  );

  const deleteItem = useCallback(
    async (id) => {
      try {
        await axios.delete(`api/todo/${id}`);
        getItems();
      } catch (error) {
        console.log(error);
      }
    },
    [getItems]
  );

  useEffect(() => {
    getItems();
  }, [getItems]);

  return (
    <div className="container">
      <div className="heading">
        <h1>{props.type} To-Do List</h1>
      </div>
      <InputArea addItem={addItem} />
      <div>
        <ul>
          {items.map((todoItem) => (
            <ToDoItem
              key={todoItem.id}
              id={todoItem.id}
              text={todoItem.item}
              onChecked={deleteItem}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ToDoList;
