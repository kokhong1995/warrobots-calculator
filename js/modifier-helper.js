const applyUpgradeDiscountPercentage = (upgradeDiscountPercentage, value) => {
    if (upgradeDiscountPercentage == null || value == null) {
        return 0;
    }

    let discount = value * upgradeDiscountPercentage / 100;
    let netValue = value - Math.round(discount);

    return netValue > 0 ? netValue : 0;
};

const applyUpgradeSpeedMultiplier = (speed, seconds) => {
    if (speed > 0) {
        return seconds / speed;
    }
    else {
        return seconds;
    }
};

const calculateTotalTitanDeployPoints = (totalTitanDeploys) => {
    const titanDeployHonorPoints = 32;
    const titanDeployPoints = Math.floor(titanDeployHonorPoints / 9);

    return titanDeployPoints * totalTitanDeploys;
};

export { applyUpgradeDiscountPercentage, applyUpgradeSpeedMultiplier, calculateTotalTitanDeployPoints };