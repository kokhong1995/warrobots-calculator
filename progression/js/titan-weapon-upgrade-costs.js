import { toInt, thousandSeperator, getStrAmount } from '/warrobots-calculator/js/data-helper.js?v=1.7.1';
import { resetInputs, updateNumberInput } from '/warrobots-calculator/js/input-helper.js?v=1.7.1';
import { applyUpgradeDiscountPercentage } from '/warrobots-calculator/js/modifier-helper.js?v=1.7.1';

function updateInputValue(eventType, inputId) {
    updateNumberInput(eventType, inputId, syncData);
}

function syncData() {
    const inputUpgradeDiscountPercentage = document.getElementById('inputUpgradeDiscountPercentage');
    const spanTotalQuantity = document.getElementById('totalQuantity');
    const spanTotalPlatinumAmount = document.getElementById("totalPlatinumAmount");
    let inputQuantity, spanPlatinumAmount;
    let upgradeDiscountPercentage = 0;
    let quantity = 0, platinumAmount = 0;
    let totalQuantity = 0, totalPlatinumAmount = 0;
    let i;

    // Get values of modifier inputs.
    upgradeDiscountPercentage = Math.abs(toInt(inputUpgradeDiscountPercentage.value));

    for (i = 0; i < DS_T4_TITAN_WEAPON_UPGRADES.length; i++) {
        if (DS_T4_TITAN_WEAPON_UPGRADES[i].level == 1) {
            continue;
        }

        inputQuantity = document.getElementById('t4TitanWeaponQuantity' + i);
        spanPlatinumAmount = document.getElementById('t4TitanWeaponPlatinumAmount' + i);

        // Calculate quantity and platinum amount.
        quantity = toInt(inputQuantity.value);
        platinumAmount = applyUpgradeDiscountPercentage(upgradeDiscountPercentage, DS_T4_TITAN_WEAPON_UPGRADES[i].platinumAmount) * quantity;

        // Set platinum amount.
        spanPlatinumAmount.textContent = getStrAmount(platinumAmount);
        spanPlatinumAmount.parentElement.title = thousandSeperator(platinumAmount, ' ') + ' Platinum';

        // Total up quantity and platinum amount.
        totalQuantity += quantity;
        totalPlatinumAmount += platinumAmount;
    }

    // Set total quantity, total silver amount, total gold amount, total upgrade duration and total upgrade tokens.
    spanTotalQuantity.textContent = totalQuantity;
    spanTotalPlatinumAmount.textContent = getStrAmount(totalPlatinumAmount);
    spanTotalPlatinumAmount.title = thousandSeperator(totalPlatinumAmount, ' ') + ' Platinum';
}

function resetModifiers() {
    resetInputs([
        '#inputUpgradeDiscountPercentage'
    ], 0, syncData);
}

function resetTitanWeaponUpgrades() {
    resetInputs([
        '#t4TitanWeaponUpgradeContainer .quantities'
    ], 0, syncData);
}

function init() {
    const t4TitanWeaponUpgradeContainer = document.getElementById('t4TitanWeaponUpgradeContainer');
    let t4TitanWeaponUpgradeContainerInnerHTML = '';
    let i;

    for (i = 0; i < DS_T4_TITAN_WEAPON_UPGRADES.length; i++) {
        if (DS_T4_TITAN_WEAPON_UPGRADES[i].level == 1) {
            continue;
        }

        t4TitanWeaponUpgradeContainerInnerHTML += '<div class="col-md-6">' +
            '<div class="item">' + '<div class="row align-items-center">' +
            '<div class="col">' + '<div class="item-title">Level ' + DS_T4_TITAN_WEAPON_UPGRADES[i].level + '</div>' +
            '</div>' +
            '<div class="col">' +
            '<div class="input-group">' +
            '<button type="button" class="btn btn-danger btn-decrement" data-wc-target="t4TitanWeaponQuantity' + i + '">-</button>' +
            '<input id="t4TitanWeaponQuantity' + i + '" type="number" class="form-control quantities sync-data" min="0" value="0">' +
            '<button type="button" class="btn btn-success btn-increment" data-wc-target="t4TitanWeaponQuantity' + i + '">+</button>' +
            '</div>' +
            '</div>' +
            '<div class="col-12">' +
            '<div class="d-flex flex-wrap gap-1 mt-2">' +
            '<span class="badge bg-light text-dark border" title="0 Platinum">Platinum: <span id="t4TitanWeaponPlatinumAmount' + i + '" class="upgrade-duration">0</span></span>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
    }

    t4TitanWeaponUpgradeContainer.innerHTML = t4TitanWeaponUpgradeContainerInnerHTML;

    // Set click event listener.
    document.getElementById('mainContainer').addEventListener('click', (e) => {
        if (e.target.matches('#buttonResetModifiers')) {
            resetModifiers();
        }
        if (e.target.matches('#buttonResetT4TitanWeaponUpgrades')) {
            resetTitanWeaponUpgrades();
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