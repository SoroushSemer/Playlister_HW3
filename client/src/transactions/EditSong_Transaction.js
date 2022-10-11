import jsTPS_Transaction from "../common/jsTPS.js";
/**
 * EditSong_Transaction
 *
 * This class represents a transaction that works with editing songs.
 *  It will be managed by the transaction stack.
 *
 * @author McKilla Gorilla
 * @author Soroush Semer
 */
export default class EditSong_Transaction extends jsTPS_Transaction {
  constructor(initApp, index, initOldSong, initNewSong) {
    super();
    this.app = initApp;
    this.oldSong = initOldSong;
    this.newSong = initNewSong;
    this.index = index;
  }

  doTransaction() {
    this.app.editSong(this.index, this.newSong);
    console.log("do edit song", this.app.currentList);
  }

  undoTransaction() {
    this.app.editSong(this.index, this.oldSong);
    console.log("undo edit song", this.app.currentList);
  }
}
