export function getIndex(arr : Array<any>, obj : any, firstProp : string = 'id', secondProp : string = 'id') : number {
    return arr.indexOf(arr.find((currentObj : any) => currentObj[firstProp] === obj[secondProp]));
}