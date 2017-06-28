export const normalizeData = (payload, initial = {dataMap: {}, aliases: []}) => {
    return payload.reduce((acc, item) => {
        return {
            ...acc, 
            dataMap: {...acc.dataMap, [item.id]: item},
            aliases: [...acc.aliases, {id: item.id, alias: item.alias}],
        }
    }, initial)
}

