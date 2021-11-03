const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const Product = require('../models/Product');
const mapOrder = require('../mappers/order')

module.exports.checkout = async function checkout(ctx, next) {
  const order = await new Order({
    user: ctx.user,
    product: ctx.request.body.product,
    phone: ctx.request.body.phone,
    address: ctx.request.body.address,
  });
  await order.save();

  const product = await Product.findById(order.product);

  await sendMail({
    to: ctx.user.email,
    subject: 'Подтверждение заказа',
    template: 'order-confirmation',
    locals: {id: order.id, product: product}
  });

  ctx.body = {order: order.id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const userOrders = await Order.find({user: ctx.user}).populate('product');
  ctx.body = {
    orders: userOrders.map(mapOrder)
  }
};
