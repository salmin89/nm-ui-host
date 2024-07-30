#!/usr/bin/env node

// require('@hosts/lib/js/nm_host_cjs'); // can recieve, but can't post to
// require('@hosts/lib/js/from_docs') // errors [Error: ENOENT: no such file or directory, open '/proc/24100/fd/1'] {

require('@hosts/lib/js/my_current').run() // works
// require('@hosts/lib/js/old') // works