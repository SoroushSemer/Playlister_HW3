import { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import SongCard from "./SongCard.js";
import EditSongModal from "./EditSongModal";
import RemoveSongModal from "./RemoveSongModal";
import { GlobalStoreContext } from "../store";
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function PlaylistCards(props) {
  const { store } = useContext(GlobalStoreContext);
  store.history = useHistory();
  //   const [reqCurrentList, setReqCurrentList] = useState(false);
  const [state, setState] = useState({
    markedSong: null,
    editModalVisible: false,
    deleteModalVisible: false,
    reqCurrentList: false,
  });
  if (store.currentList == null && !state.reqCurrentList) {
    store.setCurrentList(props.match.params.id);
    setState({ ...state, reqCurrentList: true });
  }
  function markSongForEditing(index) {
    // console.log("marked song for editing ", index);
    setState({
      markedSong: index,
      editModalVisible: true,
      deleteModalVisible: false,
    });
  }
  function editSong(song) {
    store.addEditSongTransaction(state.markedSong, song);
    setState({
      markedSong: null,
      editModalVisible: false,
      deleteModalVisible: false,
    });
  }
  function markSongForDeleting(index) {
    // console.log("marked song for deleting ", index);
    setState({
      markedSong: index,
      editModalVisible: false,
      deleteModalVisible: true,
    });
  }
  function deleteSong() {
    store.addRemoveSongTransaction(state.markedSong);
    setState({
      markedSong: null,
      editModalVisible: false,
      deleteModalVisible: false,
    });
  }

  return (
    <div id="playlist-cards">
      {store.currentList != null ? (
        store.currentList.songs.map((song, index) => (
          <SongCard
            id={"playlist-song-" + index}
            key={"playlist-song-" + index}
            index={index}
            song={song}
            markSongForEditing={markSongForEditing}
            markSongForDeleting={markSongForDeleting}
          />
        ))
      ) : (
        <div />
      )}

      {state.editModalVisible ? (
        <EditSongModal
          song={
            state.markedSong == null
              ? { title: "Unknown", artist: "Untitled", youTubeId: "" }
              : store.currentList.songs[state.markedSong]
          }
          hideEditSongModalCallback={() =>
            setState({ ...state, markedSong: null, editModalVisible: false })
          }
          editSongCallback={editSong}
        />
      ) : (
        <div />
      )}
      {state.deleteModalVisible ? (
        <RemoveSongModal
          song={
            state.markedSong == null
              ? { title: "Unknown", artist: "Untitled", youTubeId: "" }
              : store.currentList.songs[state.markedSong]
          }
          hideRemoveSongModalCallback={() =>
            setState({ ...state, markedSong: null, deleteModalVisible: false })
          }
          removeSongCallback={deleteSong}
        />
      ) : (
        <div />
      )}
    </div>
  );
}

export default PlaylistCards;
