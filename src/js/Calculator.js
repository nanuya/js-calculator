import { isNull } from './utils/common.js';
import { beforeunload } from './utils/domApi.js';

export const defaultState = {
  x: null,
  operator: null,
  y: null,
  total: null,
};

class Calculator {
  #$calculator;
  #$total;

  #buttonStrategy;

  constructor({ $calculator, $total }) {
    this.#$calculator = $calculator;
    this.#$total = $total;

    this.#init();
  }

  #init() {
    this.#render(defaultState);
    this.#bindEvent();
    this.#removeEvent();
  }

  #render(state) {
    this.#mutateState(state);
    this.#$total.innerText = this.#convertToDisplayValue();
  }

  #mutateState(newState) {
    this.state = newState ? { ...newState } : this.state;
  }

  #convertToDisplayValue() {
    const values = Object.values(this.state);
    const displayValues = values.filter((v) => !isNull(v));
    if (isEmptyArray(displayValues)) return '0';
    return displayValues.join('');
  }

  #bindEvent() {
    this.#$calculator.addEventListener('click', this.#handleClick.bind(this));
  }

  #removeEvent() {
    beforeunload(() =>
      this.#$calculator.removeEventListener(
        'click',
        this.#handleClick.bind(this)
      )
    );
  }

  #handleClick({ target }) {
    this.#buttonStrategy = this.#strategyCreator(target.dataset);

    try {
      const newState = this.#buttonStrategy?.mutateState(target, this.state);
      this.#render(newState);
    } catch ({ message }) {
      alert(message);
    }
  }

  #strategyCreator(dataset) {
    return this.#strategyCommand[dataset?.strategy]?.();
  }

  #strategyCommand = {};
}

export default Calculator;