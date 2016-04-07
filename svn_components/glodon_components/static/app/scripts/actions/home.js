import fetch from 'isomorphic-fetch';

export const FETCH_API = {
     'USER_INIT': '/user'
};

function requestPosts(method, model) {
  return {
    type: 'REQUEST_POSTS',
    method,
    model
  }
}
export function updateModel(model){
   return {
       type: 'UPDATE_MODEL',
       model
   }
}

export function setZones(zones){
   return {
       type: 'SET_ZONES',
       zones
   }
}

function receivePosts(method, json) {
  return {
    type: 'RECEIVE_POSTS',
    posts: json,
    method,
    receivedAt: Date.now()
  }
}

export function fetchPosts(method) {
  return dispatch => {
    dispatch(requestPosts(method));
    return fetch(FETCH_API[method],{credentials: 'include'})
      .then(response => response.json())
      .then(json => dispatch(receivePosts(method, json)))
  }
}

