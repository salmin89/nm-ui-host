#!/usr/bin/env node

require('./nm_host_cjs') // can recieve, but can't post to
// require('./from_docs') // errors [Error: ENOENT: no such file or directory, open '/proc/24100/fd/1'] {

// require('./my_current') // works
// require('./old') // works