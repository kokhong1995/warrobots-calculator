import { toInt, toFloat, thousandSeperator, getStrLevel, getStrAmount, getStrDuration } from '/warrobots-calculator/js/data-helper.js?v=1.7.1';
import { resetInputs, updateNumberInput } from '/warrobots-calculator/js/input-helper.js?v=1.7.1';
import { applyUpgradeDiscountPercentage, applyUpgradeSpeedMultiplier } from '/warrobots-calculator/js/modifier-helper.js?v=1.7.1';

function updateInputValue(eventType, inputId) {
    updateNumberInput(eventType, inputId, syncData);
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

    // Get values of modifier inputs.
    upgradeDiscountPercentage = Math.abs(toInt(inputRobotUpgradeDiscountPercentage.value));
    upgradeSpeedMultiplier = Math.abs(toFloat(inputRobotUpgradeSpeedMultiplier.value));

    for (i = 0; i < DS_T4_ROBOT_UPGRADES.length; i++) {
        if ((DS_T4_ROBOT_UPGRADES[i].mark == 1 && DS_T4_ROBOT_UPGRADES[i].level == 1) ||
            (DS_T4_ROBOT_UPGRADES[i].mark == 2 && DS_T4_ROBOT_UPGRADES[i].level == 1)
        ) {
            continue;
        }

        inputQuantity = document.getElementById('quantity_' + i);
        spanSilverAmount = document.getElementById('silverAmount_' + i);
        spanGoldAmount = document.getElementById('goldAmount_' + i);
        spanUpgradeDuration = document.getElementById('upgradeDuration_' + i);
        spanUpgradeTokens = document.getElementById('upgradeTokens_' + i);

        // Calculate quantity, silver amount, gold amount, upgrade duration and upgrade tokens.
        quantity = toInt(inputQuantity.value);
        silverAmount = applyUpgradeDiscountPercentage(upgradeDiscountPercentage, DS_T4_ROBOT_UPGRADES[i].silverAmount) * quantity;
        goldAmount = applyUpgradeDiscountPercentage(upgradeDiscountPercentage, DS_T4_ROBOT_UPGRADES[i].goldAmount) * quantity;
        upgradeDuration = applyUpgradeSpeedMultiplier(upgradeSpeedMultiplier, DS_T4_ROBOT_UPGRADES[i].upgradeDurationSeconds) * quantity;
        upgradeTokens = DS_T4_ROBOT_UPGRADES[i].upgradeTokens * quantity;

        // Set silver amount, gold amount, upgrade duration and upgrade tokens.
        spanSilverAmount.textContent = getStrAmount(silverAmount);
        spanSilverAmount.parentElement.title = thousandSeperator(silverAmount, ' ') + ' Silver';
        spanGoldAmount.textContent = getStrAmount(goldAmount);
        spanGoldAmount.parentElement.title = thousandSeperator(goldAmount, ' ') + ' Gold';
        spanUpgradeDuration.textContent = getStrDuration(upgradeDuration);
        spanUpgradeTokens.textContent = upgradeTokens;

        // Total up quantity, silver amount, gold amount, upgrade duration and upgrade tokens.
        totalQuantity += quantity;
        totalSilverAmount += silverAmount;
        totalGoldAmount += goldAmount;
        totalUpgradeDuration += upgradeDuration;
        totalUpgradeTokens += upgradeTokens;
    }

    // Set total quantity, total silver amount, total gold amount, total upgrade duration and total upgrade tokens.
    spanTotalQuantity.textContent = totalQuantity;
    spanTotalSilverAmount.textContent = getStrAmount(totalSilverAmount);
    spanTotalSilverAmount.title = thousandSeperator(totalSilverAmount, ' ') + ' Silver';
    spanTotalGoldAmount.textContent = getStrAmount(totalGoldAmount);
    spanTotalGoldAmount.title = thousandSeperator(totalGoldAmount, ' ') + ' Gold';
    spanTotalUpgradeDuration.textContent = getStrDuration(totalUpgradeDuration);
    spanTotalUpgradeTokens.textContent = totalUpgradeTokens;
}

function resetModifiers() {
    resetInputs([
        '#inputRobotUpgradeDiscountPercentage', '#inputRobotUpgradeSpeedMultiplier'
    ], 0, syncData);
}

function resetT4RobotUpgrades() {
    resetInputs([
        '#t4RobotUpgradeContainer .quantities'
    ], 0, syncData);
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

        t4RobotUpgradeContainerInnerHTML += '<div class="col-md-6">' +
            '<div class="item">' + '<div class="row align-items-center">' +
            '<div class="col">' + '<div class="item-title">' + getStrLevel(DS_T4_ROBOT_UPGRADES[i].mark, DS_T4_ROBOT_UPGRADES[i].level) + '</div>' +
            '</div>' +
            '<div class="col">' +
            '<div class="input-group">' +
            '<button type="button" class="btn btn-danger btn-decrement" data-wc-target="quantity_' + i + '">-</button>' +
            '<input id="quantity_' + i + '" type="number" class="form-control quantities sync-data" min="0" value="0">' +
            '<button type="button" class="btn btn-success btn-increment" data-wc-target="quantity_' + i + '">+</button>' +
            '</div>' +
            '</div>' +
            '<div class="col-12">' +
            '<div class="d-flex flex-wrap gap-1 mt-2">' +
            '<span class="badge bg-light text-dark border" title="0 Silver">Silver: <span id="silverAmount_' + i + '" class="silver-amount">0</span></span>' +
            '<span class="badge bg-light text-dark border" title="0 Gold">Gold: <span id="goldAmount_' + i + '" class="gold-amount">0</span></span>' +
            '<span class="badge bg-light text-dark border">Upgrade Duration: <span id="upgradeDuration_' + i + '" class="upgrade-duration">0</span></span>' +
            '<span class="badge bg-light text-dark border">Upgrade Tokens: <span id="upgradeTokens_' + i + '" class="upgrade-tokens">0</span></span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
    }

    t4RobotUpgradeContainer.innerHTML = t4RobotUpgradeContainerInnerHTML;

    // Set click event listener.
    document.getElementById('mainContainer').addEventListener('click', (e) => {
        if (e.target.matches('#buttonResetModifiers')) {
            resetModifiers();
        }
        if (e.target.matches('#buttonResetT4RobotUpgrades')) {
            resetT4RobotUpgrades();
        }
        if (e.target.matches('.btn-decrement')) {
            updateInputValue('-', e.target.dataset.wcTarget);
        }
        if (e.target.matches('.btn-increment')) {
            updateInputValue('+', e.target.dataset.wcTarget);
        }
    });
    // Set input event listener.
    document.getElementById('mainContainer').addEventListener('input', (e) => {
        if (e.target.matches('.sync-data')) {
            // Minimum value is 0.
            if (e.target.value < 0) {
                e.target.value = 0;
            }
            syncData();
        }
    });
}

init();