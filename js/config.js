/**
 * CONFIG - Global Configuration Object
 * 
 * Contains all application settings, constants, and initialization methods
 * for the CO2 emissions calculator
 */

const CONFIG = {
    /**
     * EMISSION_FACTORS
     * CO2 emissions per kilometer for each transport mode
     * Values in kg CO2 per km
     */
    EMISSION_FACTORS: {
        bicycle: 0,
        car: 0.12,
        bus: 0.089,
        truck: 0.96
    },

    /**
     * TRANSPORT_MODES
     * Metadata for each transport mode including labels, icons, and colors
     * Used for displaying transport options in UI
     */
    TRANSPORT_MODES: {
        bicycle: {
            label: "Bicicleta",
            icon: "🚲",
            color: "#3b82f6" // Blue
        },
        car: {
            label: "Carro",
            icon: "🚗",
            color: "#ef4444" // Red
        },
        bus: {
            label: "Ônibus",
            icon: "🚌",
            color: "#f59e0b" // Amber
        },
        truck: {
            label: "Caminhão",
            icon: "🚛",
            color: "#8b5cf6" // Violet
        }
    },

    /**
     * CARBON_CREDIT
     * Configuration for carbon credit calculations
     */
    CARBON_CREDIT: {
        KG_PER_CREDIT: 1000,
        PRICE_MIN_BRL: 50,
        PRICE_MAX_BRL: 150
    },

    /**
     * Method: populateDatalist
     * Populates the cities datalist with all available cities from RoutesDB
     * Creates option elements for each city and appends to the datalist element
     * 
     * @returns {void}
     */
    populateDatalist: function() {
        // Get the datalist element
        const datalist = document.getElementById('cities-list');
        
        // Guard clause: ensure datalist exists
        if (!datalist) {
            console.warn('Datalist element with id="cities-list" not found');
            return;
        }

        // Get all unique cities from RoutesDB
        const cities = RoutesDB.getAllCities();

        // Create option element for each city
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            datalist.appendChild(option);
        });

        console.log(`Successfully populated datalist with ${cities.length} cities`);
    },

    /**
     * Method: setupDistance
     * Sets up event listeners for automatic distance calculation
     * Listens to origin and destination inputs, and manual distance checkbox
     * Automatically fills distance if route is found in RoutesDB
     * 
     * Features:
     * - Bidirectional route search (origin→dest and dest→origin)
     * - Manual distance entry toggle via checkbox
     * - Dynamic helper text updates with visual feedback
     * 
     * @returns {void}
     */
    setupDistance: function() {
        // Get DOM elements
        const originInput = document.getElementById('origin');
        const destinationInput = document.getElementById('destination');
        const distanceInput = document.getElementById('distance');
        const manualCheckbox = document.getElementById('manual-distance');
        const helperText = document.querySelector('.calculator-form__helper-text');

        // Guard clauses: ensure all required elements exist
        if (!originInput || !destinationInput || !distanceInput || !manualCheckbox || !helperText) {
            console.warn('One or more required elements for distance setup not found');
            return;
        }

        /**
         * Helper function: attemptFillDistance
         * Tries to find and fill distance based on current origin and destination values
         */
        const attemptFillDistance = () => {
            const origin = originInput.value.trim();
            const destination = destinationInput.value.trim();

            console.log(`🔍 Tentando encontrar rota: "${origin}" -> "${destination}"`);

            // Only if both fields have values
            if (origin && destination) {
                const distance = RoutesDB.findDistance(origin, destination);

                if (distance !== null) {
                    // Distance found - fill the input
                    distanceInput.value = distance;
                    distanceInput.readOnly = true;

                    // Update helper text with success message
                    helperText.textContent = '✓ Distância encontrada automaticamente';
                    helperText.style.color = '#10b981'; // Green color
                    helperText.style.fontWeight = '600';

                    console.log(`Distance found: ${distance} km`);
                } else {
                    // Distance not found - clear input and prompt manual entry
                    distanceInput.value = '';
                    distanceInput.readOnly = true;

                    // Update helper text to suggest manual entry
                    helperText.textContent = '⚠️ Rota não encontrada. Ative "Inserir distância manualmente" para continuar.';
                    helperText.style.color = '#f59e0b'; // Amber color
                    helperText.style.fontWeight = '600';

                    console.log('Route not found in database');
                }
            } else {
                // Reset if fields are empty
                distanceInput.value = '';
                distanceInput.readOnly = true;
                helperText.textContent = 'A distância será preenchida automaticamente.';
                helperText.style.color = 'inherit';
                helperText.style.fontWeight = 'normal';
            }
        };

        // Add 'input blur' event listeners for live lookup on origin and destination
        originInput.addEventListener('input', attemptFillDistance);
        originInput.addEventListener('blur', attemptFillDistance);
        destinationInput.addEventListener('input', attemptFillDistance);
        destinationInput.addEventListener('blur', attemptFillDistance);
        console.log('Live distance lookup events attached');

        // Add 'change' listener to manual distance checkbox
        manualCheckbox.addEventListener('change', function() {
            if (this.checked) {
                // Checkbox is checked - allow manual distance entry
                distanceInput.readOnly = false;
                distanceInput.focus();

                helperText.textContent = 'Digite a distância manualmente em quilômetros';
                helperText.style.color = '#3b82f6'; // Blue color
                helperText.style.fontWeight = '500';

                // Clear the input for user to enter custom value
                distanceInput.value = '';

                console.log('Manual distance entry enabled');
            } else {
                // Checkbox is unchecked - revert to automatic distance
                distanceInput.readOnly = true;

                // Try to fill distance again with current origin/destination
                attemptFillDistance();

                console.log('Manual distance entry disabled');
            }
        });

        console.log('Distance setup initialized - FIXED with live fuzzy matching');
    }
};

// Make CONFIG available globally
window.CONFIG = CONFIG;
