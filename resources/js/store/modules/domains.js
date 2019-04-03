export default {
  state: {
    domains: [
      '.ru',
      '.su',
      '.рф',
      '.com',
      '.net'
    ]
  },
  mutations: {

  },
  actions: {

  },
  getters: {
    getDomains (state) {
      return state.domains
    }
  }
}
