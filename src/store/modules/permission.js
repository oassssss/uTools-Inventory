import { constantRouterMap } from '@/config/router.config'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: constantRouterMap
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = constantRouterMap.concat(routers)
      state.routers = state.addRouters
    }
  },
  actions: {

  }
}

export default permission
