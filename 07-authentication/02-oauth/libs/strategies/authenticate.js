const User = require('../../models/User');
const Users = require('../../models/User');

module.exports = async function authenticate(strategy, email, displayName, done) {
  console.log(email, displayName);
  if(!email) return done(null, false, 'Не указан email');
  let user = await Users.findOne({email: email});
  if(!user) {
    try{
      user = new User({
        email: email,
        displayName: (displayName) ? displayName : email.substr(0, email.indexOf('@'))
      });
      await user.save();
    } catch(err) {
      return done(err);
    }
  }
  done(null, user);
};
