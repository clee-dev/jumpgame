const levelStore = {
  namespaced: true,
  state: {
    platforms: [
      {
        position: {
          x: 30,
          y: 80
        }
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
