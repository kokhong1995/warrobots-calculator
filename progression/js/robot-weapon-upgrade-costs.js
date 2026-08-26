import { toInt, thousandSeperator, getStrLevel, getStrAmount, getStrDuration } from '/warrobots-calculator/js/data-helper.js?v=1.8.0';
import { resetInputs, updateNumberInput } from '/warrobots-calculator/js/input-helper.js?v=1.8.0';
import { applyUpgradeDiscountPercentage } from '/warrobots-calculator/js/modifier-helper.js?v=1.8.0';

function updateInputValue(eventType, inputId) {
    updateNumberInput(eventType, inputId, syncData);
}

function syncData() {
    const inputUpgradeDiscountPercentage = document.getElementById('inputUpgradeDiscountPercentage');
    const spanTotalQuantity = document.getElementById('totalQuantity');
    const spanTotalSilverAmount = document.getElementById('totalSilverAmount');
    const spanTotalGoldAmount = document.getElementById('totalGoldAmount');
    const spanTotalUpgradeDuration = document.getElementById("totalUpgradeDuration");
    const spanTotalUpgradeTokens = document.getElementById('totalUpgradeTokens');
    let inputQuantity, spanSilverAmount, spanGoldAmount, spanUpgradeDuration, spanUpgradeTokens;
    let upgradeDiscountPercentage = 0;
    let quantity = 0, silverAmount = 0, goldAmount = 0, upgradeDuration = 0, upgradeTokens = 0;
    let totalQuantity = 0, totalSilverAmount = 0, totalGoldAmount = 0, totalUpgradeDuration = 0, totalUpgradeTokens = 0;
    let i;

    upgradeDiscountPercentage = Math.abs(toInt(inputUpgradeDiscountPercentage.value));

    for (i = 0; i < DS_T4_ROBOT_WEAPON_UPGRADES.length; i++) {
        if ((DS_T4_ROBOT_WEAPON_UPGRADES[i].mark == 1 && DS_T4_ROBOT_WEAPON_UPGRADES[i].level == 1) ||
            (DS_T4_ROBOT_WEAPON_UPGRADES[i].mark == 2 && DS_T4_ROBOT_WEAPON_UPGRADES[i].level == 1)
        ) {
            continue;
        }

        inputQuantity = document.getElementById('quantity_' + i);
        spanSilverAmount = document.getElementById('silverAmount_' + i);
        spanGoldAmount = document.getElementById('goldAmount_' + i);
        spanUpgradeDuration = document.getElementById('upgradeDuration_' + i);
        spanUpgradeTokens = document.getElementById('upgradeTokens_' + i);

        quantity = toInt(inputQuantity.value);
        silverAmount = applyUpgradeDiscountPercentage(upgradeDiscountPercentage, DS_T4_ROBOT_WEAPON_UPGRADES[i].silverAmount) * quantity;
        goldAmount = DS_T4_ROBOT_WEAPON_UPGRADES[i].goldAmount * quantity;
        upgradeDuration = DS_T4_ROBOT_WEAPON_UPGRADES[i].upgradeDurationSeconds * quantity;
        upgradeTokens = DS_T4_ROBOT_WEAPON_UPGRADES[i].upgradeTokens * quantity;

        spanSilverAmount.textContent = getStrAmount(silverAmount);
        spanSilverAmount.parentElement.title = thousandSeperator(silverAmount, ' ') + ' Silver';
        spanGoldAmount.textContent = getStrAmount(goldAmount);
        spanGoldAmount.parentElement.title = thousandSeperator(goldAmount, ' ') + ' Gold';
        spanUpgradeDuration.textContent = getStrDuration(upgradeDuration);
        spanUpgradeTokens.textContent = upgradeTokens;

        totalQuantity += quantity;
        totalSilverAmount += silverAmount;
        totalGoldAmount += goldAmount;
        totalUpgradeDuration += upgradeDuration;
        totalUpgradeTokens += upgradeTokens;
    }

    spanTotalQuantity.textContent = totalQuantity;
    spanTotalSilverAmount.textContent = getStrAmount(totalSilverAmount);
    spanTotalSilverAmount.title = thousandSeperator(totalSilverAmount, ' ') + ' Silver';
    spanTotalGoldAmount.textContent = getStrAmount(totalGoldAmount);
    spanTotalGoldAmount.title = thousandSeperator(totalGoldAmount, ' ') + ' Gold';
    spanTotalUpgradeDuration.textContent = getStrDuration(totalUpgradeDuration);
    spanTotalUpgradeTokens.textContent = totalUpgradeTokens;
}

function resetModifiers() {
    resetInputs(['#inputUpgradeDiscountPercentage'], 0, syncData);
}

function resetUpgrades() {
    resetInputs(['#upgradeContainer .quantities'], 0, syncData);
}

function presetUpgrade(type) {
    let inputQuantity;
    let quantity = 0;
    let i;

    for (i = 0; i < DS_T4_ROBOT_WEAPON_UPGRADES.length; i++) {
        if ((DS_T4_ROBOT_WEAPON_UPGRADES[i].mark == 1 && DS_T4_ROBOT_WEAPON_UPGRADES[i].level == 1) ||
            (DS_T4_ROBOT_WEAPON_UPGRADES[i].mark == 2 && DS_T4_ROBOT_WEAPON_UPGRADES[i].level == 1)
        ) {
            continue;
        }

        // MK1 to MK2.
        if (type == 1) {
            // Skip MK2 : Level 0 above.
            if (DS_T4_ROBOT_WEAPON_UPGRADES[i].mark == 2 &&
                DS_T4_ROBOT_WEAPON_UPGRADES[i].level > 0) {
                continue;
            }
            // Skip all MK3.
            else if (DS_T4_ROBOT_WEAPON_UPGRADES[i].mark == 3) {
                continue;
            }
        }
        // MK2 to MK3.
        else {
            // Skip all MK1.
            if (DS_T4_ROBOT_WEAPON_UPGRADES[i].mark == 1) {
                continue;
            }
            // Skip MK2: Level 0 only.
            else if (DS_T4_ROBOT_WEAPON_UPGRADES[i].mark == 2 &&
                DS_T4_ROBOT_WEAPON_UPGRADES[i].level == 0) {
                continue;
            }
        }

        inputQuantity = document.getElementById('quantity_' + i);
        quantity = toInt(inputQuantity.value);
        inputQuantity.value = ++quantity;
    }

    syncData();
}

function init() {
    const upgradeContainer = document.getElementById('upgradeContainer');
    let upgradeContainerInnerHTML = '';
    let i;

    for (i = 0; i < DS_T4_ROBOT_WEAPON_UPGRADES.length; i++) {
        if ((DS_T4_ROBOT_WEAPON_UPGRADES[i].mark == 1 && DS_T4_ROBOT_WEAPON_UPGRADES[i].level == 1) ||
            (DS_T4_ROBOT_WEAPON_UPGRADES[i].mark == 2 && DS_T4_ROBOT_WEAPON_UPGRADES[i].level == 1)
        ) {
            continue;
        }

        upgradeContainerInnerHTML += '<div class="col-md-6">' +
            '<div class="item">' + '<div class="row align-items-center">' +
            '<div class="col">' + '<div class="item-title">' + getStrLevel(DS_T4_ROBOT_WEAPON_UPGRADES[i].mark, DS_T4_ROBOT_WEAPON_UPGRADES[i].level) + '</div>' +
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

    upgradeContainer.innerHTML = upgradeContainerInnerHTML;

    // Set click event listener.
    document.getElementById('mainContainer').addEventListener('click', (e) => {
        if (e.target.matches('#buttonResetModifiers')) {
            resetModifiers();
        }
        if (e.target.matches('#buttonResetUpgrades')) {
            resetUpgrades();
        }
        if (e.target.matches('#buttonPresetUpgrade1')) {
            presetUpgrade(1);
        }
        if (e.target.matches('#buttonPresetUpgrade2')) {
            presetUpgrade(2);
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