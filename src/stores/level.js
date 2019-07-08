const levelStore = {
  namespaced: true,
  state: {
    platforms: [
      {
        position: {
          x: 30,
          y: 80,
        },
        width: 300,
      },
      {
        position: {
          x: 300,
          y: 380
        },
        width: 20
      }
    ]
  },
  getters: {},
  mutations: {},
  actions: {
    processInput({ dispatch }, keyBuffer) {}
  }
};
export default levelStore;
