import React, { Component } from "react";
import DragItem from "./DragItem.js";
import { DragDropContext } from "react-dnd";
import MultiBackend from "react-dnd-multi-backend";
import HTML5toTouch from "react-dnd-multi-backend/lib/HTML5toTouch";
import produce from "immer";
import { Flipper, Flipped } from "react-flip-toolkit";
import arrayMove from "array-move";

class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileGroups: [
        {
          name: "First Group",
          groupId: "0",
          files: [
            { name: "file1", id: "1", type: "file" },
            { name: "file2", id: "2", type: "file" },
            { name: "file3", id: "3", type: "file" },
            { name: "file4", id: "4", type: "file" },
            { name: "file5", id: "5", type: "file" }
          ]
        },
        {
          name: "Second Group",
          groupId: "1",
          files: [
            { name: "image1", id: "1a", type: "img" },
            { name: "image2", id: "2a", type: "img" },
            { name: "image3", id: "3a", type: "img" },
            { name: "image4", id: "4a", type: "img" },
            { name: "image5", id: "5a", type: "img" }
          ]
        },
        {
          name: "Third Group",
          groupId: "2",
          files: [
            { name: "doc1", id: "1b", type: "doc" },
            { name: "doc2", id: "2b", type: "doc" },
            { name: "doc3", id: "3b", type: "doc" },
            { name: "doc4", id: "4b", type: "doc" },
            { name: "doc5", id: "5b", type: "doc" }
          ]
        }
      ]
    };
  }

  moveCard = (dragIndex, hoverIndex, dragGroupIndex, hoverGroupIndex) => {
    // Same group - just reorder
    if (dragGroupIndex === hoverGroupIndex) {
      this.setState(
        produce(this.state, draft => {
          draft.fileGroups[dragGroupIndex].files = arrayMove(
            draft.fileGroups[dragGroupIndex].files,
            dragIndex,
            hoverIndex
          );
        })
      );
    } else {
      let dragCard = this.state.fileGroups[dragGroupIndex].files[dragIndex];
      this.setState(
        produce(this.state, draft => {
          // Remove item from group where it was innitaly
          draft.fileGroups[dragGroupIndex].files.splice(dragIndex, 1);

          // Add to another group
          draft.fileGroups[hoverGroupIndex].files.splice(
            hoverIndex,
            0,
            dragCard
          );
        })
      );
    }
  };
  render() {
    let projectData,
      flipId = "";
    const { fileGroups } = this.state;

    fileGroups.forEach(fileGroup => {
      flipId += fileGroup.files.map(x => x.id).join("");
    });

    projectData = fileGroups.map((fileGroup, groupIndex) => (
      <div key={fileGroup.groupId}>
        <h2>{fileGroup.name}</h2>
        <div className="files-container">
          {fileGroup.files.map((file, index) => (
            <Flipped key={file.id} flipId={file.id}>
              <div>
                <DragItem
                  file={file}
                  key={file.id}
                  index={index}
                  group={groupIndex}
                  moveCard={this.moveCard}
                />
              </div>
            </Flipped>
          ))}
        </div>
      </div>
    ));

    return (
      <Flipper flipKey={flipId} spring="stiff">
        {projectData}
      </Flipper>
    );
  }
}
export default DragDropContext(MultiBackend(HTML5toTouch))(Project);
