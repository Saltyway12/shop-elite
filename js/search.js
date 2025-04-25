/**
 * search.js - Module de gestion de la recherche et des filtres
 *
 * Ce module gère:
 * - La barre de recherche en temps réel
 * - Les filtres par catégorie
 * - Le tri des produits selon différents critères
 * - L'interface utilisateur associée à ces fonctionnalités
 */

const Search = {
	/**
	 * État interne du module et références DOM
	 * Ces propriétés sont initialisées dans la méthode init()
	 */
	searchBarVisible: false, // État de visibilité de la barre de recherche
	searchBar: null, // Élément DOM de la barre de recherche
	searchIcon: null, // Icône de recherche
	searchInput: null, // Champ de saisie de la recherche
	searchClose: null, // Bouton de fermeture de la barre de recherche

	/**
	 * Initialise le module de recherche
	 *
	 * Cette méthode:
	 * - Récupère les références DOM nécessaires
	 * - Crée la barre de recherche (initialement cachée)
	 * - Configure les écouteurs d'événements pour la recherche
	 */
	init() {
		// Récupérer l'icône de recherche
		this.searchIcon = document.querySelector(".icon-recherche");

		// Créer la barre de recherche (initialement cachée)
		this.searchBar = document.createElement("div");
		this.searchBar.className = "search-bar";
		this.searchBar.innerHTML = `
      <input type="text" id="search-input" placeholder="Rechercher un produit...">
      <button id="search-close">×</button>
    `;
		document.querySelector(".Menu").appendChild(this.searchBar);

		// Récupérer les éléments de la barre de recherche
		this.searchInput = document.getElementById("search-input");
		this.searchClose = document.getElementById("search-close");

		// Ajouter les écouteurs d'événements
		if (this.searchIcon) {
			this.searchIcon.addEventListener("click", () => this.toggleSearchBar());
		}

		if (this.searchClose) {
			this.searchClose.addEventListener("click", () => this.toggleSearchBar());
		}

		if (this.searchInput) {
			this.searchInput.addEventListener("input", () => this.performSearch());
		}
	},

	/**
	 * Crée et ajoute la barre de filtres au-dessus de la liste des produits
	 *
	 * Cette méthode:
	 * - Extrait les catégories uniques des produits disponibles
	 * - Crée les sélecteurs pour le filtrage par catégorie et le tri
	 * - Ajoute les écouteurs d'événements pour les changements de filtre et de tri
	 */
	createFilterBar() {
		const allProducts = window.ShopElite.state.allProducts;
		const self = this; // Référence à this pour utilisation dans les fonctions/callbacks

		// Récupérer les catégories uniques depuis les produits
		const uniqueCategories = [
			...new Set(allProducts.map((product) => product.category)),
		];
		const categories = ["all", ...uniqueCategories]; // Ajouter "all" comme première option

		// Créer la barre de filtres
		const filterBar = document.createElement("div");
		filterBar.className = "filter-bar";

		// Section des catégories
		const categoryFilter = document.createElement("div");
		categoryFilter.className = "category-filter";
		categoryFilter.innerHTML = `
      <label for="category-select">Catégorie:</label>
      <select id="category-select">
        ${categories
					.map(
						(category) => `
          <option value="${category}">${
							category === "all"
								? "Toutes les catégories"
								: self.capitalizeFirstLetter(category)
						}</option>
        `
					)
					.join("")}
      </select>
    `;

		// Section de tri (prix, popularité)
		const sortFilter = document.createElement("div");
		sortFilter.className = "sort-filter";
		sortFilter.innerHTML = `
      <label for="sort-select">Trier par:</label>
      <select id="sort-select">
        <option value="default">Par défaut</option>
        <option value="price-asc">Prix croissant</option>
        <option value="price-desc">Prix décroissant</option>
        <option value="rating">Meilleures évaluations</option>
      </select>
    `;

		// Assembler la barre de filtres
		filterBar.appendChild(categoryFilter);
		filterBar.appendChild(sortFilter);

		// Ajouter la barre de filtres au conteneur
		const container = document.querySelector(".container");
		const productsContainer = document.getElementById("products-container");
		if (container && productsContainer) {
			container.insertBefore(filterBar, productsContainer);
		}

		// Ajouter les écouteurs d'événements
		document
			.getElementById("category-select")
			.addEventListener("change", (e) => this.handleCategoryChange(e));
		document
			.getElementById("sort-select")
			.addEventListener("change", (e) => this.handleSortChange(e));
	},

	/**
	 * Affiche ou masque la barre de recherche
	 *
	 * Cette méthode:
	 * - Bascule l'état de visibilité de la barre de recherche
	 * - Met à jour l'interface en conséquence
	 * - Restaure l'affichage de tous les produits lorsque la recherche est fermée
	 */
	toggleSearchBar() {
		this.searchBarVisible = !this.searchBarVisible;
		this.searchBar.classList.toggle("active", this.searchBarVisible);

		if (this.searchBarVisible) {
			// Mettre le focus sur le champ de recherche lorsqu'il est affiché
			this.searchInput.focus();
		} else {
			// Réinitialiser le champ de recherche et l'affichage des produits
			this.searchInput.value = "";
			// Si la recherche est fermée, afficher tous les produits
			if (window.ShopElite.state.allProducts.length > 0) {
				Products.displayProducts(window.ShopElite.state.allProducts);
			}
		}
	},

	/**
	 * Effectue la recherche en temps réel
	 *
	 * Cette méthode:
	 * - Récupère le terme de recherche saisi par l'utilisateur
	 * - Filtre les produits selon ce terme (titre, description, catégorie)
	 * - Affiche les résultats filtrés ou un message si aucun résultat
	 * - Propose un bouton pour réinitialiser la recherche
	 */
	performSearch() {
		const searchTerm = this.searchInput.value.toLowerCase().trim();
		const allProducts = window.ShopElite.state.allProducts;

		if (!searchTerm) {
			// Si le champ de recherche est vide, afficher tous les produits
			Products.displayProducts(allProducts);
			return;
		}

		// Filtrer les produits selon le terme de recherche
		const filteredProducts = allProducts.filter((product) => {
			const title = product.title.toLowerCase();
			const description = product.description.toLowerCase();
			const category = product.category.toLowerCase();

			return (
				title.includes(searchTerm) ||
				description.includes(searchTerm) ||
				category.includes(searchTerm)
			);
		});

		// Afficher les résultats filtrés
		Products.displayProducts(filteredProducts);

		// Afficher un message si aucun résultat
		const productsContainer = document.getElementById("products-container");
		if (filteredProducts.length === 0 && productsContainer) {
			productsContainer.innerHTML = `
        <div class="no-results">
          <p>Aucun produit ne correspond à votre recherche "${searchTerm}"</p>
          <button id="reset-search" class="button-formation">Voir tous les produits</button>
        </div>
      `;

			document.getElementById("reset-search").addEventListener("click", () => {
				this.searchInput.value = "";
				Products.displayProducts(allProducts);
			});
		}
	},

	/**
	 * Gère le changement de catégorie
	 *
	 * Cette méthode:
	 * - Met à jour l'état global avec la nouvelle catégorie sélectionnée
	 * - Applique les filtres et le tri pour mettre à jour l'affichage
	 *
	 * @param {Event} e - L'événement de changement de catégorie
	 */
	handleCategoryChange(e) {
		window.ShopElite.updateState({ activeCategory: e.target.value });
		this.applyFiltersAndSort();
	},

	/**
	 * Gère le changement de tri
	 *
	 * Cette méthode:
	 * - Met à jour l'état global avec le nouveau critère de tri sélectionné
	 * - Applique les filtres et le tri pour mettre à jour l'affichage
	 *
	 * @param {Event} e - L'événement de changement de tri
	 */
	handleSortChange(e) {
		window.ShopElite.updateState({ activeSorting: e.target.value });
		this.applyFiltersAndSort();
	},

	/**
	 * Applique les filtres et le tri sélectionnés
	 *
	 * Cette méthode:
	 * - Récupère l'état actuel des filtres et du tri
	 * - Applique d'abord le filtre par catégorie
	 * - Puis applique le tri si nécessaire
	 * - Met à jour l'affichage avec les produits filtrés et triés
	 */
	applyFiltersAndSort() {
		const allProducts = window.ShopElite.state.allProducts;
		const activeCategory = window.ShopElite.state.activeCategory;
		const activeSorting = window.ShopElite.state.activeSorting;

		// Filtrer par catégorie
		let filteredProducts = Products.filterByCategory(
			allProducts,
			activeCategory
		);

		// Appliquer le tri si nécessaire
		if (activeSorting !== "default") {
			filteredProducts = Products.sortProducts(filteredProducts, activeSorting);
		}

		// Afficher les produits filtrés et triés
		Products.displayProducts(filteredProducts);
	},

	/**
	 * Met en majuscule la première lettre d'une chaîne
	 *
	 * Utilitaire pour améliorer l'affichage des catégories dans le menu déroulant
	 *
	 * @param {string} string - La chaîne à transformer
	 * @returns {string} La chaîne avec la première lettre en majuscule
	 */
	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},
};

// Dans un environnement de modules ES, on exporterait ainsi:
// export default Search;

// Pour notre structure actuelle sans bundler:
window.Search = Search;
