import { toInt, toFloat, thousandSeperator, getStrLevel, getStrAmount, getStrDuration } from '/warrobots-calculator/js/data-helper.js?v=1.7.3';
import { resetInputs, updateNumberInput } from '/warrobots-calculator/js/input-helper.js?v=1.7.3';
import { applyUpgradeDiscountPercentage } from '/warrobots-calculator/js/modifier-helper.js?v=1.7.3';

function updateInputValue(eventType, inputId) {
    updateNumberInput(eventType, inputId, syncData);
}

function syncData() {
    const inputTitanUpgradeDiscountPercentage = document.getElementById('inputTitanUpgradeDiscountPercentage');
    const spanTotalQuantity = document.getElementById('totalQuantity');
    const spanTotalPlatinumAmount = document.getElementById('totalPlatinumAmount');
    let inputQuantity, spanPlatinumAmount;
    let upgradeDiscountPercentage = 0;
    let quantity = 0, platinumAmount = 0;
    let totalQuantity = 0, totalPlatinumAmount = 0;
    let i, j;

    // Get values of modifier inputs.
    upgradeDiscountPercentage = Math.abs(toInt(inputTitanUpgradeDiscountPercentage.value));

    for (i = 0; i < DS_T4_TITAN_UPGRADES.length; i++) {
        for (j = 0; j < DS_T4_TITAN_UPGRADES[i].length; j++) {
            if (DS_T4_TITAN_UPGRADES[i][j].level == 1) {
                continue;
            }

            inputQuantity = document.getElementById(TYPES[i] + 'Quantity_' + j);
            spanPlatinumAmount = document.getElementById(TYPES[i] + 'PlatinumAmount_' + j);

            // Calculate quantity and platinum amount.
            quantity = toInt(inputQuantity.value);
            platinumAmount = applyUpgradeDiscountPercentage(upgradeDiscountPercentage, DS_T4_TITAN_UPGRADES[i][j].platinumAmount) * quantity;

            // Set platinum amount.
            spanPlatinumAmount.textContent = platinumAmount;

            // Total up quantity and platinum amount.
            totalQuantity += quantity;
            totalPlatinumAmount += platinumAmount;
        }
    }

    // Set total quantity and total platinum amount.
    spanTotalQuantity.textContent = totalQuantity;
    spanTotalPlatinumAmount.textContent = totalPlatinumAmount;
}

function resetModifiers() {
    resetInputs([
        '#inputTitanUpgradeDiscountPercentage'
    ], 0, syncData);
}

function resetT4TitanHullUpgrades() {
    resetInputs([
        '#t4TitanHullUpgradesContainer .quantities'
    ], 0, syncData);
}

function resetT4TitanCoreUpgrades() {
    resetInputs([
        '#t4TitanCoreUpgradesContainer .quantities'
    ], 0, syncData);
}

function resetT4TitanEngineUpgrades() {
    resetInputs([
        '#t4TitanEngineUpgradesContainer .quantities'
    ], 0, syncData);
}

function init() {
    const t4TitanUpgradesContainers = [
        document.getElementById('t4TitanHullUpgradesContainer'),
        document.getElementById('t4TitanCoreUpgradesContainer'),
        document.getElementById('t4TitanEngineUpgradesContainer')
    ];
    const t4TitanUpgradesContainerInnerHTMLs = ['', '', ''];
    let i, j;

    for (i = 0; i < DS_T4_TITAN_UPGRADES.length; i++) {
        for (j = 0; j < DS_T4_TITAN_UPGRADES[i].length; j++) {
            if (DS_T4_TITAN_UPGRADES[i][j].level == 1) {
                continue;
            }

            t4TitanUpgradesContainerInnerHTMLs[i] += '<div class="col-md-6 col-xxl-4">' +
                '<div class="item">' + '<div class="row align-items-center">' +
                '<div class="col">' + '<div class="item-title">Level ' + DS_T4_TITAN_UPGRADES[i][j].level + '</div>' +
                '</div>' +
                '<div class="col">' +
                '<div class="input-group">' +
                '<button type="button" class="btn btn-danger btn-decrement" data-wc-target="' + TYPES[i] + 'Quantity_' + j + '">-</button>' +
                '<input id="' + TYPES[i] + 'Quantity_' + j + '" type="number" class="form-control quantities sync-data" min="0" value="0">' +
                '<button type="button" class="btn btn-success btn-increment" data-wc-target="' + TYPES[i] + 'Quantity_' + j + '">+</button>' +
                '</div>' +
                '</div>' +
                '<div class="col-12">' +
                '<div class="d-flex flex-wrap gap-1 mt-2">' +
                '<span class="badge bg-light text-dark border" title="0 Platinum">Platinum: <span id="' + TYPES[i] + 'PlatinumAmount_' + j + '" class="platinum-amount">0</span></span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
    }

    for (i = 0; i < t4TitanUpgradesContainers.length; i++) {
        t4TitanUpgradesContainers[i].innerHTML = t4TitanUpgradesContainerInnerHTMLs[i];
    }

    // Set click event listener.
    document.getElementById('mainContainer').addEventListener('click', (e) => {
        if (e.target.matches('#buttonResetModifiers')) {
            resetModifiers();
        }
        if (e.target.matches('#buttonResetT4TitanHullUpgrades')) {
            resetT4TitanHullUpgrades();
        }
        if (e.target.matches('#buttonResetT4TitanCoreUpgrades')) {
            resetT4TitanCoreUpgrades();
        }
        if (e.target.matches('#buttonResetT4TitanEngineUpgrades')) {
            resetT4TitanEngineUpgrades();
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

const TYPES = ['Hull', 'Core', 'Engine'];
const DS_T4_TITAN_UPGRADES = [
    DS_T4_TITAN_HULL_UPGRADES, DS_T4_TITAN_CORE_UPGRADES, DS_T4_TITAN_ENGINE_UPGRADES
];

init();