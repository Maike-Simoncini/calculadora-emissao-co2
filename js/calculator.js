/**
 * Calculator - Global Calculator Object
 * 
 * Contains all calculation methods for CO2 emissions, carbon credits,
 * and environmental impact comparisons
 */

const Calculator = {
    /**
     * Method: calculateEmission
     * Calculates CO2 emissions for a specific transport mode and distance
     * 
     * Formula: Emission (kg CO2) = Distance (km) × Emission Factor (kg CO2/km)
     * 
     * @param {Number} distanceKm - Distance in kilometers
     * @param {String} transportMode - Transport mode key (bicycle, car, bus, truck)
     * @returns {Number} Total CO2 emissions in kilograms, rounded to 2 decimal places
     * 
     * @example
     * Calculator.calculateEmission(100, 'car')  // Returns 12 (100 * 0.12)
     * Calculator.calculateEmission(100, 'bus')  // Returns 8.9 (100 * 0.089)
     */
    calculateEmission: function(distanceKm, transportMode) {
        // Guard clause: validate inputs
        if (typeof distanceKm !== 'number' || distanceKm < 0) {
            console.error('Invalid distance:', distanceKm);
            return 0;
        }

        if (!CONFIG.EMISSION_FACTORS.hasOwnProperty(transportMode)) {
            console.error('Invalid transport mode:', transportMode);
            return 0;
        }

        // Get emission factor for the transport mode
        const emissionFactor = CONFIG.EMISSION_FACTORS[transportMode];

        // Calculate total emission
        const totalEmission = distanceKm * emissionFactor;

        // Return rounded to 2 decimal places
        return Math.round(totalEmission * 100) / 100;
    },

    /**
     * Method: calculateAllModes
     * Calculates and compares emissions across all transport modes
     * Each result includes the emission amount and percentage comparison to car
     * 
     * Process:
     * 1. Calculate emissions for each transport mode
     * 2. Use car emission as baseline (100%)
     * 3. Calculate percentage for each mode relative to car
     * 4. Return results sorted from lowest to highest emissions
     * 
     * @param {Number} distanceKm - Distance in kilometers
     * @returns {Array<Object>} Array of objects with structure:
     *          {mode: 'bus', emission: 8.9, percentageVsCar: 74.17}
     *          Sorted by emission (lowest first)
     * 
     * @example
     * Calculator.calculateAllModes(100)
     * // Returns: [
     * //   {mode: 'bicycle', emission: 0, percentageVsCar: 0},
     * //   {mode: 'bus', emission: 8.9, percentageVsCar: 74.17},
     * //   {mode: 'car', emission: 12, percentageVsCar: 100},
     * //   {mode: 'truck', emission: 96, percentageVsCar: 800}
     * // ]
     */
    calculateAllModes: function(distanceKm) {
        // Guard clause: validate distance
        if (typeof distanceKm !== 'number' || distanceKm < 0) {
            console.error('Invalid distance:', distanceKm);
            return [];
        }

        // Array to store results
        const results = [];

        // Calculate car emission first (used as baseline for comparison)
        const carEmission = this.calculateEmission(distanceKm, 'car');

        // Iterate through each transport mode
        for (let mode in CONFIG.EMISSION_FACTORS) {
            if (CONFIG.EMISSION_FACTORS.hasOwnProperty(mode)) {
                // Calculate emission for this mode
                const emission = this.calculateEmission(distanceKm, mode);

                // Calculate percentage compared to car
                // If car emission is 0 or this mode is 0, set to 0 or 100
                let percentageVsCar = 0;
                if (carEmission !== 0 && emission !== 0) {
                    percentageVsCar = (emission / carEmission) * 100;
                } else if (emission === 0 && carEmission !== 0) {
                    percentageVsCar = 0;
                } else if (emission !== 0 && carEmission === 0) {
                    percentageVsCar = 100;
                }

                percentageVsCar = Math.round(percentageVsCar * 100) / 100;

                // Push result object to array
                results.push({
                    mode: mode,
                    emission: emission,
                    percentageVsCar: percentageVsCar
                });
            }
        }

        // Sort array by emission (lowest first)
        results.sort((a, b) => a.emission - b.emission);

        return results;
    },

    /**
     * Method: calculateSavings
     * Calculates the CO2 emissions saved by choosing a cleaner transport mode
     * Compares the selected mode emission against a baseline (typically car)
     * 
     * Calculations:
     * - Saved kg CO2 = Baseline Emission - Selected Emission
     * - Percentage Saved = (Saved kg / Baseline Emission) × 100
     * 
     * @param {Number} emission - CO2 emission of selected transport mode (kg)
     * @param {Number} baselineEmission - CO2 emission of baseline mode (kg)
     * @returns {Object} Object with structure:
     *          {savedKg: 5.5, percentage: 45.83}
     *          Both values rounded to 2 decimal places
     * 
     * @example
     * Calculator.calculateSavings(8.9, 12)  // Bus vs Car
     * // Returns: {savedKg: 3.1, percentage: 25.83}
     */
    calculateSavings: function(emission, baselineEmission) {
        // Guard clause: validate inputs
        if (typeof emission !== 'number' || typeof baselineEmission !== 'number') {
            console.error('Invalid emissions values');
            return { savedKg: 0, percentage: 0 };
        }

        // Calculate saved kg CO2 (baseline minus selected emission)
        const savedKg = Math.round((baselineEmission - emission) * 100) / 100;

        // Calculate percentage saved relative to baseline
        let percentage = 0;
        if (baselineEmission !== 0) {
            percentage = (savedKg / baselineEmission) * 100;
            percentage = Math.round(percentage * 100) / 100;
        }

        return {
            savedKg: savedKg,
            percentage: percentage
        };
    },

    /**
     * Method: calculateCarbonCredits
     * Converts CO2 emissions (in kg) to carbon credits
     * Each carbon credit represents KG_PER_CREDIT kg of CO2
     * 
     * Formula: Credits = Emission (kg) / KG_PER_CREDIT
     * Using CONFIG.CARBON_CREDIT.KG_PER_CREDIT = 1000
     * 
     * @param {Number} emissionKg - Total CO2 emissions in kilograms
     * @returns {Number} Number of carbon credits, rounded to 4 decimal places
     * 
     * @example
     * Calculator.calculateCarbonCredits(1000)  // Returns 1.0000
     * Calculator.calculateCarbonCredits(500)   // Returns 0.5000
     * Calculator.calculateCarbonCredits(2500)  // Returns 2.5000
     */
    calculateCarbonCredits: function(emissionKg) {
        // Guard clause: validate input
        if (typeof emissionKg !== 'number' || emissionKg < 0) {
            console.error('Invalid emission value:', emissionKg);
            return 0;
        }

        // Divide emission by kg per credit constant
        const credits = emissionKg / CONFIG.CARBON_CREDIT.KG_PER_CREDIT;

        // Return rounded to 4 decimal places
        return Math.round(credits * 10000) / 10000;
    },

    /**
     * Method: estimatedCreditPrice
     * Estimates the monetary value of carbon credits
     * Calculates price range based on min and max values from CONFIG
     * Returns minimum, maximum, and average price estimates
     * 
     * Calculations:
     * - Min Price (BRL) = Credits × PRICE_MIN_BRL
     * - Max Price (BRL) = Credits × PRICE_MAX_BRL
     * - Average Price (BRL) = (Min + Max) / 2
     * 
     * Configuration:
     * - CONFIG.CARBON_CREDIT.PRICE_MIN_BRL = 50 (minimum price per credit)
     * - CONFIG.CARBON_CREDIT.PRICE_MAX_BRL = 150 (maximum price per credit)
     * 
     * @param {Number} credits - Number of carbon credits
     * @returns {Object} Object with structure:
     *          {min: 50.50, max: 150.50, average: 100.50}
     *          All values in BRL (Brazilian Real), rounded to 2 decimal places
     * 
     * @example
     * Calculator.estimatedCreditPrice(1)
     * // Returns: {min: 50, max: 150, average: 100}
     * 
     * Calculator.estimatedCreditPrice(2.5)
     * // Returns: {min: 125, max: 375, average: 250}
     */
    estimatedCreditPrice: function(credits) {
        // Guard clause: validate input
        if (typeof credits !== 'number' || credits < 0) {
            console.error('Invalid credits value:', credits);
            return { min: 0, max: 0, average: 0 };
        }

        // Get price configuration values
        const minPrice = CONFIG.CARBON_CREDIT.PRICE_MIN_BRL;
        const maxPrice = CONFIG.CARBON_CREDIT.PRICE_MAX_BRL;

        // Calculate min and max prices
        const minEstimate = credits * minPrice;
        const maxEstimate = credits * maxPrice;

        // Calculate average price
        const averageEstimate = (minEstimate + maxEstimate) / 2;

        // Return price estimates rounded to 2 decimal places
        return {
            min: Math.round(minEstimate * 100) / 100,
            max: Math.round(maxEstimate * 100) / 100,
            average: Math.round(averageEstimate * 100) / 100
        };
    }
};

// Make Calculator available globally
window.Calculator = Calculator;
