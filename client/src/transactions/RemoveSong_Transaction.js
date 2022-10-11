import jsTPS_Transaction from "../common/jsTPS.js";
/**
 * RemoveSong_Transaction
 *
 * This class represents a transaction that works with removing a song.
 *  It will be managed by the transaction stack.
 *
 * @author McKilla Gorilla
 * @author Soroush Semer
 */
export default class RemoveSong_Transaction extends jsTPS_Transaction {
  constructor(initApp, initOldIndex, initOldSong) {
    super();
    this.app = initApp;
    this.oldIndex = initOldIndex;
    this.oldSong = initOldSong;
  }

  doTransaction() {
    this.app.deleteSong(this.oldIndex);
    console.log("do remove song", this.app.currentList);
  }

  undoTransaction() {
    this.app.addSong(this.oldIndex, this.oldSong);
    console.log("undo remove song", this.app.currentList);
  }
}
