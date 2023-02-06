import * as _ from 'lodash'

const findOne = async (object) => {
    return await object[0] || null;
}

const groupArrObj = async ({ arr, groupBy, rootKey, valKey }) => {
    /* result = [
         {
             mainKey,
             groupKey: [{},{},...]
         },
         {
             mainKey,
             groupKey: [{},{},...]
         },
     ]*/
    return _.chain(arr).groupBy(groupBy).map((val, key) => ({ [rootKey]: key, [valKey]: val })).value()
}

export {
    findOne,
    groupArrObj
}