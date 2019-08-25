"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = renderPreloadPlayers;

var _react = _interopRequireDefault(require("react"));

var _Player = _interopRequireDefault(require("./Player"));

var _YouTube = require("./players/YouTube");

var _SoundCloud = require("./players/SoundCloud");

var _Vimeo = require("./players/Vimeo");

var _DailyMotion = require("./players/DailyMotion");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PRELOAD_PLAYERS = [{
  Player: _YouTube.YouTube,
  configKey: 'youtube',
  url: 'https://www.youtube.com/watch?v=GlCmAC4MHek'
}, {
  Player: _SoundCloud.SoundCloud,
  configKey: 'soundcloud',
  url: 'https://soundcloud.com/seucheu/john-cage-433-8-bit-version'
}, {
  Player: _Vimeo.Vimeo,
  configKey: 'vimeo',
  url: 'https://vimeo.com/300970506'
}, {
  Player: _DailyMotion.DailyMotion,
  configKey: 'dailymotion',
  url: 'http://www.dailymotion.com/video/xqdpyk'
}];

function renderPreloadPlayers(url, controls, config) {
  var players = [];

  for (var _i = 0, _PRELOAD_PLAYERS = PRELOAD_PLAYERS; _i < _PRELOAD_PLAYERS.length; _i++) {
    var player = _PRELOAD_PLAYERS[_i];

    if (!player.Player.canPlay(url) && config[player.configKey].preload) {
      players.push(_react["default"].createElement(_Player["default"], {
        key: player.Player.displayName,
        activePlayer: player.Player,
        url: player.url,
        controls: controls,
        playing: true,
        muted: true,
        display: "none"
      }));
    }
  }

  return players;
}