export const cities = require('../data/cities.json');
export const types = require('../data/types.json');
export const items = require('../data/items.json');
export const item = require('../data/item.json');

export const fetchCities = (timeout) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(cities);
        }, timeout)
    }) 
} 

export const fetchTypes = (timeout) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(types);
        }, timeout)
    }) 
}

export const fetchItems = (timeout) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(items);
        }, timeout)
    }) 
}

export const fetchItem = (timeout) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(item);
        }, timeout)
    }) 
}