const cache = JSON.parse(window.localStorage.getItem('web-cache') || '{}')

const WebCache = {
  clearCached (key) {
    delete cache[key]
  },

  getCached (key, fetch) {
    // window.$cache = cache;
    if (cache[key] && cache[key].response) {
      return Promise.resolve(cache[key].response)
    }

    return fetch().then(res => {
      cache[key] = {
        response: res
      }
      window.localStorage.setItem('web-cache', JSON.stringify(cache))
      return Promise.resolve(res)
    })
  }
}

export default WebCache
