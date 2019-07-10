const levelStore = {
  namespaced: true,
  state: {
    platforms: [
      {
        position: {
          x: 30,
          y: 160,
        },
        width: 300,
      },
      {
        position: {
          x: 300,
          y: 380
        },
        width: 200
      }
    ]
  },
  getters: {},
  mutations: {
    SET_PLATFORMS(state, value) {
      state.platforms = value;
    }
  },
  actions: {
    processInput({ dispatch }, keyBuffer) {}
  }
};
export default levelStore;
