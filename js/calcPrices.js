/*
function calculateBuyPrice() {
    const baseValue = coreDataInstance.getParams().baseValue;
    const globalZoneMult = coreDataInstance.getParams().buyParams.GlobalZoneMult;
    const specificItemMult = coreDataInstance.getParams().buyParams.SpecificItemMult;
    const speechLvl = coreDataInstance.getParams().engineSettings.speechLevel;
    const fBarterMax = coreDataInstance.getParams().engineSettings.fBarterMax;
    const fBarterMin = coreDataInstance.getParams().engineSettings.fBarterMin;
    const fBarterBuyMin = coreDataInstance.getParams().engineSettings.fBarterBuyMin;
    //const perkBonus = 0; // Inoring perks logic for now

    // --- STEP 1: CALCULATE PRICE FACTOR (The Speech Curve) ---
    // Formula: (Max - (Range * Skill%))
    // "3.3 - 1.3 * skill/100"
    debugger;
    const range = MathUtils.roundToPrecision(fBarterMax - fBarterMin, 1); // 1.3 with default values
    const skillPct = Math.min(speechLvl, 100) / 100;

    let priceFactor = MathUtils.roundToPrecision(fBarterMax - (range * skillPct), 1);

    // Clamp: Factor cannot go lower than Min (2.0)
    if (priceFactor < fBarterMin) priceFactor = fBarterMin;

    const vanillaValue = baseValue * priceFactor;

    const modMultiplier = 1 + (globalZoneMult - 1) + (specificItemMult - 1);
    // --- STEP 2: CALCULATE PLAYER BUYING PRICE ---
    //
    const finalValue = Math.floor( vanillaValue * modMultiplier)
        //calculateModMultipliers(vanillaValue,[globalZoneMult,specificItemMult]));

    // 2. Apply Vanilla Factor
    return finalValue;
}

function calculateSellPrice() {
    const baseValue = coreDataInstance.getParams().baseValue;
    const globalZoneMult = coreDataInstance.getParams().sellParams.GlobalZoneMult;
    const specificItemMult = coreDataInstance.getParams().sellParams.SpecificItemMult;
    const tradePartnerMult = coreDataInstance.getParams().sellParams.TradePartnerMult;
    const speechLvl = coreDataInstance.getParams().engineSettings.speechLevel;
    const fBarterMax = coreDataInstance.getParams().engineSettings.fBarterMax;
    const fBarterMin = coreDataInstance.getParams().engineSettings.fBarterMin;
    const fBarterSellMax = coreDataInstance.getParams().engineSettings.fBarterSellMax;
    const fBarterBuyMin = coreDataInstance.getParams().engineSettings.fBarterBuyMin;
    //const perkBonus = 0; // Inoring perks logic for now

    // --- STEP 1: CALCULATE PRICE FACTOR (The Speech Curve) ---
    // Formula: (Max - (Range * Skill%))
    // "3.3 - 1.3 * skill/100"
    const range = MathUtils.roundToPrecision( fBarterMax - fBarterMin, 1 ); // 1.3
    const skillPct = Math.min(speechLvl, 100) / 100;
    debugger;
    let priceFactor = MathUtils.roundToPrecision( fBarterMax - (range * skillPct), 1 );

    // Clamp: Factor cannot go lower than Min (2.0)
    if (priceFactor < fBarterMin) priceFactor = fBarterMin;

    // 2. Apply Vanilla Factor
    // "Merchants buy for 1/X of base price"
    let vanillaValue =  baseValue / priceFactor;

    // 3. Apply Engine Hard Cap
    const hardCap = baseValue * fBarterSellMax;

    vanillaValue = Math.min(vanillaValue,hardCap);

    // --- STEP 2: CALCULATE PLAYER SELLING PRICE ---
    // 1. Apply Mod Multipliers (Zone + Partner)
    const modMultiplier = 1 + (globalZoneMult - 1) + (specificItemMult - 1) + (tradePartnerMult - 1);

    const moddedSellValue = Math.floor(vanillaValue*modMultiplier);

    return moddedSellValue;
}

const MathUtils = {
    roundToPrecision: function(subject, precision) {
        return +((+subject).toFixed(precision));
    }
}; */

// --- HELPER: Calculate the Price Factor (Speech Curve) ---
function getPriceFactor(coreDataInstance) {
    const speechLvl = coreDataInstance.getParams().engineSettings.speechLevel;
    const fBarterMax = coreDataInstance.getParams().engineSettings.fBarterMax;
    const fBarterMin = coreDataInstance.getParams().engineSettings.fBarterMin;

    const range = MathUtils.roundToPrecision(fBarterMax - fBarterMin, 1);
    const skillPct = Math.min(speechLvl, 100) / 100;

    let priceFactor = MathUtils.roundToPrecision(fBarterMax - (range * skillPct), 1);

    // Clamp: Factor cannot go lower than Min
    return Math.max(priceFactor, fBarterMin);
}

// --- HELPER: Calculate Additive Multiplier Stack ---
function getStackedMultiplier(multipliersArray) {
    // Start at 1.0, then add the difference of each multiplier
    return 1 + multipliersArray.reduce((acc, val) => acc + (val - 1), 0);
}

function calculateBuyPrice() {
    const baseValue = coreDataInstance.getParams().baseValue;
    const buyParams = coreDataInstance.getParams().buyParams;
    
    // 1. Get Vanilla Price Factor
    const priceFactor = getPriceFactor(coreDataInstance);

    // 2. Calculate Unrounded Vanilla Value
    const vanillaValue = baseValue * priceFactor;

    // 3. Calculate Stacked Mod Multiplier
    const modMultiplier = getStackedMultiplier([
        buyParams.GlobalZoneMult, 
        buyParams.SpecificItemMult
    ]);

    // 4. Final Calculation (Floor at the very end)
    return Math.floor(vanillaValue * modMultiplier);
}

function calculateSellPrice() {
    const baseValue = coreDataInstance.getParams().baseValue;
    const sellParams = coreDataInstance.getParams().sellParams;
    const fBarterSellMax = coreDataInstance.getParams().engineSettings.fBarterSellMax;

    // 1. Get Vanilla Price Factor
    const priceFactor = getPriceFactor(coreDataInstance);

    // 2. Calculate Unrounded Vanilla Value
    let vanillaValue = baseValue / priceFactor;

    // 3. Apply Engine Hard Cap (Sell value cap)
    const hardCap = baseValue * fBarterSellMax;
    vanillaValue = Math.min(vanillaValue, hardCap);

    // 4. Calculate Stacked Mod Multiplier
    const modMultiplier = getStackedMultiplier([
        sellParams.GlobalZoneMult, 
        sellParams.SpecificItemMult,
        sellParams.TradePartnerMult
    ]);

    // 5. Final Calculation
    return Math.floor(vanillaValue * modMultiplier);
}

const MathUtils = {
    roundToPrecision: function(subject, precision) {
        return +((+subject).toFixed(precision));
    }
};