import jsTPS_Transaction from "../common/jsTPS.js";

import { GlobalStoreContext } from "../store";
/**
 * AddSong_Transaction
 *
 * This class represents a transaction that works with adding
 * a song. It will be managed by the transaction stack.
 *
 * @author McKilla Gorilla
 * @author Soroush Semer
 */

export default class AddSong_Transaction extends jsTPS_Transaction {
  constructor(initApp) {
    super();
    this.app = initApp;
    // this.song = initSong;
  }

  doTransaction() {
    this.app.addSong(null, null);
    console.log("do add song", this.app.currentList);
  }

  undoTransaction() {
    this.app.deleteSong(null);
    console.log("undo add song", this.app.currentList);
  }
}
