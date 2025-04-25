/**
 * products.js - Module de gestion de l'affichage des produits
 *
 * Ce module gère tout ce qui concerne l'affichage, le tri et le filtrage des produits:
 * - Création et affichage des cartes produit
 * - Affichage du détail d'un produit
 * - Tri des produits selon différents critères
 * - Filtrage des produits par catégorie
 */

const Products = {
	/**
	 * Élément DOM du conteneur de produits
	 * Cette référence est initialisée dans la méthode init()
	 */
	productsContainer: null,

	/**
	 * Initialise le module de produits
	 *
	 * Récupère la référence à l'élément DOM du conteneur de produits
	 */
	init() {
		this.productsContainer = document.getElementById("products-container");
	},

	/**
	 * Affiche la liste des produits dans le conteneur
	 *
	 * Cette méthode:
	 * - Vérifie l'existence du conteneur
	 * - Nettoie le conteneur de tout contenu existant
	 * - Affiche un message si aucun produit n'est disponible
	 * - Crée et ajoute une carte produit pour chaque produit
	 *
	 * @param {Array} products - Tableau des produits à afficher
	 */
	displayProducts(products) {
		if (!this.productsContainer) {
			this.productsContainer = document.getElementById("products-container");
			if (!this.productsContainer) return;
		}

		// Nettoyer le conteneur
		this.productsContainer.innerHTML = "";

		// Si aucun produit, afficher un message
		if (products.length === 0) {
			this.productsContainer.innerHTML = `
        <p style="text-align:center;grid-column:1/-1">
          Aucun produit trouvé.
        </p>`;
			return;
		}

		// Créer et ajouter chaque carte produit
		products.forEach((product) => {
			const productCard = this.createProductCard(product);
			this.productsContainer.appendChild(productCard);
		});
	},

	/**
	 * Crée un élément DOM représentant une carte produit
	 *
	 * Cette méthode:
	 * - Crée la structure HTML d'une carte produit
	 * - Ajoute les écouteurs d'événements pour le panier et les détails
	 * - Formate et affiche les informations du produit
	 *
	 * @param {Object} product - Les données du produit
	 * @returns {HTMLElement} Élément DOM de la carte produit
	 */
	createProductCard(product) {
		const productCard = document.createElement("div");
		productCard.className = "product-card";
		productCard.dataset.id = product.id;

		// Construire le HTML de la carte
		productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}">
      </div>
      <div class="product-info">
        <div class="product-category">${product.category}</div>
        <h3 class="product-title">${product.title}</h3>
        <div class="product-price">${product.price.toFixed(2)} €</div>
        <p class="product-description">${product.description}</p>
        <button class="add-to-cart button-formation" data-id="${
					product.id
				}">Ajouter au panier</button>
      </div>
    `;

		// Ajouter les écouteurs d'événements
		productCard.querySelector(".add-to-cart").addEventListener("click", (e) => {
			e.stopPropagation(); // Empêcher l'ouverture du détail produit
			const productId = e.target.dataset.id;
			Cart.addToCart(productId, product);
		});

		// Ouvrir le détail produit au clic sur la carte
		productCard.addEventListener("click", () => {
			const productId = productCard.dataset.id;
			this.showProductDetail(productId);
		});

		return productCard;
	},

	/**
	 * Affiche le détail d'un produit dans une modale
	 *
	 * Cette méthode:
	 * - Récupère les données complètes du produit via l'API
	 * - Crée une modale avec le détail du produit
	 * - Ajoute les écouteurs d'événements pour la navigation et l'ajout au panier
	 *
	 * @param {number} productId - L'identifiant du produit à afficher
	 */
	showProductDetail(productId) {
		Api.fetchProductById(productId).then((product) => {
			if (!product) return;

			// Créer la modale
			const modal = document.createElement("div");
			modal.className = "product-detail";

			// Contenu de la modale
			const modalContent = document.createElement("div");
			modalContent.className = "product-detail-content";

			// Remplir le contenu avec les détails du produit
			modalContent.innerHTML = `
        <button class="close-modal">&times;</button>
        <div class="product-detail-flex">
          <div class="product-detail-image">
            <img src="${product.image}" alt="${product.title}">
          </div>
          <div class="product-detail-info">
            <h2>${product.title}</h2>
            <div class="product-detail-price">${product.price.toFixed(
							2
						)} €</div>
            <div class="product-detail-description">
              <h3>Description:</h3>
              <p>${product.description}</p>
            </div>
            <div class="product-detail-category">
              <span>Catégorie: ${product.category}</span>
            </div>
            <button class="add-to-cart button-formation" data-id="${
							product.id
						}">Ajouter au panier</button>
          </div>
        </div>
      `;

			modal.appendChild(modalContent);
			document.body.appendChild(modal);

			// Gestion des événements de la modale
			modal.querySelector(".close-modal").addEventListener("click", () => {
				modal.remove();
			});

			modal.addEventListener("click", (e) => {
				if (e.target === modal) {
					modal.remove();
				}
			});

			modal.querySelector(".add-to-cart").addEventListener("click", () => {
				Cart.addToCart(product.id, product);
			});
		});
	},

	/**
	 * Trie les produits selon différents critères
	 *
	 * Cette méthode:
	 * - Crée une copie du tableau de produits pour éviter de modifier l'original
	 * - Applique différentes logiques de tri selon le critère spécifié
	 *
	 * @param {Array} products - Liste des produits à trier
	 * @param {string} sortType - Critère de tri (price-asc, price-desc, rating)
	 * @returns {Array} Liste des produits triés
	 */
	sortProducts(products, sortType) {
		const sortedProducts = [...products]; // Créer une copie pour ne pas modifier l'original

		switch (sortType) {
			case "price-asc":
				// Tri par prix croissant
				sortedProducts.sort((a, b) => a.price - b.price);
				break;
			case "price-desc":
				// Tri par prix décroissant
				sortedProducts.sort((a, b) => b.price - a.price);
				break;
			case "rating":
				// Tri par note (rating) décroissante
				sortedProducts.sort((a, b) => {
					// Vérifier si la propriété rating existe
					if (a.rating && b.rating) {
						return b.rating.rate - a.rating.rate;
					}
					return 0;
				});
				break;
		}

		return sortedProducts;
	},

	/**
	 * Filtre les produits par catégorie
	 *
	 * Cette méthode:
	 * - Retourne tous les produits si la catégorie est "all"
	 * - Sinon, filtre les produits pour ne retenir que ceux de la catégorie spécifiée
	 *
	 * @param {Array} products - Liste des produits à filtrer
	 * @param {string} category - Catégorie à filtrer
	 * @returns {Array} Liste des produits filtrés
	 */
	filterByCategory(products, category) {
		if (category === "all") {
			return products;
		}

		return products.filter((product) => product.category === category);
	},
};

// Dans un environnement de modules ES, on exporterait ainsi:
// export default Products;

// Pour notre structure actuelle sans bundler:
window.Products = Products;
