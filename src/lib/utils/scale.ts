import { scaleLinear } from "d3-scale";

export function createColorFunc(percentiles: number[], colorGradients: number[][]): (x: number) => number[] {
    if (percentiles.length == 0) {
        throw "there should at least one cut point";
    }

    if (colorGradients.length < percentiles.length) {
        throw "number of color gradients is less than the number of cut points";
    }

    return function (x: number): number[] {
        for (let i = 0; i < percentiles.length; i++) {
            if (x < percentiles[i]) {
                return colorGradients[i];
            }
        }
        return colorGradients[colorGradients.length - 1];
    }
}

export function createLinearizedHeighFunc(dataMax: number, maxHeight: number): (x: number) => number {
    return scaleLinear([0, dataMax], [0, maxHeight]);
}