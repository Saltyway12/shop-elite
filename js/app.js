/**
 * app.js - Point d'entrée principal de l'application Shop Elite
 *
 * Ce module est responsable de l'initialisation de l'application.
 * Il coordonne les différents modules, gère l'état global et lance
 * le chargement initial des données.
 */

/**
 * État global partagé entre les modules
 *
 * Cet objet contient l'état centralisé de l'application, accessible par tous les modules.
 * Il inclut:
 * - allProducts: liste complète des produits chargés depuis l'API
 * - cart: contenu du panier d'achat, persistant grâce à localStorage
 * - activeCategory: filtre de catégorie actuellement appliqué
 * - activeSorting: méthode de tri actuellement appliquée
 */
const state = {
	allProducts: [],
	cart: JSON.parse(localStorage.getItem("shopEliteCart")) || [],
	activeCategory: "all",
	activeSorting: "default",
};

/**
 * Fonction d'initialisation exécutée au chargement du DOM
 *
 * Cette fonction lance tous les processus d'initialisation nécessaires:
 * 1. Configure la section visible au démarrage
 * 2. Initialise les modules Cart, Search et Modals
 * 3. Charge les produits depuis l'API et les affiche
 * 4. Gère les erreurs potentielles lors du chargement
 */
document.addEventListener("DOMContentLoaded", function () {
	console.log("Initialisation de Shop Elite...");

	// Initialiser la section visible au démarrage (accueil par défaut)
	UI.toggleSection("accueil");

	// Initialiser les différents modules fonctionnels
	Cart.init();
	Search.init();
	Modals.init();

	// Charger les produits depuis l'API
	Api.fetchProducts()
		.then((products) => {
			// Mettre à jour l'état global avec les produits
			state.allProducts = products;
			// Afficher les produits dans l'interface
			Products.displayProducts(products);
			// Créer la barre de filtre des catégories
			Search.createFilterBar();
		})
		.catch((error) => {
			// Gestion des erreurs: afficher un message à l'utilisateur
			console.error("Erreur lors de l'initialisation:", error);
			const productsContainer = document.getElementById("products-container");
			if (productsContainer) {
				productsContainer.innerHTML = `
          <p style="text-align:center;color:red;grid-column:1/-1">
            Erreur lors du chargement des produits. Veuillez réessayer plus tard.
          </p>`;
			}
		});
});

/**
 * Objet global ShopElite pour partager l'état et les méthodes entre modules
 *
 * Cet objet expose:
 * - state: l'état global de l'application
 * - updateState: méthode pour mettre à jour l'état de manière contrôlée
 */
window.ShopElite = {
	state,
	/**
	 * Met à jour l'état global de l'application
	 *
	 * Cette méthode fusionne les nouvelles valeurs avec l'état existant,
	 * permettant des mises à jour partielles.
	 *
	 * @param {Object} newState - Objet contenant les propriétés à mettre à jour
	 */
	updateState(newState) {
		Object.assign(state, newState);
	},
};
