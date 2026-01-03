const DBFactory = () => {
    let DB = [];

    const getDB = () => {
        return structuredClone(DB);
    }

    const setDB = (DBValue) => {
        DB = structuredClone(DBValue)
    }

    const getMultipliersByCity = (city) => {
        return structuredClone(DB.find(item => item.city==city));
    }

    const getMultipliersByKeyword = (keyword) => {
        return structuredClone(DB.find(item => item.multipliers.find(e => e.itemKeyword[0]==keyword)));
    }

    return {getDB, setDB, getMultipliersByCity, getMultipliersByKeyword}
}

const DBInstance = DBFactory();