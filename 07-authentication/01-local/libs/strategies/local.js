const LocalStrategy = require('passport-local').Strategy;
const Users = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      const user = await Users.findOne({email: email});
      if(!user) return done(null, false, 'Нет такого пользователя');
      const isCorrectPswrd = await user.checkPassword(password);
      if(!isCorrectPswrd) return done(null, false, 'Неверный пароль');
      return done(null, user);
    },
);
