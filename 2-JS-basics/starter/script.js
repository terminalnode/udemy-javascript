bills = [124, 48, 268]

// function calculateTip(bill) {
//     if (bill < 50) {
//         return (bill * 0.2);
//     } else if (bill < 200) {
//         return (bill * 0.15);
//     }
//
//     return (bill * 0.10);
// }
//
// var tips = [];
// for (bill in bills) {
//     console.log(bill);
//     tips.push(calculateTip(bills[bill]));
// }
// console.log(bills);
// console.log(tips);

function sumArray(arr) {
    let sigma = 0;
    for (const val of arr) {
        sigma += val;
    }
    return sigma;
}

function calculateAverageTip(bill) {
    let tips = 0;
    let length = 0;

    for (const val of bill) {
        length += 1;
        if (val < 50) {
            tips += (val * 0.2);
        } else if (val < 200) {
            tips += (val * 0.15);
        } else {
            tips += (val * 0.10);
        }
    }

    let average = tips / length;
    return length === 0 ? 0 : average;
}

console.log(calculateAverageTip([]));
