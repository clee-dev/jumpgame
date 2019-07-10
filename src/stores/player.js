const stats = {
  SIZE: {
    WIDTH: 100,
    HEIGHT: 100,
  },
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
    landed: false,
    running: false,
    hasAirJumped: false,
    position: {
      x: 50,
      y: 500,
    },
    acceleration: {
      x: 0,
      y: 0
    },
    desiredOffset: {
      x: 0,
      y: 0
    }
  },
  getters: {
    renderPosition(state, getters, rootState) {
      return {
        x: state.position.x,
        y: state.position.y + rootState.camera.y,
      };
    }
  },
  mutations: {
    SET_ACCEL_Y(state, value) {
      state.acceleration.y = value;
    },
    SET_ACCEL_X(state, value) {
      state.acceleration.x = value;
    },
    APPLY_GRAVITY(state) {
      if (state.landed) {
        return;
      }
      if (state.acceleration.y < stats.MAX_FALL_SPEED)
        state.acceleration.y = stats.MAX_FALL_SPEED;
      
      state.desiredOffset.y = -state.acceleration.y; //apply
      state.acceleration.y -= stats.GRAVITY; //fall
      state.landed = false;
    },
    APPLY_MOVEMENT(state) {
      if (state.acceleration.x > stats.MAX_MOVE_SPEED)
        state.acceleration.x = stats.MAX_MOVE_SPEED;
      else if (state.acceleration.x < -stats.MAX_MOVE_SPEED)
        state.acceleration.x = -stats.MAX_MOVE_SPEED;

      state.desiredOffset.x = state.acceleration.x;
    },
    APPLY_FRICTION(state) {
      if (state.acceleration.x > 0)
        state.acceleration.x -= stats.FRICTION;
      else if (state.acceleration.x < 0)
        state.acceleration.x += stats.FRICTION;
      
      if (Math.abs(state.acceleration.x) < stats.FRICTION)
        state.acceleration.x = 0;
    },
    UPDATE_POSITION(state, newPosition) {
      state.position = newPosition;
    },
    SET_RUNNING(state, value) {
      state.running = value;
    },
    SET_HASAIRJUMPED(state, value) {
      state.hasAirJumped = value;
    },
    SET_LANDED(state, value) {
      state.landed = value;
      if (value) {
        state.acceleration.y = 0;
        state.desiredOffset.y = 0;
        state.hasAirJumped = false;
      }
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
        state.landed = false;
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
    checkCollision({ state, commit, rootState }) {
      const currentPos = state.position;
      const desiredPos = {
        x: currentPos.x + state.desiredOffset.x,
        y: currentPos.y + state.desiredOffset.y,
      };
      const desiredLine = {
        A: desiredPos.y - currentPos.y,
        B: currentPos.x - desiredPos.x,
        C: (desiredPos.y - currentPos.y) * currentPos.x + (currentPos.x - desiredPos.x) * currentPos.y
      };

      const slope = (desiredPos.y - currentPos.y) / (desiredPos.x - currentPos.x);
      console.log(slope);
      let newPosition = desiredPos; //default

      const platforms = rootState.level.platforms;
      const nearPlats =
        platforms.filter(p => 
          p.position.y >= currentPos.y + stats.SIZE.HEIGHT &&
          p.position.y <= desiredPos.y + stats.SIZE.HEIGHT &&

          p.position.x <= desiredPos.x + stats.SIZE.WIDTH - 1 &&
          p.position.x + p.width - 1 >= desiredPos.x
        );

      if (nearPlats.length === 0) commit('SET_LANDED', false);
      else {
        nearPlats.forEach(p => {
          const y1 = p.position.y;
          const y2 = p.position.y;
          const x1 = p.position.x;
          const x2 = p.position.x + p.width - 1;
          const platLine = {
            A: y2 - y1,
            B: x1 - x2,
            C: (y2 - y1) * x1 + (x1 - x2) * y1
          };

          const A1 = desiredLine.A;
          const B1 = desiredLine.B;
          const C1 = desiredLine.C;
          const A2 = platLine.A;
          const B2 = platLine.B;
          const C2 = platLine.C;

          let delta = A1 * B2 - A2 * B1;
          if (delta !== 0) { //lines not parallel
            let intersection = {
              x: (B2 * C1 - B1 * C2) / delta,
              y: (A1 * C2 - A2 * C1) / delta
            };

            newPosition = {
              x: intersection.x,
              y: intersection.y - stats.SIZE.HEIGHT
            };
            state.acceleration.y = 0;
            commit('SET_LANDED', true);
          }
        });
      }

      commit('UPDATE_POSITION', newPosition);
    },
    nextFrame({ state, commit, dispatch }) {
      commit("APPLY_GRAVITY");
      commit("APPLY_MOVEMENT");
      dispatch("checkCollision");
      if (!state.running) commit("APPLY_FRICTION");
    }
  }
};
export default playerStore;
