import { useContext } from "react";
import { GlobalStoreContext } from "../store";
import { useHistory } from "react-router-dom";
/*
    This toolbar is a functional React component that
    manages the undo/redo/close buttons.
    
    @author McKilla Gorilla
*/
function EditToolbar() {
  const { store } = useContext(GlobalStoreContext);
  const history = useHistory();

  let enabledButtonClass = "playlister-button";

  function handleAddSong() {
    store.addAddSongTransaction();
  }

  function handleUndo() {
    store.undo();
  }
  function handleRedo() {
    store.redo();
  }
  function handleClose() {
    history.push("/");
    store.closeCurrentList();
  }
  //   let editStatus = false;
  //   if (store.isListNameEditActive) {
  //     editStatus = true;
  //   }

  let addSongButtonStatus = false;
  if (store.currentList == null) {
    addSongButtonStatus = true;
  }
  let closeButtonStatus = false;
  if (store.currentList == null) {
    closeButtonStatus = true;
  }

  let undoButtonStatus = !store.hasUndo() || store.currentList == null;
  let redoButtonStatus = !store.hasRedo() || store.currentList == null;
  return (
    <span id="edit-toolbar">
      <input
        type="button"
        id="add-song-button"
        disabled={addSongButtonStatus}
        value="+"
        className={enabledButtonClass}
        onClick={handleAddSong}
      />
      <input
        type="button"
        id="undo-button"
        disabled={undoButtonStatus}
        value="⟲"
        className={enabledButtonClass}
        onClick={handleUndo}
      />
      <input
        type="button"
        id="redo-button"
        disabled={redoButtonStatus}
        value="⟳"
        className={enabledButtonClass}
        onClick={handleRedo}
      />
      <input
        type="button"
        id="close-button"
        disabled={closeButtonStatus}
        value="&#x2715;"
        className={enabledButtonClass}
        onClick={handleClose}
      />
    </span>
  );
}

export default EditToolbar;
