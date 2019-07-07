const stats = {
  JUMP_FORCE: {
    GROUND: 70,
    AIR: 50,
  },
  MOVE_FORCE: 6,
  GRAVITY: 8,
  MAX_FALL_SPEED: -60,
  MAX_MOVE_SPEED: 50,
  FRICTION: 8,
};

const keys = {
  SPACE: 32,
  LEFT: 37,
  RIGHT: 39
};

const playerStore = {
  namespaced: true,
  state: {
    landed: true,
    running: false,
    hasAirJumped: false,
    position: {
      x: 50,
      y: 600
    },
    acceleration: {
      x: 0,
      y: 0
    }
  },
  getters: {},
  mutations: {
    SET_ACCEL_Y(state, value) {
      state.acceleration.y = value;
    },
    SET_ACCEL_X(state, value) {
      state.acceleration.x = value;
    },
    APPLY_GRAVITY(state) {
      if (state.acceleration.y < stats.MAX_FALL_SPEED)
        state.acceleration.y = stats.MAX_FALL_SPEED;
      
      state.position.y -= state.acceleration.y; //apply
      state.acceleration.y -= stats.GRAVITY; //fall
      state.landed = false;

      //TODO: move
      const FLOOR = 600;
      if (state.position.y >= FLOOR) {
        state.position.y = FLOOR;
        state.landed = true;
      }
    },
    APPLY_MOVEMENT(state) {
      if (state.acceleration.x > stats.MAX_MOVE_SPEED)
        state.acceleration.x = stats.MAX_MOVE_SPEED;
      else if (state.acceleration.x < -stats.MAX_MOVE_SPEED)
        state.acceleration.x = -stats.MAX_MOVE_SPEED;

      state.position.x += state.acceleration.x;
    },
    APPLY_FRICTION(state) {
      if (state.acceleration.x > 0)
        state.acceleration.x -= stats.FRICTION;
      else if (state.acceleration.x < 0)
        state.acceleration.x += stats.FRICTION;
      
      if (Math.abs(state.acceleration.x) < stats.FRICTION)
        state.acceleration.x = 0;
    },
    SET_RUNNING(state, value) {
      state.running = value;
    },
    SET_HASAIRJUMPED(state, value) {
      state.hasAirJumped = value;
    }
  },
  actions: {
    processInput({ commit, dispatch }, keyBuffer) {
      if (keyBuffer.has(keys.SPACE))
        dispatch("jump");
      if (keyBuffer.has(keys.LEFT))
        dispatch('moveLeft');
      if (keyBuffer.has(keys.RIGHT))
        dispatch('moveRight');

      // not holding right OR left, OR holding right AND left
      if ((!keyBuffer.has(keys.RIGHT) && !keyBuffer.has(keys.LEFT)) ||
          (keyBuffer.has(keys.RIGHT) && keyBuffer.has(keys.LEFT)))
        commit('SET_RUNNING', false);
      else
        commit('SET_RUNNING', true);
    },
    jump({ state, commit }) {
      if (state.landed) {
        commit("SET_ACCEL_Y", stats.JUMP_FORCE.GROUND);
        commit("SET_HASAIRJUMPED", false);
      }
      else {
        if (!state.hasAirJumped) {
          commit("SET_ACCEL_Y", stats.JUMP_FORCE.AIR);
          commit("SET_HASAIRJUMPED", true);
        }
      }
    },
    moveLeft({ state, commit }) {
      commit('SET_ACCEL_X', state.acceleration.x - stats.MOVE_FORCE);
    },
    moveRight({ state, commit }) {
      commit('SET_ACCEL_X', state.acceleration.x + stats.MOVE_FORCE);
    },
    nextFrame({ state, commit }) {
      commit("APPLY_GRAVITY");
      commit("APPLY_MOVEMENT");
      if (!state.running) commit("APPLY_FRICTION");
    }
  }
};
export default playerStore;
