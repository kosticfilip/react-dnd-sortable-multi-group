import React, { Component } from "react";
import File from "./File.js";
import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContext } from "react-dnd";
import produce from "immer";
import posed, { PoseGroup } from "react-pose";
import arrayMove from "array-move";
const Item = posed.div({
  enter: { opacity: 1 },
  exit: { opacity: 0 }
});

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

  moveCard = (dragIndex, hoverIndex, dragGroupIndex, targetGroupIndex) => {
    let nextState;
    // Same Group - just reorder
    if (dragGroupIndex === targetGroupIndex) {
      nextState = produce(this.state, draft => {
        draft.fileGroups[dragGroupIndex].files = arrayMove(
          draft.fileGroups[dragGroupIndex].files,
          dragIndex,
          hoverIndex
        );
      });

      this.setState(nextState);
    } else {
      let dragCard = this.state.fileGroups[dragGroupIndex].files[dragIndex];
      if (dragCard !== undefined) {
        nextState = produce(this.state, draft => {
          draft.fileGroups[dragGroupIndex].files.splice(dragIndex, 1);
          draft.fileGroups[targetGroupIndex].files.splice(
            hoverIndex,
            0,
            dragCard
          );
        });
        this.setState(nextState);
      }
    }
  };
  render() {
    let projectData;
    const { fileGroups } = this.state;

    projectData = fileGroups.map((fileGroup, groupIndex) => (
      <div key={fileGroup.groupId}>
        <h2>{fileGroup.name}</h2>
        <div className="files-container">
          <PoseGroup animateOnMount={true}>
            {fileGroup.files.map((file, index) => (
              <Item className="card-drag" key={file.id} data-key={file.id}>
                <File
                  file={file}
                  key={file.id}
                  index={index}
                  group={groupIndex}
                  moveCard={this.moveCard}
                />
              </Item>
            ))}
          </PoseGroup>
        </div>
      </div>
    ));

    return projectData;
  }
}
export default DragDropContext(HTML5Backend)(Project);
