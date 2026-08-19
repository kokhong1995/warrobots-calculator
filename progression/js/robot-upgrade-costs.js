function toInt(value) {
    return parseInt(value) || 0;
}

function toFloat(value) {
    return parseFloat(value) || 0;
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

function applyDiscount(upgradeDiscountPercentage, value) {
    if (upgradeDiscountPercentage == null || value == null) {
        return 0;
    }

    let discount = value * upgradeDiscountPercentage / 100;
    let netValue = value - discount;

    return netValue > 0 ? netValue : 0;
}

function applySpeedBoost(speed, seconds) {
    if (speed > 0) {
        return seconds / speed;
    }
    else {
        return seconds;
    }
}

function getStrRobotLevel(mark, level) {
    return 'MK' + mark + (level === 0 ? '' : ('- Level ' + level));
}

function thousandSeperator(value, seperator) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, seperator);
}

function getStrAmount(amount) {
    if (amount >= 1000000) {
        return (amount / 1000000) + 'M';
    }
    else if (amount >= 100000) {
        return (amount / 1000) + 'K';
    }
    else {
        return amount;
    }
}

function getStrTime(seconds) {
    // Return empty string if input is invalid, non-numeric, negative, or not finite
    if (typeof seconds !== 'number' || isNaN(seconds) || seconds <= 0 || !isFinite(seconds)) {
        return '0';
    }

    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const parts = [];

    if (days > 0) {
        parts.push(days + 'd');
    }
    if (hours > 0) {
        parts.push(hours + 'h');
    }
    if (minutes > 0) {
        parts.push(minutes + 'm');
    }
    if (secs > 0) {
        parts.push(secs + 's');
    }

    return parts.join(' ') || 0;
}

function syncData() {
    const inputRobotUpgradeDiscountPercentage = document.getElementById('inputRobotUpgradeDiscountPercentage');
    const inputRobotUpgradeSpeedMultiplier = document.getElementById('inputRobotUpgradeSpeedMultiplier');
    const spanTotalQuantity = document.getElementById('totalQuantity');
    const spanTotalSilverAmount = document.getElementById('totalSilverAmount');
    const spanTotalGoldAmount = document.getElementById('totalGoldAmount');
    const spanTotalUpgradeDuration = document.getElementById("totalUpgradeDuration");
    const spanTotalUpgradeTokens = document.getElementById('totalUpgradeTokens');
    let inputQuantity, spanSilverAmount, spanGoldAmount, spanUpgradeDuration, spanUpgradeTokens;
    let upgradeDiscountPercentage = 0, upgradeSpeedMultiplier = 0;
    let quantity = 0, silverAmount = 0, goldAmount = 0, upgradeDuration = 0, upgradeTokens = 0;
    let totalQuantity = 0, totalSilverAmount = 0, totalGoldAmount = 0, totalUpgradeDuration = 0, totalUpgradeTokens = 0;
    let i;

    // // Get absolute value of discount percentage.
    upgradeDiscountPercentage = Math.abs(toInt(inputRobotUpgradeDiscountPercentage.value));
    upgradeSpeedMultiplier = Math.abs(toFloat(inputRobotUpgradeSpeedMultiplier.value));

    for (i = 0; i < DS_T4_ROBOT_UPGRADES.length; i++) {
        if ((DS_T4_ROBOT_UPGRADES[i].mark == 1 && DS_T4_ROBOT_UPGRADES[i].level == 1) ||
            (DS_T4_ROBOT_UPGRADES[i].mark == 2 && DS_T4_ROBOT_UPGRADES[i].level == 1)
        ) {
            continue;
        }

        inputQuantity = document.getElementById('upgradeQuantity_' + i);
        spanSilverAmount = document.getElementById('silverAmount_' + i);
        spanGoldAmount = document.getElementById('goldAmount_' + i);
        spanUpgradeDuration = document.getElementById('upgradeDuration_' + i);
        spanUpgradeTokens = document.getElementById('upgradeTokens_' + i);

        // Calculate quantity, silver amount, gold amount, upgrade time and upgrade tokens.
        quantity = toInt(inputQuantity.value);
        silverAmount = Math.round(applyDiscount(upgradeDiscountPercentage, DS_T4_ROBOT_UPGRADES[i].silverAmount) * quantity);
        goldAmount = Math.round(applyDiscount(upgradeDiscountPercentage, DS_T4_ROBOT_UPGRADES[i].goldAmount) * quantity);
        upgradeDuration = applySpeedBoost(upgradeSpeedMultiplier, DS_T4_ROBOT_UPGRADES[i].upgradeDurationSeconds) * quantity;
        upgradeTokens = Math.round(applyDiscount(upgradeDiscountPercentage, DS_T4_ROBOT_UPGRADES[i].upgradeTokens) * quantity);

        // Set silver amount, gold amount, upgrade time and upgrade tokens.
        spanSilverAmount.textContent = getStrAmount(silverAmount);
        spanSilverAmount.parentElement.title = thousandSeperator(silverAmount, ' ') + ' Silver';
        spanGoldAmount.textContent = getStrAmount(goldAmount);
        spanGoldAmount.parentElement.title = thousandSeperator(goldAmount, ' ') + ' Gold';
        spanUpgradeDuration.textContent = getStrTime(upgradeDuration);
        spanUpgradeTokens.textContent = upgradeTokens;

        // Total up quantity, silver amount, gold amount, upgrade time and upgrade tokens.
        totalQuantity += quantity;
        totalSilverAmount += silverAmount;
        totalGoldAmount += goldAmount;
        totalUpgradeDuration += upgradeDuration;
        totalUpgradeTokens += upgradeTokens;
    }

    // Set total quantity, total silver amount, total gold amount, total upgrade time and total upgrade tokens.
    spanTotalQuantity.textContent = totalQuantity;
    spanTotalSilverAmount.textContent = getStrAmount(totalSilverAmount);
    spanTotalSilverAmount.title = thousandSeperator(totalSilverAmount, ' ');
    spanTotalGoldAmount.textContent = getStrAmount(totalGoldAmount);
    spanTotalGoldAmount.title = thousandSeperator(totalGoldAmount, ' ');
    spanTotalUpgradeDuration.textContent = getStrTime(totalUpgradeDuration);
    spanTotalUpgradeTokens.textContent = totalUpgradeTokens;
}

function resetModifier() {
    const inputRobotUpgradeDiscountPercentage = document.getElementById('inputRobotUpgradeDiscountPercentage');
    const inputRobotUpgradeSpeedMultiplier = document.getElementById('inputRobotUpgradeSpeedMultiplier');

    inputRobotUpgradeDiscountPercentage.value = 0;
    inputRobotUpgradeSpeedMultiplier.value = 0;
    syncData();
}

function resetT4RobotUpgrades() {
    const inputQuantities = document.querySelectorAll("#t4RobotUpgradeContainer .quantities");

    inputQuantities.forEach(input => input.value = 0);
    syncData();
}

function init() {
    const t4RobotUpgradeContainer = document.getElementById('t4RobotUpgradeContainer');
    let t4RobotUpgradeContainerInnerHTML = '';
    let i;

    for (i = 0; i < DS_T4_ROBOT_UPGRADES.length; i++) {
        if ((DS_T4_ROBOT_UPGRADES[i].mark == 1 && DS_T4_ROBOT_UPGRADES[i].level == 1) ||
            (DS_T4_ROBOT_UPGRADES[i].mark == 2 && DS_T4_ROBOT_UPGRADES[i].level == 1)
        ) {
            continue;
        }

        t4RobotUpgradeContainerInnerHTML += '<div class="col-md-6 col-xxl-4">' +
            '<div class="item">' + '<div class="row align-items-center">' +
            '<div class="col">' + '<div class="item-title">' + getStrRobotLevel(DS_T4_ROBOT_UPGRADES[i].mark, DS_T4_ROBOT_UPGRADES[i].level) + '</div>' +
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
            '<span class="badge bg-light text-dark border">Silver: <span id="silverAmount_' + i + '" class="silver-amount">0</span></span>' +
            '<span class="badge bg-light text-dark border">Gold: <span id="goldAmount_' + i + '" class="gold-amount">0</span></span>' +
            '<span class="badge bg-light text-dark border">Upgrade Duration: <span id="upgradeDuration_' + i + '" class="upgrade-duration">0</span></span>' +
            '<span class="badge bg-light text-dark border">Upgrade Tokens: <span id="upgradeTokens_' + i + '" class="upgrade-tokens">0</span></span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
    }

    t4RobotUpgradeContainer.innerHTML = t4RobotUpgradeContainerInnerHTML;
}

init();