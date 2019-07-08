const stats = {
    SCROLL_INCREMENT: 1,
};

const cameraStore = {
    namespaced: true,
    state: {
        y: 0,
    },
    getters: {},
    mutations: {
        SCROLL_UP(state) {
            state.y += stats.SCROLL_INCREMENT;
        }
    },
    actions: {
        nextFrame({ commit }) {
            commit('SCROLL_UP');
        }
    }
};
export default cameraStore;