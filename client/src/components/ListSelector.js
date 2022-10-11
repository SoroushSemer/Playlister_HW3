import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ListCard from "./ListCard.js";
import DeleteListModal from "./DeleteListModal.js";

import { GlobalStoreContext } from "../store";
import apis from "../api/index.js";
/*
    This React component lists all the playlists in the UI.
    
    @author McKilla Gorilla
*/
const ListSelector = () => {
  const { store } = useContext(GlobalStoreContext);
  store.history = useHistory();

  const [state, setState] = useState({
    markedList: null,
    modalVisible: false,
  });

  useEffect(() => {
    store.loadIdNamePairs();
  }, []);

  function handleCreateNewList() {
    store.createNewList();
  }

  function handleDeleteList() {
    console.log("deleting list");
    store.deleteList(state.markedList._id);
    setState({
      markedList: null,
      modalVisible: false,
    });
  }

  function markListforDeletion(list) {
    console.log("marking for deletion");
    setState({
      markedList: list,
      modalVisible: true,
    });
  }

  function setModalVisible() {
    setState({
      markedList: state.markedList,
      modalVisible: false,
    });
  }

  let listCard = "";
  if (store) {
    console.log(store.idNamePairs);
    listCard = store.idNamePairs.map((pair) => (
      <ListCard
        key={pair._id}
        idNamePair={pair}
        markListforDeletion={markListforDeletion}
        selected={false}
      />
    ));
  }
  return (
    <div id="playlist-selector">
      <div id="list-selector-list">
        <div id="playlist-selector-heading">
          <input
            type="button"
            id="add-list-button"
            onClick={handleCreateNewList}
            className="playlister-button"
            value="+"
          />
          Your Lists
        </div>{" "}
        {listCard}
      </div>

      {state.modalVisible ? (
        <DeleteListModal
          listKeyPair={state.markedList}
          hideDeleteListModalCallback={setModalVisible}
          deleteListCallback={handleDeleteList}
        />
      ) : (
        <div />
      )}
    </div>
  );
};

export default ListSelector;
