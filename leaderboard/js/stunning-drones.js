function toggleSection(event) {
    var sectionHeaders = document.getElementsByClassName("section-header-button");
    let sectionContentId;
    let i;
    let sectionContent;

    for (i = 0; i < sectionHeaders.length; i++) {
        sectionContentId = sectionHeaders[i].getAttribute('data-section-content').substring(1);
        sectionContent = document.getElementById(sectionContentId);
        console.log(sectionContentId);

        if (sectionHeaders[i].id === event.id) {
            sectionContent.classList.add('visible');
            sectionContent.parentElement.classList.add('active');
        }
        else {
            sectionContent.classList.remove('visible');
            sectionContent.parentElement.classList.remove('active');
        }
    }
}

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

    return value - discount;
}

function syncData() {
    let intInitialPoints = 0, intDiscountPercentage = 0, intBattlesToWinPoints = 0;
    let intQuantity = 0, intMicrochips = 0, intUpgradeTokens = 0, intPoints = 0;
    let intTotalQuantity = 0, intTotalMicrochipCost = 0, intTotalUpgradeTokenCost = 0, intTotalPoints = 0;
    let i;
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

    // Get absolute value of discount percentage.
    intDiscountPercentage = Math.abs(toInt(inputDiscountPercentage.value));

    if (droneUpgrades.length != inputQuantities.length) {
        return;
    }
    
    for (i = 0; i < droneUpgrades.length; i++) {
        // Calculate quantity, microchips, upgrade tokens, and points.
        intQuantity = toInt(inputQuantities[i].value);
        intMicrochips = applyDiscount(intDiscountPercentage, droneUpgrades[i].microchips * intQuantity);
        intUpgradeTokens = droneUpgrades[i].upgradeTokens * intQuantity;
        intPoints = droneUpgrades[i].leaderboardPoints * intQuantity;
        
        // Set microchips, upgrade tokens, and  points.
        microchips[i].textContent = intMicrochips;
        upgradeTokens[i].textContent = intUpgradeTokens;
        points[i].textContent = intPoints;

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

function resetAll() {
    const inputDiscountPercentage = document.getElementById('inputDiscountPercentage');
    const inputInitialPoints = document.getElementById('inputInitialPoints');
    const inputBattlesToWin = document.getElementById('inputBattlesToWin');
    const inputQuantities = document.querySelectorAll(".quantities");

    inputDiscountPercentage.value = 0;
    inputInitialPoints.value = 0;
    inputBattlesToWin.value = 0;
    inputQuantities.forEach(input => input.value = 0);

    syncData();
}

const droneUpgrades = [
    // {
    //     level: 1,
    //     microchips: 0,
    //     upgradeTokens: 0,
    //     leaderboardPoints: 0
    // },
    {
        level: 2,
        microchips: 40,
        upgradeTokens: 0,
        leaderboardPoints: 120
    },
    {
        level: 3,
        microchips: 60,
        upgradeTokens: 0,
        leaderboardPoints: 180
    },
    {
        level: 4,
        microchips: 90,
        upgradeTokens: 0,
        leaderboardPoints: 270
    },
    {
        level: 5,
        microchips: 100,
        upgradeTokens: 0,
        leaderboardPoints: 300
    },
    {
        level: 6,
        microchips: 100,
        upgradeTokens: 0,
        leaderboardPoints: 300
    },
    {
        level: 7,
        microchips: 100,
        upgradeTokens: 0,
        leaderboardPoints: 300
    },
    {
        level: 8,
        microchips: 120,
        upgradeTokens: 0,
        leaderboardPoints: 360
    },
    {
        level: 9,
        microchips: 120,
        upgradeTokens: 0,
        leaderboardPoints: 360
    },
    {
        level: 10,
        microchips: 130,
        upgradeTokens: 0,
        leaderboardPoints: 390
    },
    {
        level: 11,
        microchips: 140,
        upgradeTokens: 0,
        leaderboardPoints: 420
    },
    {
        level: 12,
        microchips: 0,
        upgradeTokens: 1,
        leaderboardPoints: 600
    }
];

var droneUpgradeContainerInnerHTML = '';
var droneUpgradeContainer = document.getElementById('droneUpgradeContainer');
var i;

for (i = 0; i < droneUpgrades.length; i++) {
    droneUpgradeContainerInnerHTML += '<div class="col-sm-6 col-lg-4 col-xl-3">' +
        '<div class="item">' + '<div class="row align-items-center">' +
        '<div class="col">' + '<div class="item-title">Level&nbsp;' + droneUpgrades[i].level + '</div>' +
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
