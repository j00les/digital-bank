'use strict';
// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2022-05-26T17:01:17.194Z',
    '2022-06-10T23:36:17.929Z',
    '2022-06-11T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const inputTransferAmount = document.querySelector('.form__input--amount')

const formatMovementDate = date => {
  //calculate passed days
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

  const daysPassed = calcDaysPassed(new Date(), date);
  console.log(daysPassed);
  
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    const year = date.getFullYear();
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    return `${day}/${month}/${year}`;
  }
};

const calcDisplayMovements = (acc, sort = false) => {
  containerMovements.innerHTML = '';

  const sortMov = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  sortMov.forEach((mov, i) => {
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);

    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const element = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">${displayDate}</div>

          <div class="movements__value">${mov.toFixed(2)}€</div>
        </div>
      `;

    containerMovements.insertAdjacentHTML('afterbegin', element);
  });
};

const usernameAbbv = accounts => {
  accounts.forEach(acc => {
    acc['username'] = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
usernameAbbv(accounts);

const calcDisplaySummary = acc => {
  const moneyIn = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = `${moneyIn.toFixed(2)}€`;

  const moneyOut = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = `${Math.abs(moneyOut).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(depos => (depos * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
};

const updateUI = acc => {
  //display movements
  calcDisplayMovements(acc);

  //display balance
  calcDisplayBalance(acc);

  //display summary
  calcDisplaySummary(acc);
};

let currentAccount;
// //always logged in
// currentAccount = account1;
// containerApp.style.opacity = 100;
// updateUI(currentAccount);

//display ui when logged in
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === +inputLoginPin.value) {
    containerApp.style.opacity = 100;

    //show date
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const year = now.getFullYear();
    const hour = `${now.getHours()}`.padStart(2, 0);
    const minutes = ` ${now.getMinutes()}`.padStart(2, 0);
    labelDate.innerHTML = `${day}/${month}/${year} ${hour}:${minutes}`;
    //display ui message
    labelWelcome.textContent = `Welcome, ${currentAccount.owner.split(' ')[0]}`;

    //clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();
  }
  // update UI
  updateUI(currentAccount);
});

//transfer money
btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  console.log(amount);
  const receiver = accounts.find(acc => acc.username === inputTransferTo.value);

  if (
    amount > 0 &&
    receiver &&
    currentAccount.balance >= amount &&
    receiver?.username !== currentAccount.username
  ) {
    //clear input fields
    inputTransferTo.value = '';
    inputTransferAmount.value = '';
    btnTransfer.blur();

    //add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiver.movementsDates.push(new Date().toISOString());

    //doing the transfer
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);

    //display UI
    updateUI(currentAccount);
  }
});

//close account
btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
});

//request loan
btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = Math.floor(+inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    // add loan date
    currentAccount.movementsDates.push(new Date().toISOString());
  }
  updateUI(currentAccount);
});

//sort order
let sort = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  calcDisplayMovements(currentAccount.movements, !sort);
  sort = !sort;
});
