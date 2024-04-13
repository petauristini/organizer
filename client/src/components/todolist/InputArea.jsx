import React, { useState } from "react";

function InputArea(props) {
  const [inputText, setInputText] = useState("");
  const [hover, setHover] = useState(false);

  function handleChange(event) {
    const newValue = event.target.value;
    setInputText(newValue);
  }

  function handleSubmit(event) {
    event.preventDefault();
    props.addItem(inputText);
    setInputText("");
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <input onChange={handleChange} type="text" value={inputText} />
      <button
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
        style={hover ? { backgroundColor: "#5c0a8f" } : {}}
      >
        <span>Add</span>
      </button>
    </form>
  );
}

export default InputArea;
