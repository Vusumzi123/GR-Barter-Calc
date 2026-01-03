

function populateGlobalZoneMultipliers() {
    const buySel = document.getElementById("buying-zone-select").querySelector('select');
    const sellSel = document.getElementById("selling-zone-select").querySelector('select');
    const DB = DBInstance.getDB();
    const cities = DB.filter(e => e.city !== "TradePartners");

    // Clear existing options
    buySel.innerHTML = "";
    sellSel.innerHTML = "";

    buySel.add(new Option("None 1.0x", "none"));
    sellSel.add(new Option("None 1.0x", "none"));
    //console.log(cities);
    // Populate with keys from the JSON files
    cities.forEach((e) => {
        //console.log(e);
        const city = e.city;
        const globalSurplus = e.multipliers.find(item => item.itemKeyword[0].includes("GlobalSurplus"));
        const GlobalDeficit = e.multipliers.find(item => item.itemKeyword[0].includes("GlobalDeficit"));
        const buySurplus = globalSurplus.buyMult;
        const sellSurplus = globalSurplus.sellMult;
        const buyDeficit = GlobalDeficit.buyMult;
        const sellDeficit = GlobalDeficit.sellMult;
        // Set the Selectors Values for Surplus
        buySel.add(new Option(`${city} Global Surplus ${buySurplus}x`, globalSurplus.itemKeyword[0]));
        sellSel.add(new Option(`${city} Global Surplus ${sellSurplus}x`, globalSurplus.itemKeyword[0]));
        // Set the Selectors Values for Deficit
        buySel.add(new Option(`${city} Global Deficit ${buyDeficit}x`, GlobalDeficit.itemKeyword[0]));
        sellSel.add(new Option(`${city} Global deficit ${sellDeficit}x`, GlobalDeficit.itemKeyword[0]));
    });

    //Clear Specific Item dropdowns
    clearSpecMult();
}

//Function to clear Specific multipliers
function clearSpecMult() {
    const specBuy = document.getElementById("specific-buying-mult").querySelector('select');
    const specSell = document.getElementById("specific-selling-mult").querySelector('select');
    specBuy.innerHTML = "";
    specSell.innerHTML = "";
    specBuy.add(new Option("No Specific Rule (1.0x)", 1));
    specSell.add(new Option("No Specific Rule (1.0x)", 1));
}

//Functions to update specific multipliers
function updateSpecificBuyMultiplier(selectedValue){
    //Clear Specific Item dropdown
    const specBuy = document.getElementById("specific-buying-mult").querySelector('select');
    specBuy.innerHTML = "";
    specBuy.add(new Option("No Specific Rule (1.0x)", 1.0));
    // If default value is selected GlobalZoneMult is set to 1.0 and execution ends
    if(selectedValue == "none") {
        coreDataInstance.setBuyGlobalZoneMult(1.0);
        coreDataInstance.setBuySpecificItemMult(1.0);
        return
    } 

    const city = DBInstance.getMultipliersByKeyword(selectedValue);
    // Removes the Global multipliers
    const multipliers = city.multipliers.filter( item => !item.itemKeyword[0].includes("GlobalSurplus") && !item.itemKeyword[0].includes("GlobalDeficit") );
    
    // Updates the coreData instance with selected value
    const globalBuyMult = city.multipliers.find(item => item.itemKeyword==selectedValue).buyMult;
    coreDataInstance.setBuyGlobalZoneMult(globalBuyMult);

    // Adds options based on the selected city
    for (const mult of multipliers) {
        specBuy.add(new Option( `${mult.itemKeyword} (${mult.buyMult}x)`, mult.buyMult ));
    }
};

function updateSpecificSellMultiplier(selectedValue){
    //Clear Specific Item dropdown
    const specSell = document.getElementById("specific-selling-mult").querySelector('select');
    specSell.innerHTML = "";
    specSell.add(new Option("No Specific Rule (1.0x)", 1));
    // If default value is selected GlobalZoneMult is set to 1.0 and execution ends
    if(selectedValue == "none") {
        coreDataInstance.setSellGlobalZoneMult(1.0);
        coreDataInstance.setSellSpecificItemMult(1.0);
        return
    } 

    const city = DBInstance.getMultipliersByKeyword(selectedValue);

    // Removes the Global multipliers
    const multipliers = city.multipliers.filter( item => !item.itemKeyword[0].includes("GlobalSurplus") && !item.itemKeyword[0].includes("GlobalDeficit") );

    // Updates the coreData instance with selected value
    const globalSellMult = city.multipliers.find(item => item.itemKeyword==selectedValue).sellMult;
    coreDataInstance.setSellGlobalZoneMult(globalSellMult);

    // Adds options based on the selected city
    for (const mult of multipliers) {
        specSell.add(new Option( `${mult.itemKeyword} (${mult.sellMult}x)`, mult.sellMult ));
    }
};

// Function to update the value of Specific Sell Multiplier when selected
function updateSpecificSellValue(value) {
    console.log(value);
    coreDataInstance.setSellSpecificItemMult(value);
}


// Function that Updates Partner Dropdown data
function populatePartnerDropdown() {
    const partnerMultSel = document.getElementById("partner-mult").querySelector('select');
    // Clears the dropdown
    partnerMultSel.innerHTML = "";
    partnerMultSel.add(new Option("None 1.0x", 1));

    const multipliers = DBInstance.getMultipliersByCity("TradePartners").multipliers;

    for (const element of multipliers) {
        partnerMultSel.add(new Option(`${element.conditions.vendorFactions[0]} (${element.sellMult})`, element.sellMult));
    }
}

// function to initialize all values accordinf to the data template
function initializeUIValues() {
    const lvlSlider = document.getElementById("lvl-slider").querySelector('input');
    const lvlSliderLbl = document.getElementById("lvl-slider").querySelector('span.val-display');
    lvlSlider.value = coreDataInstance.getParams().engineSettings.speechLevel;
    lvlSliderLbl.textContent = coreDataInstance.getParams().engineSettings.speechLevel;

    const barterMaxSlider = document.getElementById("fBarterMax").querySelector('input');
    const barterMaxSliderLbl = document.getElementById("fBarterMax").querySelector('span.val-display');
    barterMaxSlider.value = coreDataInstance.getParams().engineSettings.fBarterMax;
    barterMaxSliderLbl.textContent = coreDataInstance.getParams().engineSettings.fBarterMax;

    const barterMinSlider = document.getElementById("fBarterMin").querySelector('input');
    const barterMinSliderLbl = document.getElementById("fBarterMin").querySelector('span.val-display');
    barterMinSlider.value = coreDataInstance.getParams().engineSettings.fBarterMin;
    barterMinSliderLbl.textContent = coreDataInstance.getParams().engineSettings.fBarterMin;

    const barterSellMaxSlider = document.getElementById("fBarterSellMax").querySelector('input');
    const barterSellMaxSliderLbl = document.getElementById("fBarterSellMax").querySelector('span.val-display');
    barterSellMaxSlider.value = coreDataInstance.getParams().engineSettings.fBarterSellMax;
    barterSellMaxSliderLbl.textContent = coreDataInstance.getParams().engineSettings.fBarterSellMax;

    const barterBuyMinSlider = document.getElementById("fBarterBuyMin").querySelector('input');
    const barterBuyMinSliderLbl = document.getElementById("fBarterBuyMin").querySelector('span.val-display');
    barterBuyMinSlider.value = coreDataInstance.getParams().engineSettings.fBarterBuyMin;
    barterBuyMinSliderLbl.textContent = coreDataInstance.getParams().engineSettings.fBarterBuyMin;

    const baseValueInput = document.getElementById("base-value-input").querySelector('input');
    baseValueInput.value = coreDataInstance.getParams().baseValue;
}

// Function to update the value of the result fields
function updateResultFields(buyPrice, sellPrice) {
    const buyPriceField = document.getElementById("calculated-buy-price");
    const sellPriceField = document.getElementById("calculated-sell-price");
    buyPriceField.textContent = `${buyPrice}g`;
    sellPriceField.textContent = `${sellPrice}g`;
}
