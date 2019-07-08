import Vue from "vue";
import Vuex from "vuex";

import playerStore from "./stores/player.js";
import levelStore from "./stores/level.js";
import cameraStore from "./stores/camera.js";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    keyDownBuffer: new Set(),
    keyUpBuffer: new Set(),
    keyPressBuffer: new Set(),
  },
  getters: {},
  mutations: {
    STORE_KEYDOWN(state, keyWhich) {
      state.keyDownBuffer.add(keyWhich);
    },
    STORE_KEYUP(state, keyWhich) {
      state.keyUpBuffer.add(keyWhich);
    },
    STORE_KEYPRESS(state, keyWhich) {
      state.keyPressBuffer.add(keyWhich);
    },
    CLEAR_KEYDOWNS(state) {
      state.keyUpBuffer.forEach(x => state.keyDownBuffer.delete(x));
      state.keyUpBuffer.clear();
    },
    CLEAR_KEYPRESSES(state) {
      state.keyPressBuffer.clear();
    }
  },
  actions: {
    init({ commit, dispatch }) {
      const SPACE = 32;
      const keys = {
        press: new Set([ SPACE ])
      };

      window.addEventListener("keypress", function(e) {
        if (keys.press.has(e.which))
          commit("STORE_KEYPRESS", e.which);
      });
      window.addEventListener("keydown", function(e) {
        if (!keys.press.has(e.which))
          commit("STORE_KEYDOWN", e.which);
      });
      window.addEventListener("keyup", function(e) {
        commit("STORE_KEYUP", e.which);
      });

      const FRAMERATE = 30;
      window.setInterval(
        function() {
          dispatch("nextFrame");
        }.bind(this),
        1000 / FRAMERATE
      );
    },
    nextFrame({ state, commit, dispatch }) {
      commit("CLEAR_KEYDOWNS");

      const currentInput = new Set([...state.keyDownBuffer, ...state.keyPressBuffer]);

      dispatch("player/processInput", currentInput);
      dispatch("level/processInput", currentInput);
      dispatch("player/nextFrame");
      dispatch("camera/nextFrame");

      commit("CLEAR_KEYPRESSES");
    }
  },
  modules: {
    player: playerStore,
    level: levelStore,
    camera: cameraStore,
  }
});
