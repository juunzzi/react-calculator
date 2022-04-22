import { Component } from 'react';
import '../styles/Calculator.css';

const computeExpression = ({ firstOperand, secondOperand, operation }) => {
  if (operation === '/') {
    return Math.floor(firstOperand / secondOperand);
  }
  if (operation === 'X') {
    return firstOperand * secondOperand;
  }
  if (operation === '-') {
    return firstOperand - secondOperand;
  }
  if (operation === '+') {
    return firstOperand + secondOperand;
  }
};

const hasInput = ({ firstOperand, secondOperand, operation }) => {
  return firstOperand !== '0' || secondOperand !== '' || operation !== null;
};

const computeNextOperand = (currentOperand, digit) => {
  return currentOperand.length >= 3
    ? `${currentOperand.slice(0, -1)}${digit}`
    : `${Number(currentOperand + digit)}`;
};

class Calculator extends Component {
  constructor() {
    super();
    const memoizedState = JSON.parse(localStorage.getItem('prevState'));
    this.state = memoizedState
      ? memoizedState
      : {
          firstOperand: '0',
          secondOperand: '',
          operation: null,
          isError: false,
        };
  }

  componentDidMount() {
    window.addEventListener('beforeunload', this.onBeforeUnload);
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onBeforeUnload);
    localStorage.setItem('prevState', JSON.stringify(this.state));
  }

  initState = () => {
    this.setState({
      firstOperand: '0',
      secondOperand: '',
      operation: null,
      isError: false,
    });
  };

  componentDidMount() {
    window.addEventListener('beforeunload', this.onBeforeUnload);
  }

  // setItem 하는 로직은 상태가 업데이트 될때 하는게 맞나 ?
  componentDidUpdate() {
    localStorage.setItem('prevState', JSON.stringify(this.state));
  }

  componentWillUnmount() {
    window.removeEventListener('beforeunload', this.onBeforeUnload);
    localStorage.setItem('prevState', JSON.stringify(this.state));
  }

  onClickDigits = ({ target }) => {
    const { textContent: digit, className } = target;

    if (className !== 'digit') {
      return;
    }

    this.setState(({ firstOperand, secondOperand, operation }) => {
      return operation
        ? {
            secondOperand: computeNextOperand(secondOperand, digit),
            isError: false,
          }
        : {
            firstOperand: computeNextOperand(firstOperand, digit),
            isError: false,
          };
    });
  };

  onClickOperations = ({ target }) => {
    const { textContent: operation } = target;

    if (operation !== '=') {
      this.setState({ operation });
      return;
    }

    if (operation !== '=') {
      this.setState({
        operation,
      });
      return;
    }

    const result = computeExpression({
      firstOperand: Number(this.state.firstOperand),
      secondOperand: Number(this.state.secondOperand),
      operation: this.state.operation,
    });

    if (isFinite(result)) {
      this.setState({
        firstOperand: `${result}`,
        secondOperand: '',
        operation: null,
      });
      return;
    }

    this.setState(() => ({
      isError: true,
    }));
  };

  onBeforeUnload = (e) => {
    e.preventDefault();
    localStorage.setItem('prevState', JSON.stringify(this.state));
    if (hasInput({ ...this.state })) {
      e.returnValue = '';
    }
  };

  onBeforeUnload = (e) => {
    e.preventDefault();
    const { firstOperand, secondOperand, operation } = this.state;
    localStorage.setItem('prevState', JSON.stringify(this.state));
    if (hasInput({ ...this.state })) {
      e.returnValue = '';
    }
  };

  render() {
    return (
      <>
        <div>숫자는 3자리 까지만 입력이 가능합니다.</div>
        <div className="calculator">
          <h1 id="total">
            {this.state.isError
              ? '오류'
              : `${this.state.firstOperand}
            ${this.state.operation ?? ''}
            ${this.state.secondOperand}`}
          </h1>
          <div className="digits flex" onClick={this.onClickDigits}>
            <button className="digit">9</button>
            <button className="digit">8</button>
            <button className="digit">7</button>
            <button className="digit">6</button>
            <button className="digit">5</button>
            <button className="digit">4</button>
            <button className="digit">3</button>
            <button className="digit">2</button>
            <button className="digit">1</button>
            <button className="digit">0</button>
          </div>
          <div className="modifiers subgrid" onClick={this.initState}>
            <button className="modifier">AC</button>
          </div>
          <div className="operations subgrid" onClick={this.onClickOperations}>
            <button className="operation">/</button>
            <button className="operation">X</button>
            <button className="operation">-</button>
            <button className="operation">+</button>
            <button className="operation">=</button>
          </div>
        </div>
      </>
    );
  }
}
export default Calculator;
