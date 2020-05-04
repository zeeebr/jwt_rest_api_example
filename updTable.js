const {User} = require('./models/db')

const user = new User();

user.sync();

console.log('\x1b[36m%s\x1b[0m', 'Done!')