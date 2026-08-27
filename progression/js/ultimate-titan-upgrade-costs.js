import { toInt } from '/warrobots-calculator/js/data-helper.js?v=1.10.0';
import { resetInputs, updateNumberInput } from '/warrobots-calculator/js/input-helper.js?v=1.10.0';
import { applyUpgradeDiscountPercentage } from '/warrobots-calculator/js/modifier-helper.js?v=1.10.0';

function updateInputValue(eventType, inputId) {
    updateNumberInput(eventType, inputId, syncData);
}

function syncData() {
    const inputUpgradeDiscountPercentage = document.getElementById('inputUpgradeDiscountPercentage');
    const spanTotalQuantity = document.getElementById('totalQuantity');
    const spanTotalPlatinumAmount = document.getElementById('totalPlatinumAmount');
    const spanTotalUpgradeTokens = document.getElementById('totalUpgradeTokens');
    let inputQuantity, spanPlatinumAmount, spanUpgradeTokens;
    let upgradeDiscountPercentage = 0;
    let quantity = 0, platinumAmount = 0, upgradeTokens = 0;
    let totalQuantity = 0, totalPlatinumAmount = 0, totalUpgradeTokens = 0;
    let i, j;

    upgradeDiscountPercentage = Math.abs(toInt(inputUpgradeDiscountPercentage.value));

    for (i = 0; i < DS_ULTIMATE_TITAN_UPGRADES.length; i++) {
        for (j = 0; j < DS_ULTIMATE_TITAN_UPGRADES[i].length; j++) {
            if (DS_ULTIMATE_TITAN_UPGRADES[i][j].level == 1) {
                continue;
            }

            inputQuantity = document.getElementById(TYPES[i] + 'Quantity_' + j);
            spanPlatinumAmount = document.getElementById(TYPES[i] + 'PlatinumAmount_' + j);
            spanUpgradeTokens = document.getElementById(TYPES[i] + 'UpgradeTokens_' + j);

            quantity = toInt(inputQuantity.value);
            platinumAmount = applyUpgradeDiscountPercentage(upgradeDiscountPercentage, DS_ULTIMATE_TITAN_UPGRADES[i][j].platinumAmount) * quantity;
            upgradeTokens = DS_ULTIMATE_TITAN_UPGRADES[i][j].upgradeTokens * quantity;

            spanPlatinumAmount.textContent = platinumAmount;
            spanUpgradeTokens.textContent = upgradeTokens;

            totalQuantity += quantity;
            totalPlatinumAmount += platinumAmount;
            totalUpgradeTokens += upgradeTokens;
        }
    }

    spanTotalQuantity.textContent = totalQuantity;
    spanTotalPlatinumAmount.textContent = totalPlatinumAmount;
    spanTotalUpgradeTokens.textContent = totalUpgradeTokens;
}

function resetModifiers() {
    resetInputs(['#inputUpgradeDiscountPercentage'], 0, syncData);
}

function resetUpgrades(index) {
    resetInputs([
        '#' + TYPES[index] + 'UpgradeContainer .quantities'
    ], 0, syncData);
}

function presetUpgrade(index) {
    let inputQuantity;
    let quantity = 0;
    let i;

    for (i = 0; i < DS_ULTIMATE_TITAN_UPGRADES[index].length; i++) {
        if (DS_ULTIMATE_TITAN_UPGRADES[index][i].level == 1) {
            continue;
        }

        inputQuantity = document.getElementById(TYPES[index] + 'Quantity_' + i);
        quantity = toInt(inputQuantity.value);
        inputQuantity.value = ++quantity;
    }

    syncData();
}

function init() {
    const upgradeContainers = [];
    const upgradeContainerInnerHTMLs = [];
    let i, j;

    for (i = 0; i < TYPES.length; i++) {
        upgradeContainers.push(document.getElementById(TYPES[i] + 'UpgradeContainer'));
        upgradeContainerInnerHTMLs.push('');
    }

    for (i = 0; i < DS_ULTIMATE_TITAN_UPGRADES.length; i++) {
        for (j = 0; j < DS_ULTIMATE_TITAN_UPGRADES[i].length; j++) {
            if (DS_ULTIMATE_TITAN_UPGRADES[i][j].level == 1) {
                continue;
            }

            upgradeContainerInnerHTMLs[i] += '<div class="col-md-6 col-xxl-4">' +
                '<div class="item">' + '<div class="row align-items-center">' +
                '<div class="col">' + '<div class="item-title">Level ' + DS_ULTIMATE_TITAN_UPGRADES[i][j].level + '</div>' +
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
                '<span class="badge bg-light text-dark border">Upgrade Tokens: <span id="' + TYPES[i] + 'UpgradeTokens_' + j + '" class="upgrade-tokens">0</span></span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
    }

    for (i = 0; i < upgradeContainers.length; i++) {
        upgradeContainers[i].innerHTML = upgradeContainerInnerHTMLs[i];
    }

    // Set click event listener.
    document.getElementById('mainContainer').addEventListener('click', (e) => {
        if (e.target.matches('#buttonResetModifiers')) {
            resetModifiers();
        }
        if (e.target.matches('#buttonResetHullUpgrades')) {
            resetUpgrades(0);
        }
        if (e.target.matches('#buttonResetCoreUpgrades')) {
            resetUpgrades(1);
        }
        if (e.target.matches('#buttonResetEngineUpgrades')) {
            resetUpgrades(2);
        }
        if (e.target.matches('#buttonResetUltimateUpgrades')) {
            resetUpgrades(3);
        }
        if (e.target.matches('#buttonHullPresetUpgrade')) {
            presetUpgrade(0);
        }
        if (e.target.matches('#buttonCorePresetUpgrade')) {
            presetUpgrade(1);
        }
        if (e.target.matches('#buttonEnginePresetUpgrade')) {
            presetUpgrade(2);
        }
        if (e.target.matches('#buttonUltimatePresetUpgrade')) {
            presetUpgrade(3);
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

const TYPES = ['hull', 'core', 'engine', 'ultimate'];
const DS_ULTIMATE_TITAN_UPGRADES = [
    DS_ULTIMATE_TITAN_HULL_UPGRADES, DS_ULTIMATE_TITAN_CORE_UPGRADES,
    DS_ULTIMATE_TITAN_ENGINE_UPGRADES, DS_ULTIMATE_TITAN_ULTIMATE_UPGRADES
];

init();