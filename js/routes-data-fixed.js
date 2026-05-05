/**
 * RoutesDB - Global Database Object for Brazilian Routes (FIXED - Bidirecional completo)
 */

const RoutesDB = {
    routes: (() => {
        const baseRoutes = [
            // Capital to Capital Routes
            { origin: "São Paulo, SP", destination: "Rio de Janeiro, RJ", distanceKm: 430 },
            { origin: "São Paulo, SP", destination: "Brasília, DF", distanceKm: 1015 },
            { origin: "Rio de Janeiro, RJ", destination: "Brasília, DF", distanceKm: 1148 },
            { origin: "Belo Horizonte, MG", destination: "Brasília, DF", distanceKm: 735 },
            { origin: "Salvador, BA", destination: "Brasília, DF", distanceKm: 1627 },
            { origin: "Recife, PE", destination: "Salvador, BA", distanceKm: 840 },
            { origin: "Fortaleza, CE", destination: "Recife, PE", distanceKm: 770 },
            { origin: "Manaus, AM", destination: "Brasília, DF", distanceKm: 2600 },
            { origin: "Belém, PA", destination: "Brasília, DF", distanceKm: 2100 },

            // São Paulo Region Routes
            { origin: "São Paulo, SP", destination: "Campinas, SP", distanceKm: 95 },
            { origin: "São Paulo, SP", destination: "Santos, SP", distanceKm: 70 },
            { origin: "São Paulo, SP", destination: "Sorocaba, SP", distanceKm: 108 },
            { origin: "São Paulo, SP", destination: "Ribeirão Preto, SP", distanceKm: 310 },
            { origin: "São Paulo, SP", destination: "Bauru, SP", distanceKm: 350 },
            { origin: "Campinas, SP", destination: "Santos, SP", distanceKm: 155 },

            // Rio de Janeiro Region Routes
            { origin: "Rio de Janeiro, RJ", destination: "Niterói, RJ", distanceKm: 13 },
            { origin: "Rio de Janeiro, RJ", destination: "Duque de Caxias, RJ", distanceKm: 45 },
            { origin: "Rio de Janeiro, RJ", destination: "Petrópolis, RJ", distanceKm: 68 },
            { origin: "Rio de Janeiro, RJ", destination: "Cabo Frio, RJ", distanceKm: 165 },

            // Minas Gerais Routes
            { origin: "Belo Horizonte, MG", destination: "Ouro Preto, MG", distanceKm: 100 },
            { origin: "Belo Horizonte, MG", destination: "Juiz de Fora, MG", distanceKm: 260 },
            { origin: "Belo Horizonte, MG", destination: "Montes Claros, MG", distanceKm: 420 },
            { origin: "Belo Horizonte, MG", destination: "Uberlândia, MG", distanceKm: 560 },
            { origin: "Belo Horizonte, MG", destination: "Rio de Janeiro, RJ", distanceKm: 430 },

            // Bahia Routes
            { origin: "Salvador, BA", destination: "Feira de Santana, BA", distanceKm: 112 },
            { origin: "Salvador, BA", destination: "Ilhéus, BA", distanceKm: 460 },
            { origin: "Salvador, BA", destination: "Porto Seguro, BA", distanceKm: 690 },

            // Pernambuco and Ceará Routes
            { origin: "Recife, PE", destination: "Caruaru, PE", distanceKm: 135 },
            { origin: "Fortaleza, CE", destination: "Juazeiro do Norte, CE", distanceKm: 520 },
            { origin: "Fortaleza, CE", destination: "Caucaia, CE", distanceKm: 30 },

            // Southern Region Routes
            { origin: "Curitiba, PR", destination: "São Paulo, SP", distanceKm: 410 },
            { origin: "Curitiba, PR", destination: "Porto Alegre, RS", distanceKm: 1020 },
            { origin: "São Paulo, SP", destination: "Porto Alegre, RS", distanceKm: 1660 },
            { origin: "Curitiba, PR", destination: "Colombo, PR", distanceKm: 30 },
            { origin: "Porto Alegre, RS", destination: "Pelotas, RS", distanceKm: 270 },

            // Midwest Routes
            { origin: "Brasília, DF", destination: "Goiânia, GO", distanceKm: 210 },
            { origin: "Brasília, DF", destination: "Cuiabá, MT", distanceKm: 920 },
            { origin: "Goiânia, GO", destination: "Anápolis, GO", distanceKm: 55 },

            // Northern Region Routes
            { origin: "Belém, PA", destination: "Marabá, PA", distanceKm: 300 },
            { origin: "Manaus, AM", destination: "Parintins, AM", distanceKm: 370 }
        ];

        // Auto-gerar todas bidirecionais para 100% cobertura da lista
        const fullRoutes = [...baseRoutes];
        baseRoutes.forEach(route => {
            if (route.origin !== route.destination) {
                fullRoutes.push({
                    origin: route.destination,
                    destination: route.origin,
                    distanceKm: route.distanceKm
                });
            }
        });

        console.log(`✅ RoutesDB: ${baseRoutes.length} base → ${fullRoutes.length} totais bidirecionais!`);
        return fullRoutes;
    })(),

    getAllCities: function() {
        const citiesSet = new Set();
        this.routes.forEach(route => {
            citiesSet.add(route.origin);
            citiesSet.add(route.destination);
        });
        return Array.from(citiesSet).sort();
    },

    findDistance: function(origin, destination) {
        console.log(`🔍 Buscando: "${origin}" -> "${destination}"`);
        const normOrigin = origin.trim().toLowerCase();
        const normDest = destination.trim().toLowerCase();

        function getCityName(city) {
            return city.replace(/, [A-Z]{2}$/i, '').trim().toLowerCase();
        }

        // Fuzzy first
        for (let route of this.routes) {
            const rOrigin = getCityName(route.origin);
            const rDest = getCityName(route.destination);
            if (
                (normOrigin.includes(rOrigin) && normDest.includes(rDest)) ||
                (normOrigin.includes(rDest) && normDest.includes(rOrigin))
            ) {
                console.log(`   🟡 FUZZY: ${route.origin} ↔ ${route.destination} (${route.distanceKm}km)`);
                return route.distanceKm;
            }
        }

        // Exact
        for (let route of this.routes) {
            const rOrigin = route.origin.toLowerCase();
            const rDest = route.destination.toLowerCase();
            if (
                (rOrigin === normOrigin && rDest === normDest) ||
                (rOrigin === normDest && rDest === normOrigin)
            ) {
                console.log(`   ✅ EXATO: ${route.distanceKm}km`);
                return route.distanceKm;
            }
        }

        console.log('   ❌ Rota não encontrada');
        return null;
    }
};

window.RoutesDB = RoutesDB;

console.log('RoutesDB carregado com fuzzy + bidirecionais!');

