const currencies = {
  PENNY: 0.01,
  NICKEL: 0.05,
  DIME: 0.1,
  QUARTER: 0.25,
  ONE: 1,
  FIVE: 5,
  TEN: 10,
  TWENTY: 20,
  "ONE HUNDRED": 100,
};

function checkCashRegister(price, cash, cid) {
  let change = cash - price;

  let totalInCashRegister = cid.reduce((acc, curr) => acc + curr[1] * 100, 0);

  totalInCashRegister /= 100;

  if (totalInCashRegister < change) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  if (totalInCashRegister === change) {
    return { status: "CLOSED", change: cid };
  }

  let changeForClient = [];

  for (let i = cid.length - 1; i >= 0; i--) {
    let unitOfBanknote = currencies[cid[i][0]];
    let countOfBanknote = cid[i][1] / unitOfBanknote;
    let forClient = 0;

    while (countOfBanknote > 0 && change >= unitOfBanknote) {
      forClient += unitOfBanknote;
      countOfBanknote--;
      change = Math.round((change - unitOfBanknote) * 100) / 100;
    }

    if (forClient > 0) {
      changeForClient.push([cid[i][0], forClient]);
    }
  }

  if (change > 0) {
    return { status: "INSUFFICIENT_FUNDS", change: [] };
  }

  return { status: "OPEN", change: changeForClient };
}

function testCheckCashRegister(expected, actual) {
  console.log(
    JSON.stringify(expected) === JSON.stringify(actual) ? "Passed" : "Failed"
  );
}

function runTests() {
  testCheckCashRegister(
    { status: "OPEN", change: [["QUARTER", 0.5]] },
    checkCashRegister(19.5, 20, [
      ["PENNY", 1.01],
      ["NICKEL", 2.05],
      ["DIME", 3.1],
      ["QUARTER", 4.25],
      ["ONE", 90],
      ["FIVE", 55],
      ["TEN", 20],
      ["TWENTY", 60],
      ["ONE HUNDRED", 100],
    ])
  );

  testCheckCashRegister(
    {
      status: "OPEN",
      change: [
        ["TWENTY", 60],
        ["TEN", 20],
        ["FIVE", 15],
        ["ONE", 1],
        ["QUARTER", 0.5],
        ["DIME", 0.2],
        ["PENNY", 0.04],
      ],
    },
    checkCashRegister(3.26, 100, [
      ["PENNY", 1.01],
      ["NICKEL", 2.05],
      ["DIME", 3.1],
      ["QUARTER", 4.25],
      ["ONE", 90],
      ["FIVE", 55],
      ["TEN", 20],
      ["TWENTY", 60],
      ["ONE HUNDRED", 100],
    ])
  );

  testCheckCashRegister(
    { status: "INSUFFICIENT_FUNDS", change: [] },
    checkCashRegister(19.5, 20, [
      ["PENNY", 0.01],
      ["NICKEL", 0],
      ["DIME", 0],
      ["QUARTER", 0],
      ["ONE", 0],
      ["FIVE", 0],
      ["TEN", 0],
      ["TWENTY", 0],
      ["ONE HUNDRED", 0],
    ])
  );

  testCheckCashRegister(
    { status: "INSUFFICIENT_FUNDS", change: [] },
    checkCashRegister(19.5, 20, [
      ["PENNY", 0.01],
      ["NICKEL", 0],
      ["DIME", 0],
      ["QUARTER", 0],
      ["ONE", 1],
      ["FIVE", 0],
      ["TEN", 0],
      ["TWENTY", 0],
      ["ONE HUNDRED", 0],
    ])
  );

  testCheckCashRegister(
    {
      status: "CLOSED",
      change: [
        ["PENNY", 0.5],
        ["NICKEL", 0],
        ["DIME", 0],
        ["QUARTER", 0],
        ["ONE", 0],
        ["FIVE", 0],
        ["TEN", 0],
        ["TWENTY", 0],
        ["ONE HUNDRED", 0],
      ],
    },
    checkCashRegister(19.5, 20, [
      ["PENNY", 0.5],
      ["NICKEL", 0],
      ["DIME", 0],
      ["QUARTER", 0],
      ["ONE", 0],
      ["FIVE", 0],
      ["TEN", 0],
      ["TWENTY", 0],
      ["ONE HUNDRED", 0],
    ])
  );
}

runTests();
