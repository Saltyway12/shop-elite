/**
 * api.js - Module de gestion des appels API pour Shop Elite
 *
 * Ce module encapsule toutes les interactions avec l'API Fake Store.
 * Il fournit des méthodes pour récupérer les produits, les détails d'un produit
 * et les produits par catégorie. Chaque méthode gère ses propres erreurs
 * et renvoie des promesses.
 */

const Api = {
	/**
	 * URL de base de l'API Fake Store
	 * Utilisée comme préfixe pour tous les appels API
	 */
	baseUrl: "https://fakestoreapi.com",

	/**
	 * Récupère tous les produits depuis l'API
	 *
	 * Cette méthode fait une requête GET pour obtenir la liste complète des produits.
	 * Elle convertit automatiquement la réponse en JSON et gère les erreurs.
	 *
	 * @returns {Promise<Array>} Promesse contenant un tableau d'objets produits
	 * @throws {Error} En cas d'échec de la requête réseau ou de conversion JSON
	 */
	fetchProducts() {
		return fetch(`${this.baseUrl}/products`)
			.then((response) => {
				if (!response.ok) {
					// Vérifier si la réponse HTTP est réussie (code 200-299)
					throw new Error("Erreur réseau: " + response.status);
				}
				return response.json();
			})
			.catch((error) => {
				// Journaliser l'erreur et la propager pour gestion externe
				console.error("Erreur lors de la récupération des produits:", error);
				throw error;
			});
	},

	/**
	 * Récupère un produit spécifique par son ID
	 *
	 * Cette méthode fait une requête GET pour obtenir les détails d'un produit unique
	 * à partir de son identifiant. Elle convertit la réponse en JSON et gère les erreurs.
	 *
	 * @param {number} id - L'identifiant du produit à récupérer
	 * @returns {Promise<Object>} Promesse contenant l'objet produit
	 * @throws {Error} En cas d'échec de la requête réseau ou de conversion JSON
	 */
	fetchProductById(id) {
		return fetch(`${this.baseUrl}/products/${id}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Erreur réseau: " + response.status);
				}
				return response.json();
			})
			.catch((error) => {
				console.error(
					`Erreur lors de la récupération du produit ${id}:`,
					error
				);
				throw error;
			});
	},

	/**
	 * Récupère les produits par catégorie
	 *
	 * Cette méthode fait une requête GET pour obtenir tous les produits
	 * appartenant à une catégorie spécifique. Elle convertit la réponse
	 * en JSON et gère les erreurs.
	 *
	 * @param {string} category - La catégorie des produits à récupérer
	 * @returns {Promise<Array>} Promesse contenant un tableau d'objets produits filtrés par catégorie
	 * @throws {Error} En cas d'échec de la requête réseau ou de conversion JSON
	 */
	fetchProductsByCategory(category) {
		return fetch(`${this.baseUrl}/products/category/${category}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error("Erreur réseau: " + response.status);
				}
				return response.json();
			})
			.catch((error) => {
				console.error(
					`Erreur lors de la récupération des produits de la catégorie ${category}:`,
					error
				);
				throw error;
			});
	},
};

// Dans un environnement de modules ES, on exporterait ainsi:
// export default Api;

// Pour notre structure actuelle sans bundler:
window.Api = Api;
