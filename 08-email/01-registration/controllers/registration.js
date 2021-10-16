const { v4: uuid } = require("uuid");
const User = require("../models/User");
const sendMail = require("../libs/sendMail");

module.exports.register = async (ctx, next) => {
  const email = ctx.request.body.email;
  const displayName = ctx.request.body.displayName;
  const token = uuid();
  const user = await new User({
    email: email,
    displayName: displayName
      ? displayName
      : email.substr(0, email.indexOf("@")),
    verificationToken: token,
  });
  await user.setPassword(ctx.request.body.password);
  await user.save();
  await sendMail({
    template: "confirmation",
    locals: { token: token },
    to: email,
    subject: "Подтвердите почту",
  });
  ctx.status = 201;
  ctx.body = { status: 'ok' }
};

module.exports.confirm = async (ctx, next) => {
  const confToken = ctx.request.body.verificationToken;
  
  if(!confToken) ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');

  const user = await User.findOne({verificationToken: confToken});
  
  if(!user) ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');

  user.verificationToken = undefined;
  await user.save();

  const token = uuid();
  ctx.body = {token};
};
