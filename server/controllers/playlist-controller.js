const Playlist = require("../models/playlist-model");
/*
    This is our back-end API. It provides all the data services
    our database needs. Note that this file contains the controller
    functions for each endpoint.
    
    @author McKilla Gorilla
*/
createPlaylist = (req, res) => {
  const body = req.body;

  console.log("createPlaylist body: " + body);

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide a Playlist",
    });
  }

  const playlist = new Playlist(body);
  console.log("playlist: " + JSON.stringify(body));
  if (!playlist) {
    return res.status(400).json({ success: false, error: err });
  }

  playlist
    .save()
    .then(() => {
      return res.status(201).json({
        success: true,
        playlist: playlist,
        message: "Playlist Created!",
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error,
        message: "Playlist Not Created!",
        body,
      });
    });
};

deletePlaylist = async (req, res) => {
  console.log("deletePlaylist ", req.params.id);

  await Playlist.findOneAndDelete({ _id: req.params.id }, (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    console.log("deleted playlist");
    return res.status(200).json({ success: true, message: "Playlist Deleted" });
  }).catch((err) => console.log(err));
};

addSong = async (req, res) => {
  console.log("addSong ", req.body);

  await Playlist.findOne({ _id: req.params.id }, (err, list) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    console.log("found song");
    if (req.body.index != null) {
      list.songs.splice(req.body.index, 0, req.body.song);
    } else {
      list.songs.push(req.body.song);
    }
    console.log(list);
    async function asyncUpdatePlaylist() {
      await Playlist.updateOne({ _id: req.params.id }, list, (err) => {
        if (err) {
          return res.status(400).json({ success: false, error: err });
        }
        console.log("updated list");
        return res.status(200).json({ success: true, playlist: list });
      }).catch((err) => console.log(err));
    }
    asyncUpdatePlaylist();
  }).catch((err) => console.log(err));
};

editList = async (req, res) => {
  console.log("editList", req.body);

  async function asyncUpdatePlaylist() {
    await Playlist.updateOne({ _id: req.params.id }, req.body, (err) => {
      if (err) {
        return res.status(400).json({ success: false, error: err });
      }
      console.log("updated list");
      return res
        .status(200)
        .json({ success: true, message: "updated playlist" });
    }).catch((err) => console.log(err));
  }
  asyncUpdatePlaylist();
};

getPlaylistById = async (req, res) => {
  await Playlist.findOne({ _id: req.params.id }, (err, list) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }

    return res.status(200).json({ success: true, playlist: list });
  }).catch((err) => console.log(err));
};
getPlaylists = async (req, res) => {
  await Playlist.find({}, (err, playlists) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!playlists.length) {
      return res
        .status(404)
        .json({ success: false, error: `Playlists not found` });
    }
    return res.status(200).json({ success: true, data: playlists });
  }).catch((err) => console.log(err));
};
getPlaylistPairs = async (req, res) => {
  await Playlist.find({}, (err, playlists) => {
    if (err) {
      return res.status(400).json({ success: false, error: err });
    }
    if (!playlists.length) {
      return res.status(200).json({ success: true, idNamePairs: [] }); // changed from 404 success false error:err
    } else {
      // PUT ALL THE LISTS INTO ID, NAME PAIRS
      let pairs = [];
      for (let key in playlists) {
        let list = playlists[key];
        let pair = {
          _id: list._id,
          name: list.name,
        };
        pairs.push(pair);
      }
      return res.status(200).json({ success: true, idNamePairs: pairs });
    }
  }).catch((err) => console.log(err));
};

module.exports = {
  createPlaylist,
  getPlaylists,
  getPlaylistPairs,
  getPlaylistById,
  deletePlaylist,
  addSong,
  editList,
};
