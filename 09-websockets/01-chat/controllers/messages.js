const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  const messages = await Message.find({chat: ctx.user.id}).sort({date: 'desc'}).limit(20);
  ctx.body = {messages: messages.map(msg => {
    return {
      date: msg.date,
      text: msg.text,
      id: msg._id,
      user: msg.user
    }
  })};
};
