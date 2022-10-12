import { createContext, useState } from "react";
import jsTPS from "../common/jsTPS";
import api from "../api";

import AddSong_Transaction from "../transactions/AddSong_Transaction";
import EditSong_Transaction from "../transactions/EditSong_Transaction";
import RemoveSong_Transaction from "../transactions/RemoveSong_Transaction";
import MoveSong_Transaction from "../transactions/MoveSong_Transaction";

export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/

// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
  CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
  CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
  CREATE_NEW_LIST: "CREATE_NEW_LIST",
  LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
  SET_CURRENT_LIST: "SET_CURRENT_LIST",
  SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
};

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
  // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
  const [store, setStore] = useState({
    idNamePairs: [],
    currentList: null,
    newListCounter: 0,
    listNameActive: false,
  });

  // HERE'S THE DATA STORE'S REDUCER, IT MUST
  // HANDLE EVERY TYPE OF STATE CHANGE
  const storeReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      // LIST UPDATE OF ITS NAME
      case GlobalStoreActionType.CHANGE_LIST_NAME: {
        return setStore({
          idNamePairs: payload.idNamePairs,
          currentList: payload.playlist,
          newListCounter: store.newListCounter,
          listNameActive: false,
        });
      }
      // STOP EDITING THE CURRENT LIST
      case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
        });
      }
      // CREATE A NEW LIST
      case GlobalStoreActionType.CREATE_NEW_LIST: {
        // console.log("Creating List: ");
        // console.log(payload);
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: payload,
          newListCounter: store.newListCounter + 1,
          listNameActive: false,
        });
      }
      // GET ALL THE LISTS SO WE CAN PRESENT THEM
      case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
        return setStore({
          idNamePairs: payload,
          currentList: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
        });
      }
      // PREPARE TO DELETE A LIST
      case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: null,
          newListCounter: store.newListCounter,
          listNameActive: false,
        });
      }
      // UPDATE A LIST
      case GlobalStoreActionType.SET_CURRENT_LIST: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: payload,
          newListCounter: store.newListCounter,
          listNameActive: false,
        });
      }
      // START EDITING A LIST NAME
      case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
        return setStore({
          idNamePairs: store.idNamePairs,
          currentList: payload,
          newListCounter: store.newListCounter,
          listNameActive: true,
        });
      }
      default:
        return store;
    }
  };
  // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
  // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN
  // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

  // THIS FUNCTION PROCESSES CHANGING A LIST NAME
  store.changeListName = function (id, newName) {
    // GET THE LIST
    async function asyncChangeListName(id) {
      let response = await api.getPlaylistById(id);
      if (response.data.success) {
        let playlist = response.data.playlist;
        playlist.name = newName;
        async function updateList(playlist) {
          response = await api.editList(playlist._id, playlist);
          if (response.data.success) {
            async function getListPairs(playlist) {
              response = await api.getPlaylistPairs();
              if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                  type: GlobalStoreActionType.CHANGE_LIST_NAME,
                  payload: {
                    idNamePairs: pairsArray,
                    playlist: null,
                  },
                });
              }
            }
            getListPairs(playlist);
          }
        }
        updateList(playlist);
      }
    }
    asyncChangeListName(id);
  };

  // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
  store.closeCurrentList = function () {
    storeReducer({
      type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
      payload: {},
    });
  };

  // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
  store.loadIdNamePairs = function () {
    async function asyncLoadIdNamePairs() {
      const response = await api.getPlaylistPairs();
      if (response.data.success) {
        let pairsArray = response.data.idNamePairs;
        storeReducer({
          type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
          payload: pairsArray,
        });
      } else {
        // console.log("API FAILED TO GET THE LIST PAIRS");
      }
    }
    asyncLoadIdNamePairs();
  };

  store.setCurrentList = function (id) {
    async function asyncSetCurrentList(id) {
      // console.log(id);
      let response = await api.getPlaylistById(id);
      if (response.data.success) {
        let playlist = response.data.playlist;

        if (response.data.success) {
          storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: playlist,
          });
          store.history.push("/playlist/" + playlist._id);
        }
      }
    }
    tps.clearAllTransactions();
    asyncSetCurrentList(id);
  };

  store.createNewList = function () {
    const newPlaylist = {
      name: "Untitled" + store.newListCounter,
      songs: [],
    };
    async function asyncCreateNewList() {
      //   // console.log("created new list");
      let response = await api.createPlaylist(newPlaylist);
      if (response.data.success) {
        // console.log("got response success");
        storeReducer({
          type: GlobalStoreActionType.CREATE_NEW_LIST,
          payload: response.playlist,
        });
        store.history.push("/playlist/" + response.data.playlist._id);
        // // console.log(store);
      }
    }
    asyncCreateNewList();
  };

  store.deleteList = function (id) {
    // console.log(id);
    async function asyncDeleteList() {
      let response = await api.deletePlaylist(id);
      if (response.data.success) {
        storeReducer({
          type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
          payload: null,
        });
        store.loadIdNamePairs();
        // console.log("responded");
        store.history.push("/");
      } else {
        // console.log("delete failed");
      }
    }
    asyncDeleteList();
  };

  store.addSong = function (index, song) {
    if (store.currentList) {
      if (song == null) {
        song = {
          title: "Untitled",
          artist: "Unknown",
          youTubeId: "dQw4w9WgXcQ",
        };
      }

      async function asyncAddSong() {
        // console.log("add song");
        let response = await api.addSong(store.currentList._id, index, song);
        if (response.data.success) {
          // console.log("added song");
          // console.log(store.currentList);
          let newList = store.currentList;
          if (index != null) newList.songs.splice(index, 0, song);
          else newList = response.data.playlist;
          storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: newList,
          });
          //   console.log(store.currentList);
          //   // console.log(store.currentList);
          //   store.loadIdNamePairs();
          //   store.history.push(`/playlist/${store.currentList._id}`);
        } else {
          // console.log("add Song failed");
        }
      }

      asyncAddSong();
    } else {
      // console.log("No current list");
    }
  };

  store.moveSong = function (source, target) {
    if (store.currentList) {
      async function asyncMoveSong() {
        // // console.log(store.currentList);

        // console.log(source, target);
        let newList = store.currentList;
        // console.log(newList);
        let selectedSong = store.currentList.songs[source];
        // console.log(selectedSong);
        newList.songs.splice(source, 1);
        // console.log(newList);

        // // console.log(store.currentList.songs.length);
        // if (parseInt(target) != store.currentList.songs.length + 1) {
        if (target > newList.songs.length) {
          newList.songs.push(selectedSong);
        } else {
          // console.log("added song at", target);
          newList.songs.splice(target, 0, selectedSong);
        }
        // console.log(newList);
        let response = await api.editList(store.currentList._id, newList);
        if (response.data.success) {
          // console.log("moved song");
          storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: newList,
          });
        } else {
          // console.log("move song failed");
        }
      }
      asyncMoveSong();
    } else {
      // console.log("No current list");
    }
  };

  store.editSong = function (index, newSong) {
    if (store.currentList) {
      async function asyncEditSong() {
        let newList = store.currentList;
        newList.songs[index] = newSong;
        let response = await api.editList(store.currentList._id, newList);
        if (response.data.success) {
          // console.log("edited song");
          storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: newList,
          });
        } else {
          // console.log("move song failed");
        }
      }
      asyncEditSong();
    } else {
      // console.log("No current lsit");
    }
  };
  store.deleteSong = function (index) {
    if (store.currentList) {
      async function asyncEditSong() {
        let newList = store.currentList;
        if (index == null) {
          //   newList.songs.pop();
        } else {
          newList.songs.splice(index, 1);
        }

        let response = await api.editList(store.currentList._id, newList);
        if (response.data.success) {
          // console.log("deleted song");
          storeReducer({
            type: GlobalStoreActionType.SET_CURRENT_LIST,
            payload: newList,
          });
        } else {
          // console.log("delete song failed");
        }
      }
      asyncEditSong();
    } else {
      // console.log("No current lsit");
    }
  };

  store.getPlaylistSize = function () {
    return store.currentList.songs.length;
  };

  store.addAddSongTransaction = function () {
    let transaction = new AddSong_Transaction(this);
    tps.addTransaction(transaction);
  };
  store.addRemoveSongTransaction = function (index) {
    let transaction = new RemoveSong_Transaction(
      this,
      index,
      store.currentList.songs[index]
    );
    tps.addTransaction(transaction);
  };
  store.addEditSongTransaction = function (index, song) {
    let transaction = new EditSong_Transaction(
      this,
      index,
      store.currentList.songs[index],
      song
    );
    tps.addTransaction(transaction);
  };
  store.addMoveSongTransaction = function (oldIndex, newIndex) {
    let transaction = new MoveSong_Transaction(this, oldIndex, newIndex);
    tps.addTransaction(transaction);
  };

  store.undo = function () {
    tps.undoTransaction();
  };
  store.redo = function () {
    tps.doTransaction();
  };
  store.hasUndo = function () {
    return tps.hasTransactionToUndo();
  };
  store.hasRedo = function () {
    return tps.hasTransactionToRedo();
  };

  // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
  store.setlistNameActive = function () {
    storeReducer({
      type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
      payload: null,
    });
  };

  // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
  return { store, storeReducer };
};
