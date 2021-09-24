const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {

    it('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 2,
          max: 4,
        }
      });

      const tooShortError = validator.validate({ name: 'L' });

      expect(tooShortError, 'Валидатор возвращает одну ошибку').to.have.length(1);
      expect(tooShortError[0], 'Ошибка для поля name').to.have.property('field').and.to.be.equal('name');
      expect(tooShortError[0], 'Поле name короче заданного диапазона').to.have.property('error').and.to.be.equal('too short, expect 2, got 1');

      const tooLongError = validator.validate({ name: 'Lalala' });

      expect(tooLongError, 'Валидатор возвращает одну ошибку').to.have.length(1);
      expect(tooLongError[0], 'Ошибка для поля name').to.have.property('field').and.to.be.equal('name');
      expect(tooLongError[0], 'Поле name длинее заданного диапазона').to.have.property('error').and.to.be.equal('too long, expect 4, got 6');

      const noError = validator.validate({ name: 'Lal' });

      expect(noError, 'Валидатор не возвращает ошибок').to.have.length(0);
    });

    it('валидатор проверяет числовые поля', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 2,
          max: 4,
        }
      });

      const tooShortError = validator.validate({ age: 1 });

      expect(tooShortError, 'Валидатор возвращает одну ошибку').to.have.length(1);
      expect(tooShortError[0], 'Ошибка для поля age').to.have.property('field').and.to.be.equal('age');
      expect(tooShortError[0], 'Поле age короче заданного диапазона').to.have.property('error').and.to.be.equal('too little, expect 2, got 1');

      const tooLongError = validator.validate({ age: 6 });

      expect(tooLongError, 'Валидатор возвращает одну ошибку').to.have.length(1);
      expect(tooLongError[0], 'Ошибка для поля age').to.have.property('field').and.to.be.equal('age');
      expect(tooLongError[0], 'Поле age длинее заданного диапазона').to.have.property('error').and.to.be.equal('too big, expect 4, got 6');

      const noError = validator.validate({ age: 3 });

      expect(noError, 'Валидатор не возвращает ошибок').to.have.length(0);
    });

    it('валидатор проверяет тип данных', () => {
      const validator = new Validator({
        unemployed: {
          type: 'string',
          min: 2,
          max: 4,
        }
      });

      const typeError = validator.validate({ unemployed: false });

      expect(typeError, 'Валидатор возвращает одну ошибку').to.have.length(1);
      expect(typeError[0], 'Ошибка для поля unemployed').to.have.property('field').and.to.be.equal('unemployed');
      expect(typeError[0], 'В поле unemployed передан некорректный тип данных').to.have.property('error').and.to.be.equal('expect string, got boolean');
      
    });

    it('валидатор выводит все виды ошибок для одного объекта', () => {
      const validator = new Validator({
        unemployed: {
          type: 'string',
          min: 2,
          max: 4,
        },
        name: {
          type: 'string',
          min: 2,
          max: 4,
        },
        surName: {
          type: 'string',
          min: 2,
          max: 4,
        },
        age: {
          type: 'number',
          min: 2,
          max: 4,
        }
      });

      const errors = validator.validate({ unemployed: false, name: 'Longname', surName: 'Surn', age: 1 });

      expect(errors, 'Валидатор возвращает три ошибки').to.have.length(3);
      expect(errors, 'Есть ошибка некорректного типа для поля unemployed').to.deep.include({field: 'unemployed', error: 'expect string, got boolean'});
      expect(errors, 'Есть ошибка слишком большой длины для поля name').to.deep.include({field: 'name', error: 'too long, expect 4, got 8'});
      expect(errors, 'Есть ошибка слишком маленького зачения для поля age').to.deep.include({field: 'age', error: 'too little, expect 2, got 1'});
    });
  });
});