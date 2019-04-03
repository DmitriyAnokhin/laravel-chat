import store from '../store'

export default function (to, from, next) {
    if (store.getters.checkAuth) next()
    else next('/login?loginError=true')
}
