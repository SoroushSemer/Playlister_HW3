import React, { useContext, useState } from "react";
import { GlobalStoreContext } from "../store";

function SongCard(props) {
  const { store } = useContext(GlobalStoreContext);

  const [state, setState] = useState({
    isDragging: false,
    draggedTo: false,
  });

  const handleDragStart = (event) => {
    // console.log("drag started");
    event.dataTransfer.setData("song", event.target.id);
    setState({
      isDragging: true,
      draggedTo: state.draggedTo,
    });
  };
  const handleDragOver = (event) => {
    // console.log("drag over");
    event.preventDefault();
    setState({
      isDragging: state.isDragging,
      draggedTo: true,
    });
  };
  const handleDragEnter = (event) => {
    // console.log("drag enter");
    event.preventDefault();
    setState({
      isDragging: state.isDragging,
      draggedTo: true,
    });
  };
  const handleDragLeave = (event) => {
    // console.log("drag leave");
    event.preventDefault();
    setState({
      isDragging: state.isDragging,
      draggedTo: false,
    });
  };
  const handleDrop = (event) => {
    // console.log("drop");
    event.preventDefault();
    let target = event.target;
    let targetId = target.id;
    targetId = targetId.substring(target.id.indexOf("-") + 1);
    let sourceId = event.dataTransfer.getData("song");
    sourceId = sourceId.substring(sourceId.indexOf("-") + 1);

    setState({
      isDragging: false,
      draggedTo: false,
    });

    // ASK THE MODEL TO MOVE THE DATA
    store.addMoveSongTransaction(parseInt(sourceId[0]), parseInt(targetId[0]));
  };

  const { song, index, markSongForEditing, markSongForDeleting } = props;

  const handleDoubleClick = () => {
    // console.log("got dbl click");
    markSongForEditing(index);
  };

  let cardClass = "list-card unselected-list-card";
  return (
    <div
      key={index}
      id={"song-" + index + "-card"}
      className={cardClass}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      draggable="true"
      onDoubleClick={handleDoubleClick}
    >
      {index + 1}.
      <a
        id={"song-" + index + "-link"}
        className="song-link"
        href={"https://www.youtube.com/watch?v=" + song.youTubeId}
      >
        {song.title} by {song.artist}
      </a>
      <input
        type="button"
        id={"remove-song-" + index}
        className="list-card-button"
        value={"\u2715"}
        onClick={() => markSongForDeleting(index)}
      />
    </div>
  );
}

export default SongCard;
