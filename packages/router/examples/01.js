console.clear()
console.log('server2')

// setInterval(() => {
//   // console.log(3333)
// }, 20000)

try {
  const http = require('http')
  console.log(http)

  const { createRouter } = require('../index')

  const websocket = require('websocket')
  console.log(websocket)

  const Router = createRouter(http.createServer(), {
    // useBefore: (...a) => {
    //   console.log(211212, a)
    // }
  })

  Router.get('test/[qwe]/[...qw(\\w+)].[asd]', (_req, _res, next) => {
    console.log(_req.params)
    console.log(_req)
    next()
  })

  Router.get('')
  Router.get('[qwe]')
  Router.get('[...qwe]')
  Router.get('asd/[qwe]')
  Router.get('asd/[...qwe]')
  Router.get('asd/qq-[qwe]')
  Router.get('asd/qq-[...qwe]')
  Router.get('asd/[qwe]-qq')
  Router.get('asd/[...qwe]-qq')
  Router.get('asd/qq-[qwe]-qq')
  Router.get('asd/qq-[...qwe]-qq')

  // Router.server.on('request', () => {
  //   console.log(345455)
  // })

  Router.listen(2000)
  console.log(Router)
  // console.log(Router._.routes.GET)
} catch (e) {
  console.error(e)
}
