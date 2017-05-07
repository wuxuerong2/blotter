import * as types from '../mutation-types'

const state = {
  token: 0,
  loginDialogShow: false,
  previousUrl: ""
}

const getters = {
  authorityGetter: state => state.hasLogin,
  loginDialogShowGetter: state => state.loginDialogShow,
  previousUrlGetter: state => state.previousUrl
}

const actions = {
  authorityAction( {commit},value){
    commit(types.SET_LOGIN, value)
  },
  loginDialogShowAction( {commit},value){
    commit(types.SET_LOGIN_DIALOG, value)
  },
  previousUrlAction( {commit},value){
    commit(types.SET_PREVIOUS_URL, value)
  }
}

const mutations = {
  [types.SET_LOGIN](state,value){
    state.token = value;
  },
  [types.SET_LOGIN_DIALOG](state,value){
    state.loginDialogShow = value;
  },
  [types.SET_PREVIOUS_URL](state,value){
    state.previousUrl = value;
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
