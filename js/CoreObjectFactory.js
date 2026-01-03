const coreData = () => {
    let params = {
        baseValue: 10,
        buyParams: {
            GlobalZoneMult: 1.0,
            SpecificItemMult: 1.0
        },
        sellParams: {
            GlobalZoneMult: 1.0,
            SpecificItemMult: 1.0,
            TradePartnerMult: 1.0
        },
        engineSettings: {
            speechLevel: 100,
            fBarterMax: 3.3,
            fBarterMin: 2.0,
            fBarterSellMax: 0.95,
            fBarterBuyMin: 0.0
        }
    }
    const getParams = () => {
        return JSON.parse(JSON.stringify(params));
    };

    const setBaseValue = (value) => {
        params.baseValue = value;
    }

    const setBuyGlobalZoneMult = (value) => {
        params.buyParams.GlobalZoneMult = value;
    }

    const setBuySpecificItemMult = (value) => {
        params.buyParams.SpecificItemMult = value;
    }

    const setSellGlobalZoneMult = (value) => {
        params.sellParams.GlobalZoneMult = value;
    }

    const setSellSpecificItemMult = (value) => {
        params.sellParams.SpecificItemMult = value;
    }

    const setTradePartnerMult = (value) => {
        params.sellParams.TradePartnerMult = value;
    }

    const setEngineSetting = (settingKey, value) => {
        if (params.engineSettings.hasOwnProperty(settingKey)) {
            params.engineSettings[settingKey] = value;
        }
    }

    const setParamById = (paramId, value) => {
        switch (paramId) {
            case "basbase-value-input":
                setBaseValue(value);
                break;
            case "buying-zone-select":
                setBuyGlobalZoneMult(value);
                break;
            case "specific-buying-mult":
                setBuySpecificItemMult(value);
                break;
            case "selling-zone-select":
                setSellGlobalZoneMult(value);
                break;
            case "specific-selling-mult":
                setSellSpecificItemMult(value);
                break;
            case "partner-mult":
                setTradePartnerMult(value);
                break;
            case "lvl-slider":
                setEngineSetting('speechLevel', value);
                break;
            case "fBarterMax":
                setEngineSetting('fBarterMax', value);
                break;
            case "fBarterMin":
                setEngineSetting('fBarterMin', value);
                break;
            case "fBarterSellMax":
                setEngineSetting('fBarterSellMax', value);
                break;
            case "fBarterBuyMin":
                setEngineSetting('fBarterBuyMin', value);
                break;
            default:
                console.warn("Unknown parameter ID:", paramId);
        }
    }

    return { getParams, setBaseValue, setBuyGlobalZoneMult, setBuySpecificItemMult, setSellGlobalZoneMult, setSellSpecificItemMult, setTradePartnerMult, setEngineSetting, setParamById}
}

const coreDataInstance = coreData();