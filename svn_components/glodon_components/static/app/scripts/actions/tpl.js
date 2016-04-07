import fetch from 'isomorphic-fetch';

export function tpl_form(method) {
  return {
      type: 'show_form',
      method
  }
}

export function filter_update(model, param){
    return {
        type: 'filter_update',
        model,
        param
    }
}

function refreshList(method, json){
  return {
    type: 'REFRESH_LIST',
    get: json,
    method,
    receivedAt: Date.now()
  }
}

function refreshDetil(json){
  return {
    type: 'REFRESH_DETAIL',
    get: json,
    receivedAt: Date.now()
  }
}

function loadingDetil(){
  return {
    type: 'LOADING_DETAIL'
  }
}

function loadingList(method){
  return {
    type: 'LOADING_LIST',
    method
  }
}

export function appendContain(contain){
  return {
    type: 'APPEND_CONTAIN',
    contain
  }
}

export function popContain(){
  return {
    type: 'POP_CONTAIN'
  }
}

export function fetchList(url, method, params){
  if(params)url+='?';
  var pack = false;
  for(let param in params){
        if(pack)url+='&';
        url+= param + '=' + params[param];
        pack = true;
  }
  return dispatch => {
    dispatch(loadingList(method));
    return fetch(url, {credentials: 'include', method: 'get'})
      .then(response => response.json())
      .then(json => dispatch(refreshList(method, json)))
  }
}

export function fetchDetail(url){
    return dispatch => {
    dispatch(loadingDetil());
    return fetch(url, {credentials: 'include', method: 'get'})
      .then(response => response.json())
      .then(json => dispatch(refreshDetil(json)))
  }
}
