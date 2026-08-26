import { toInt } from '/warrobots-calculator/js/data-helper.js?v=1.8.0';
import { resetInputs, updateNumberInput } from '/warrobots-calculator/js/input-helper.js?v=1.8.0';
import { applyUpgradeDiscountPercentage } from '/warrobots-calculator/js/modifier-helper.js?v=1.8.0';

function updateInputValue(eventType, inputId) {
    updateNumberInput(eventType, inputId, syncData);
}

function syncData() {
    const inputUpgradeDiscountPercentage = document.getElementById('inputUpgradeDiscountPercentage');
    const spanTotalQuantity = document.getElementById('totalQuantity');
    const spanTotalPlatinumAmount = document.getElementById('totalPlatinumAmount');
    let inputQuantity, spanPlatinumAmount;
    let upgradeDiscountPercentage = 0;
    let quantity = 0, platinumAmount = 0;
    let totalQuantity = 0, totalPlatinumAmount = 0;
    let i, j;

    upgradeDiscountPercentage = Math.abs(toInt(inputUpgradeDiscountPercentage.value));

    for (i = 0; i < DS_T4_TITAN_UPGRADES.length; i++) {
        for (j = 0; j < DS_T4_TITAN_UPGRADES[i].length; j++) {
            if (DS_T4_TITAN_UPGRADES[i][j].level == 1) {
                continue;
            }

            inputQuantity = document.getElementById(TYPES[i] + 'Quantity_' + j);
            spanPlatinumAmount = document.getElementById(TYPES[i] + 'PlatinumAmount_' + j);

            quantity = toInt(inputQuantity.value);
            platinumAmount = applyUpgradeDiscountPercentage(upgradeDiscountPercentage, DS_T4_TITAN_UPGRADES[i][j].platinumAmount) * quantity;

            spanPlatinumAmount.textContent = platinumAmount;

            totalQuantity += quantity;
            totalPlatinumAmount += platinumAmount;
        }
    }

    spanTotalQuantity.textContent = totalQuantity;
    spanTotalPlatinumAmount.textContent = totalPlatinumAmount;
}

function resetModifiers() {
    resetInputs(['#inputUpgradeDiscountPercentage'], 0, syncData);
}

function resetT4HullUpgrades() {
    resetInputs([
        '#t4HullUpgradeContainer .quantities'
    ], 0, syncData);
}

function resetT4CoreUpgrades() {
    resetInputs([
        '#t4CoreUpgradeContainer .quantities'
    ], 0, syncData);
}

function resetT4EngineUpgrades() {
    resetInputs([
        '#t4EngineUpgradeContainer .quantities'
    ], 0, syncData);
}

function presetUpgrade(index) {
    let inputQuantity;
    let quantity = 0;
    let i;

    for (i = 0; i < DS_T4_TITAN_UPGRADES[index].length; i++) {
        if (DS_T4_TITAN_UPGRADES[index][i].level == 1) {
            continue;
        }

        inputQuantity = document.getElementById(TYPES[index] + 'Quantity_' + i);
        quantity = toInt(inputQuantity.value);
        inputQuantity.value = ++quantity;
    }

    syncData();
}

function init() {
    const t4UpgradeContainers = [
        document.getElementById('t4HullUpgradeContainer'),
        document.getElementById('t4CoreUpgradeContainer'),
        document.getElementById('t4EngineUpgradeContainer')
    ];
    const t4UpgradeContainerInnerHTMLs = ['', '', ''];
    let i, j;

    for (i = 0; i < DS_T4_TITAN_UPGRADES.length; i++) {
        for (j = 0; j < DS_T4_TITAN_UPGRADES[i].length; j++) {
            if (DS_T4_TITAN_UPGRADES[i][j].level == 1) {
                continue;
            }

            t4UpgradeContainerInnerHTMLs[i] += '<div class="col-md-6 col-xxl-4">' +
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

    for (i = 0; i < t4UpgradeContainers.length; i++) {
        t4UpgradeContainers[i].innerHTML = t4UpgradeContainerInnerHTMLs[i];
    }

    // Set click event listener.
    document.getElementById('mainContainer').addEventListener('click', (e) => {
        if (e.target.matches('#buttonResetModifiers')) {
            resetModifiers();
        }
        if (e.target.matches('#buttonResetT4HullUpgrades')) {
            resetT4HullUpgrades();
        }
        if (e.target.matches('#buttonResetT4CoreUpgrades')) {
            resetT4CoreUpgrades();
        }
        if (e.target.matches('#buttonResetT4EngineUpgrades')) {
            resetT4EngineUpgrades();
        }
        if (e.target.matches('#buttonT4HullPresetUpgrade')) {
            presetUpgrade(0);
        }
        if (e.target.matches('#buttonT4CorePresetUpgrade')) {
            presetUpgrade(1);
        }
        if (e.target.matches('#buttonT4EnginePresetUpgrade')) {
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

const TYPES = ['t4Hull', 't4Core', 't4Engine'];
const DS_T4_TITAN_UPGRADES = [
    DS_T4_TITAN_HULL_UPGRADES, DS_T4_TITAN_CORE_UPGRADES, DS_T4_TITAN_ENGINE_UPGRADES
];

init();