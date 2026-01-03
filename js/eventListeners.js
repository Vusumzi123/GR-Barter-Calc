function initEventListeners() {
    // 1. Helper function for binding sliders
    // This handles finding the input/span and linking them
    const bindSlider = (containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return; // Safety check in case ID is missing

        const input = container.querySelector('input');
        const display = container.querySelector('span.val-display');

        input.addEventListener('input', (event) => {
            display.textContent = event.target.value;
            coreDataInstance.setParamById(event.target.parentElement.id, Number(event.target.value));
            // triggers global calculation
            calculate();

        });
    };

    // 2. Helper function for binding select dropdowns
    const bindSelect = (containerId, callback) => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const select = container.querySelector('select');
        select.addEventListener('change', (event) => {
            callback(event.target.value);
            calculate();
            //console.log(coreDataInstance.getParams());
        });
    };

    // 3. Helper Function for binding base Value Field
    const bindBaseValue = () => {
        const baseValueField = document.getElementById("base-value-input").querySelector('input');
        if (!baseValueField) return;

        baseValueField.addEventListener('input', (event) => {
            coreDataInstance.setBaseValue(Number(event.target.value));
            calculate();
            //console.log(coreDataInstance.getParams());
        });
    }

    // --- APPLY LISTENERS ---

    // Bind Dropdowns
    bindSelect("buying-zone-select", updateSpecificBuyMultiplier);
    bindSelect("selling-zone-select", updateSpecificSellMultiplier);
    bindSelect("specific-buying-mult", (value) => coreDataInstance.setBuySpecificItemMult(Number(value)));
    bindSelect("specific-selling-mult", (value) => coreDataInstance.setSellSpecificItemMult(Number(value)));
    bindSelect("partner-mult", (value) => coreDataInstance.setTradePartnerMult(Number(value)));

    sliderIds.forEach(bindSlider);

    bindBaseValue();
}

function calculate() {
    const totalSellPrice = calculateSellPrice();
    const totalBuyPrice = calculateBuyPrice();
    //console.log(`Buy Price: ${totalBuyPrice} | Sell Price: ${totalSellPrice}`); 
    updateResultFields(totalBuyPrice, totalSellPrice);
}