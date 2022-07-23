const alphanumeric = /^[\w\d]+$/;

export function match(param: string): boolean {
    return alphanumeric.test(param);
}