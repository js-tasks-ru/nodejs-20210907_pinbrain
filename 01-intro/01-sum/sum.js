function sum(a, b) {
  let sum = 0;
  for (let arg of arguments){
    if(typeof arg !== 'number'){
      throw new TypeError ('Аргументы не числа!');
    }else{
      sum += arg;
    }
  }
  return sum;
}

module.exports = sum;
