import { toInt } from '/warrobots-calculator/js/data-helper.js?v=1.9.0';
import { resetInputs, updateNumberInput } from '/warrobots-calculator/js/input-helper.js?v=1.9.0';
import { applyUpgradeDiscountPercentage } from '/warrobots-calculator/js/modifier-helper.js?v=1.9.0';

function updateInputValue(eventType, inputId) {
    updateNumberInput(eventType, inputId, syncData);
}

function syncData() {
    const inputUpgradeDiscountPercentage = document.getElementById('inputUpgradeDiscountPercentage');
    const inputQuantities = document.querySelectorAll(".quantities");
    const spanTotalQuantity = document.getElementById('totalQuantity');
    const spanTotalMicrochips = document.getElementById('totalMicrochips');
    const spanTotalUpgradeTokens = document.getElementById('totalUpgradeTokens');
    let inputQuantity, spanMicrochips, spanUpgradeTokens;
    let upgradeDiscountPercentage = 0;
    let quantity = 0, microchips = 0, upgradeTokens = 0;
    let totalQuantity = 0, totalMicrochips = 0, totalUpgradeTokens = 0;
    let i;

    upgradeDiscountPercentage = toInt(inputUpgradeDiscountPercentage.value);

    for (i = 0; i < DS_DRONE_UPGRADES.length; i++) {
        if (DS_DRONE_UPGRADES[i].level == 1) {
            continue;
        }

        inputQuantity = document.getElementById('quantity_' + i);
        spanMicrochips = document.getElementById('microchips_' + i);
        spanUpgradeTokens = document.getElementById('upgradeTokens_' + i);

        quantity = toInt(inputQuantity.value);
        microchips = applyUpgradeDiscountPercentage(upgradeDiscountPercentage, DS_DRONE_UPGRADES[i].microchips) * quantity;
        upgradeTokens = DS_DRONE_UPGRADES[i].upgradeTokens * quantity;

        spanMicrochips.textContent = microchips;
        spanUpgradeTokens.textContent = upgradeTokens;

        totalQuantity += quantity;
        totalMicrochips += microchips;
        totalUpgradeTokens += upgradeTokens;
    }

    spanTotalQuantity.textContent = totalQuantity;
    spanTotalMicrochips.textContent = totalMicrochips;
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

    for (i = 0; i < DS_DRONE_UPGRADES.length; i++) {
        if (DS_DRONE_UPGRADES[i].level == 1) {
            continue;
        }

        if (type == 1) {
            if (DS_DRONE_UPGRADES[i].level > 3) {
                continue;
            }
        }
        else if (type == 2) {
            if (DS_DRONE_UPGRADES[i].level > 6) {
                continue;
            }
        }
        else if (type == 3) {
            if (DS_DRONE_UPGRADES[i].level > 9) {
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

    for (i = 0; i < DS_DRONE_UPGRADES.length; i++) {
        if (DS_DRONE_UPGRADES[i].level == 1) {
            continue;
        }

        upgradeContainerInnerHTML += '<div class="col-md-6">' +
            '<div class="item">' + '<div class="row align-items-center">' +
            '<div class="col">' + '<div class="item-title">Level&nbsp;' + DS_DRONE_UPGRADES[i].level + '</div>' +
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
            '<span class="badge bg-light text-dark border">Microchips: <span id="microchips_' + i + '" class="microchips">0</span></span>' +
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
        if (e.target.matches('#buttonT1PresetUpgrade')) {
            presetUpgrade(1);
        }
        if (e.target.matches('#buttonT2PresetUpgrade')) {
            presetUpgrade(2);
        }
        if (e.target.matches('#buttonT3PresetUpgrade')) {
            presetUpgrade(3);
        }
        if (e.target.matches('#buttonT4PresetUpgrade')) {
            presetUpgrade(4);
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

    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
}

init();