const co = require('co')

 co(function * () {
  // console.log('ts');
  yield new Promise((res)=>setTimeout(()=>res(),1000))
  // console.log('hallo');
 })
