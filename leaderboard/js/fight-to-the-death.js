import { toInt, thousandSeperator, getStrLevel, getStrAmount, getStrDuration } from '/warrobots-calculator/js/data-helper.js?v=1.7.3';
import { resetInputs, updateNumberInput } from '/warrobots-calculator/js/input-helper.js?v=1.7.3';
import { applyUpgradeDiscountPercentage, calculateTotalTitanDeployPoints } from '/warrobots-calculator/js/modifier-helper.js?v=1.7.3';

function updateInputValue(eventType, inputId) {
    updateNumberInput(eventType, inputId, syncData);
}

function syncData() {
    const inputUpgradeDiscountPercentage = document.getElementById('inputUpgradeDiscountPercentage');
    const inputInitialPoints = document.getElementById('inputInitialPoints');
    const inputTotalTitanDeploys = document.getElementById('inputTotalTitanDeploys');
    const spanTotalQuantity = document.getElementById('totalQuantity');
    const spanTotalSilverAmount = document.getElementById('totalSilverAmount');
    const spanTotalGoldAmount = document.getElementById('totalGoldAmount');
    const spanTotalUpgradeDuration = document.getElementById("totalUpgradeDuration");
    const spanTotalUpgradeTokens = document.getElementById('totalUpgradeTokens');
    const spanTotalPoints = document.getElementById('totalPoints');
    let inputQuantity, spanSilverAmount, spanGoldAmount, spanUpgradeDuration, spanUpgradeTokens, spanPoints;
    let upgradeDiscountPercentage = 0;
    let quantity = 0, silverAmount = 0, goldAmount = 0, upgradeDuration = 0, upgradeTokens = 0, points = 0;
    let totalQuantity = 0, totalSilverAmount = 0, totalGoldAmount = 0, totalUpgradeDuration = 0, totalUpgradeTokens = 0;
    let totalPoints = 0, initialPoints = 0, totalTitanDeploysPoints;
    let i, j;

    // Get values of modifier inputs.
    upgradeDiscountPercentage = Math.abs(toInt(inputUpgradeDiscountPercentage.value));

    for (i = 0; i < DS_FIGHT_TO_THE_DEATH.length; i++) {
        for (j = 0; j < DS_FIGHT_TO_THE_DEATH[i].length; j++) {
            if (DS_FIGHT_TO_THE_DEATH[i][j].level == 1) {
                continue;
            }

            inputQuantity = document.getElementById(TYPES[i] + 'Quantity_' + j);
            spanSilverAmount = document.getElementById(TYPES[i] + 'SilverAmount_' + j);
            spanGoldAmount = document.getElementById(TYPES[i] + 'GoldAmount_' + j);
            spanUpgradeDuration = document.getElementById(TYPES[i] + 'UpgradeDuration_' + j);
            spanUpgradeTokens = document.getElementById(TYPES[i] + 'UpgradeTokens_' + j);
            spanPoints = document.getElementById(TYPES[i] + 'Points_' + j);

            // Calculate quantity, silver amount, gold amount, upgrade duration, upgrade tokens and points.
            quantity = toInt(inputQuantity.value);
            silverAmount = applyUpgradeDiscountPercentage(upgradeDiscountPercentage, DS_FIGHT_TO_THE_DEATH[i][j].silverAmount) * quantity;
            goldAmount = DS_FIGHT_TO_THE_DEATH[i][j].goldAmount * quantity;
            upgradeDuration = DS_FIGHT_TO_THE_DEATH[i][j].upgradeDurationSeconds * quantity;
            upgradeTokens = DS_FIGHT_TO_THE_DEATH[i][j].upgradeTokens * quantity;
            points = DS_FIGHT_TO_THE_DEATH[i][j].points.fightToTheDeath * quantity;

            // Set silver amount, gold amount, upgrade duration, upgrade tokens and points.
            spanSilverAmount.textContent = getStrAmount(silverAmount);
            spanSilverAmount.parentElement.title = thousandSeperator(silverAmount, ' ') + ' Silver';
            spanGoldAmount.textContent = getStrAmount(goldAmount);
            spanGoldAmount.parentElement.title = thousandSeperator(goldAmount, ' ') + ' Gold';
            spanUpgradeDuration.textContent = getStrDuration(upgradeDuration);
            spanUpgradeTokens.textContent = upgradeTokens;
            spanPoints.textContent = points;

            // Total up quantity, silver amount, gold amount, upgrade duration, upgrade tokens and points.
            totalQuantity += quantity;
            totalSilverAmount += silverAmount;
            totalGoldAmount += goldAmount;
            totalUpgradeDuration += upgradeDuration;
            totalUpgradeTokens += upgradeTokens;
            totalPoints += points;
        }
    }
    // Calculate total points.
    initialPoints = toInt(inputInitialPoints.value);
    totalTitanDeploysPoints = calculateTotalTitanDeployPoints(toInt(inputTotalTitanDeploys.value));
    totalPoints += initialPoints + totalTitanDeploysPoints;

    // Set total quantity, total silver amount, total gold amount, total upgrade duration, total upgrade tokens and total points.
    spanTotalQuantity.textContent = totalQuantity;
    spanTotalSilverAmount.textContent = getStrAmount(totalSilverAmount);
    spanTotalSilverAmount.title = thousandSeperator(totalSilverAmount, ' ') + ' Silver';
    spanTotalGoldAmount.textContent = getStrAmount(totalGoldAmount);
    spanTotalGoldAmount.title = thousandSeperator(totalGoldAmount, ' ') + ' Gold';
    spanTotalUpgradeDuration.textContent = getStrDuration(totalUpgradeDuration);
    spanTotalUpgradeTokens.textContent = totalUpgradeTokens;
    spanTotalPoints.textContent = totalPoints;
}

function resetModifiers() {
    resetInputs([
        '#inputUpgradeDiscountPercentage', '#inputInitialPoints',
        '#inputTotalTitanDeploys'
    ], 0, syncData);
}

function resetT4RobotUpgrades() {
    resetInputs(['#t4RobotUpgradesContainer .quantities'], 0, syncData);
}

function resetT4RobotWeaponUpgrades() {
    resetInputs(['#t4RobotWeaponUpgradesContainer .quantities'], 0, syncData);
}

function init() {
    const containers = [
        document.getElementById('t4RobotUpgradesContainer'),
        document.getElementById('t4RobotWeaponUpgradesContainer')
    ];
    const containerInnerHTMLs = ['', ''];
    let i, j;

    for (i = 0; i < DS_FIGHT_TO_THE_DEATH.length; i++) {
        for (j = 0; j < DS_FIGHT_TO_THE_DEATH[i].length; j++) {
            if ((DS_FIGHT_TO_THE_DEATH[i][j].mark == 1 && DS_FIGHT_TO_THE_DEATH[i][j].level == 1) ||
                (DS_FIGHT_TO_THE_DEATH[i][j].mark == 2 && DS_FIGHT_TO_THE_DEATH[i][j].level == 1)
            ) {
                continue;
            }

            containerInnerHTMLs[i] += '<div class="col-md-6">' +
                '<div class="item">' + '<div class="row align-items-center">' +
                '<div class="col">' + '<div class="item-title">' + getStrLevel(DS_FIGHT_TO_THE_DEATH[i][j].mark, DS_FIGHT_TO_THE_DEATH[i][j].level) + '</div>' +
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
                '<span class="badge bg-light text-dark border" title="0 Silver">Silver: <span id="' + TYPES[i] + 'SilverAmount_' + j + '" class="silver-amount">0</span></span>' +
                '<span class="badge bg-light text-dark border" title="0 Gold">Gold: <span id="' + TYPES[i] + 'GoldAmount_' + j + '" class="gold-amount">0</span></span>' +
                '<span class="badge bg-light text-dark border">Upgrade Duration: <span id="' + TYPES[i] + 'UpgradeDuration_' + j + '" class="upgrade-duration">0</span></span>' +
                '<span class="badge bg-light text-dark border">Upgrade Tokens: <span id="' + TYPES[i] + 'UpgradeTokens_' + j + '" class="upgrade-tokens">0</span></span>' +
                '<span class="badge bg-light text-dark border">Points: <span id="' + TYPES[i] + 'Points_' + j + '" class="points">0</span></span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
        }
    }

    for (i = 0; i < containers.length; i++) {
        containers[i].innerHTML = containerInnerHTMLs[i];
    }

    // Set click event listener.
    document.getElementById('mainContainer').addEventListener('click', (e) => {
        if (e.target.matches('#buttonResetModifiers')) {
            resetModifiers();
        }
        if (e.target.matches('#buttonResetT4RobotUpgrades')) {
            resetT4RobotUpgrades();
        }
        if (e.target.matches('#buttonResetT4RobotWeaponUpgrades')) {
            resetT4RobotWeaponUpgrades();
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

const TYPES = ['t4Robot', 't4RobotWeapon'];
const DS_FIGHT_TO_THE_DEATH = [
    DS_T4_ROBOT_UPGRADES, DS_T4_ROBOT_WEAPON_UPGRADES
];

init();