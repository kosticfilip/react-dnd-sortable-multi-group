import React from "react";

export default function Card({ item, dragClass }) {
  let backgroundColor = "#dad9f3";
  item.type === "file" && (backgroundColor = "#f4d6d2");
  item.type === "img" && (backgroundColor = "#d9f3e9");

  return (
    <div className="card-file" style={Object.assign({}, { backgroundColor })}>
      <h4>{item.name}</h4>
    </div>
  );
}
