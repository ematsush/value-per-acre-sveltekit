export function addCommas(x: number) {
    const strNum = x.toString().split('.');
    let result = strNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    if (strNum.length > 1) {
        const decimals = strNum[1];
        result = result + '.' + decimals;
    }
    return result;
}

const suffixes = [
    '',
    'K',
    'M',
    'B',
    'T'
]

export function addSuffix(x: number) {
    let y = x;
    let i = 0;
    while (y >= 1000) {
        i += 1;
        y = y / 1000;
    }

    let j = 0;
    let z = y;
    while (z >= 1) {
        j++;
        z = z / 10;
    }

    y = Math.floor(y * (10 ** (3 - j))) / (10 ** (3 - j));
    return y.toString() + (i < 3 ? suffixes[i] : '');
}