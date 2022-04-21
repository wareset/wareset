import * as mimetypes from '@wareset/mimetypes'
import * as mimenotes from '@wareset/mimetypes/mimenotes'
import * as mimeheads from '@wareset/mimetypes/mimeheads'

console.log(mimetypes)
console.log(mimenotes)
console.log(mimeheads)
console.log(mimetypes.ext('asds/sfgrt/r.tar.gz'))
console.log(mimetypes.extname('asds/sfgrt/r.tar.c'))
console.log(mimetypes.mime('asds/sfgrt/.avi'))
console.log(mimetypes.mimeList('asds/sfgrt/r.tar.gz'))
console.log(mimetypes.mimeList('asds/sfgrt/r.tar.gz').map(mimenotes.mimeNote))
console.log(mimetypes.mimeList('asds/sfgrt/r.tar.gz').map(mimeheads.mimeHead))

console.log(mimetypes.ext('asds/sfgrt/r.tar.gz'))
console.log(mimetypes.extname('asds/sfgrt/r.tar.BLEND'))
console.log(mimetypes.mime('asds/sfgrt/.BLEND'))
console.log(mimetypes.mimeList('asds/sfgrt/r.tar.BLEND'))
console.log(mimetypes.mimeList('asds/sfgrt/r.tar.BLEND').map(mimenotes.mimeNote))
console.log(mimetypes.mimeList('asds/sfgrt/r.tar.BLEND').map(mimeheads.mimeHead))
