function toInt(value) {
    return parseInt(value) | 0;
}

function updateValue(eventType, inputId) {
    if (eventType == null || inputId == null) {
        return;
    }

    let input = document.getElementById(inputId);
    let intValue = toInt(input.value);

    if (eventType == '+') {
        intValue++;
    }
    else if (eventType == '-' && intValue > 0) {
        intValue--;
    }

    input.value = intValue;

    syncData();
}

function applyDiscount(discountPercentage, value) {
    if (discountPercentage == null || value == null) {
        return 0;
    }

    let discount = value * discountPercentage / 100;
    let netValue = value - discount;

    return netValue > 0 ? netValue : 0;
}

function syncData() {
    const inputDiscountPercentage = document.getElementById('inputDiscountPercentage');
    const inputInitialPoints = document.getElementById('inputInitialPoints');
    const inputBattlesToWin = document.getElementById('inputBattlesToWin');
    const inputQuantities = document.querySelectorAll(".quantities");
    const microchips = document.querySelectorAll(".microchips");
    const upgradeTokens = document.querySelectorAll(".upgrade-tokens");
    const points = document.querySelectorAll(".points");
    const totalQuantity = document.getElementById('totalQuantity');
    const totalMicrochipCost = document.getElementById('totalMicrochipsCost');
    const totalUpgradeTokenCost = document.getElementById('totalUpgradeTokensCost');
    const totalPoints = document.getElementById('totalPoints');
    let intInitialPoints = 0, intDiscountPercentage = 0, intBattlesToWinPoints = 0;
    let intQuantity = 0, intMicrochips = 0, intUpgradeTokens = 0, intPoints = 0;
    let intTotalQuantity = 0, intTotalMicrochipCost = 0, intTotalUpgradeTokenCost = 0, intTotalPoints = 0;
    let i, index;

    // Get absolute value of discount percentage.
    intDiscountPercentage = Math.abs(toInt(inputDiscountPercentage.value));

    for (i = 1; i < DS_DRONE_UPGRADES.length; i++) {
        index = i - 1;
        // Calculate quantity, microchips, upgrade tokens, and points.
        intQuantity = toInt(inputQuantities[index].value);
        intMicrochips = Math.round(applyDiscount(intDiscountPercentage, DS_DRONE_UPGRADES[i].microchips * intQuantity));
        intUpgradeTokens = Math.round(applyDiscount(intDiscountPercentage, DS_DRONE_UPGRADES[i].upgradeTokens * intQuantity));
        intPoints = DS_DRONE_UPGRADES[i].points.stunningDrones * intQuantity;

        // Set microchips, upgrade tokens, and  points.
        microchips[index].textContent = intMicrochips;
        upgradeTokens[index].textContent = intUpgradeTokens;
        points[index].textContent = intPoints;

        // Total up the quantity, microchip cost, upgrade token cost and total points. 
        intTotalQuantity += intQuantity;
        intTotalMicrochipCost += intMicrochips;
        intTotalUpgradeTokenCost += intUpgradeTokens;
        intTotalPoints += intPoints;
    }
    // Calculate total points.
    intInitialPoints = toInt(inputInitialPoints.value);
    intBattlesToWinPoints = toInt(inputBattlesToWin.value) * 10;
    intTotalPoints += intInitialPoints + intBattlesToWinPoints;

    // Set total quantity, total microchip cost, total upgrade token cost and total points.
    totalQuantity.textContent = intTotalQuantity;
    totalMicrochipCost.textContent = intTotalMicrochipCost;
    totalUpgradeTokenCost.textContent = intTotalUpgradeTokenCost;
    totalPoints.textContent = intTotalPoints;
}

function resetModifier() {
    const inputDiscountPercentage = document.getElementById('inputDiscountPercentage');
    const inputInitialPoints = document.getElementById('inputInitialPoints');
    const inputBattlesToWin = document.getElementById('inputBattlesToWin');

    inputDiscountPercentage.value = 0;
    inputInitialPoints.value = 0;
    inputBattlesToWin.value = 0;
    syncData();
}

function resetDroneUpgrades() {
    const inputQuantities = document.querySelectorAll(".quantities");

    inputQuantities.forEach(input => input.value = 0);
    syncData();
}

function init() {
    const droneUpgradeContainer = document.getElementById('droneUpgradeContainer');
    let droneUpgradeContainerInnerHTML = '';
    let i;

    if (DS_DRONE_UPGRADES.length != 12) {
        throw new Error("Drone upgrades length is " + DS_DRONE_UPGRADES.length + ", expected 12!");
    }

    for (i = 1; i < DS_DRONE_UPGRADES.length; i++) {
        droneUpgradeContainerInnerHTML += '<div class="col-md-6 col-xxl-4">' +
            '<div class="item">' + '<div class="row align-items-center">' +
            '<div class="col">' + '<div class="item-title">Level&nbsp;' + DS_DRONE_UPGRADES[i].level + '</div>' +
            '</div>' +
            '<div class="col">' +
            '<div class="input-group">' +
            '<button type="button" class="btn btn-danger" onclick="updateValue(\'-\', \'upgradeQuantity_' + i + '\')">-</button>' +
            '<input id="upgradeQuantity_' + i + '" type="number" class="form-control quantities" min="0" value="0" oninput="syncData()">' +
            '<button type="button" class="btn btn-success" onclick="updateValue(\'+\', \'upgradeQuantity_' + i + '\')">+</button>' +
            '</div>' +
            '</div>' +
            '<div class="col-12">' +
            '<div class="d-flex flex-wrap gap-1 mt-2">' +
            '<span class="badge bg-light text-dark border"><span id="microchipsCost_' + i + '" class="microchips">0</span> Microchips</span>' +
            '<span class="badge bg-light text-dark border"><span id="upgradeTokensCost_' + i + '" class="upgrade-tokens">0</span> Upgrade Tokens</span>' +
            '<span class="badge bg-light text-dark border"><span id="points_' + i + '" class="points">0</span> Points</span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
    }

    droneUpgradeContainer.innerHTML = droneUpgradeContainerInnerHTML;

    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
}

init();