/**
 * cart.js - Module de gestion du panier d'achat
 *
 * Ce module est responsable de toutes les fonctionnalités liées au panier:
 * - Ajout et suppression de produits
 * - Mise à jour des quantités
 * - Affichage et mise à jour de l'interface du panier
 * - Persistance des données du panier entre les sessions
 */

const Cart = {
	/**
	 * Référence à l'élément DOM de l'icône du panier
	 * Initialisée dans la méthode init()
	 */
	cartIcon: null,

	/**
	 * Initialise le module du panier
	 *
	 * Cette méthode:
	 * - Récupère les références DOM nécessaires
	 * - Charge le panier depuis localStorage
	 * - Met à jour l'interface visuelle
	 * - Configure les écouteurs d'événements
	 */
	init() {
		// Récupérer l'élément DOM de l'icône du panier
		this.cartIcon = document.querySelector(".icon-panier-container");

		// Charger le panier depuis localStorage
		const cart = JSON.parse(localStorage.getItem("shopEliteCart")) || [];
		window.ShopElite.updateState({ cart });

		// Mettre à jour l'interface
		this.updateCartIcon();

		// Ajouter l'écouteur d'événement pour le clic sur l'icône
		if (this.cartIcon) {
			this.cartIcon.addEventListener("click", () => this.toggleCart());
		}
	},

	/**
	 * Ajoute un produit au panier
	 *
	 * Cette méthode ajoute un nouveau produit ou incrémente la quantité
	 * si le produit est déjà présent dans le panier.
	 *
	 * @param {number} productId - L'identifiant unique du produit à ajouter
	 * @param {Object} productData - Les données complètes du produit
	 */
	addToCart(productId, productData) {
		const cart = window.ShopElite.state.cart;

		// Vérifier si le produit est déjà dans le panier
		const existingProduct = cart.find(
			(item) => item.id === parseInt(productId)
		);

		if (existingProduct) {
			// Incrementer la quantité si déjà présent
			existingProduct.quantity += 1;
		} else {
			// Sinon, ajouter le produit avec quantité 1
			cart.push({
				id: parseInt(productId),
				title: productData.title,
				price: productData.price,
				image: productData.image,
				quantity: 1,
			});
		}

		// Mettre à jour l'état global et sauvegarder
		window.ShopElite.updateState({ cart });
		this.saveCart();
		this.updateCartIcon();
		this.showCartNotification(productData.title);
	},

	/**
	 * Sauvegarde le panier dans localStorage
	 *
	 * Cette méthode assure la persistance du panier entre les sessions
	 * en sauvegardant son contenu dans le stockage local du navigateur.
	 */
	saveCart() {
		localStorage.setItem(
			"shopEliteCart",
			JSON.stringify(window.ShopElite.state.cart)
		);
	},

	/**
	 * Met à jour l'icône du panier avec le badge indiquant le nombre d'articles
	 *
	 * Cette méthode:
	 * - Calcule le nombre total d'articles dans le panier
	 * - Supprime tout badge existant
	 * - Crée un nouveau badge si le panier n'est pas vide
	 */
	updateCartIcon() {
		if (!this.cartIcon) return;

		const cart = window.ShopElite.state.cart;

		// Calculer le nombre total d'articles
		const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

		// Supprimer le badge existant s'il y en a un
		const existingBadge = document.querySelector(".cart-badge");
		if (existingBadge) {
			existingBadge.remove();
		}

		// Créer un nouveau badge si le panier n'est pas vide
		if (totalItems > 0) {
			const badge = document.createElement("div");
			badge.className = "cart-badge";
			badge.textContent = totalItems;

			// Ajouter le badge comme enfant direct de l'icône du panier
			this.cartIcon.appendChild(badge);
		}
	},

	/**
	 * Affiche ou masque la modale du panier
	 *
	 * Cette méthode bascule l'affichage du panier:
	 * - Si le panier est actuellement affiché, le ferme
	 * - Sinon, appelle displayCart() pour l'afficher
	 */
	toggleCart() {
		// Vérifier si le panier est déjà affiché
		let cartModal = document.querySelector(".cart-modal");

		if (cartModal) {
			cartModal.remove();
			// Supprimer également l'overlay si présent
			const overlay = document.querySelector(".cart-overlay");
			if (overlay) overlay.remove();
		} else {
			this.displayCart();
		}
	},

	/**
	 * Affiche le contenu du panier dans une modale
	 *
	 * Cette méthode:
	 * - Crée la structure HTML de la modale du panier
	 * - Ajoute les écouteurs d'événements nécessaires
	 * - Appelle updateCartDisplay() pour remplir la modale avec les produits
	 * - Gère la responsivité avec des ajustements selon la taille de l'écran
	 */
	displayCart() {
		// Créer la modale du panier
		const cartModal = document.createElement("div");
		cartModal.className = "cart-modal";

		// En-tête du panier
		let cartContent = `
      <div class="cart-header">
        <h2>Votre Panier</h2>
        <button class="close-cart">&times;</button>
      </div>
    `;

		// Conteneur des articles du panier avec défilement
		cartContent += `<div class="cart-items">`;

		// Le contenu sera rempli par updateCartDisplay()
		cartContent += `</div>`;

		// Pied de panier avec total et bouton de validation
		cartContent += `
      <div class="cart-footer">
        <div class="cart-total">
          <span class="cart-total-label">Total:</span>
          <span class="cart-total-value">0.00 €</span>
        </div>
        <button class="checkout-btn button-formation">Valider ma commande</button>
      </div>
    `;

		// Injecter le contenu dans la modale
		cartModal.innerHTML = cartContent;
		document.body.appendChild(cartModal);

		// Ajouter une animation d'entrée
		setTimeout(() => {
			cartModal.classList.add("active");
		}, 10);

		// Ajouter l'overlay pour fermer le panier en cliquant à l'extérieur
		const cartOverlay = document.createElement("div");
		cartOverlay.className = "cart-overlay";
		document.body.appendChild(cartOverlay);

		cartOverlay.addEventListener("click", () => {
			cartModal.remove();
			cartOverlay.remove();
		});

		// Écouteurs d'événements pour les boutons du panier
		cartModal.querySelector(".close-cart").addEventListener("click", () => {
			cartModal.remove();
			cartOverlay.remove();
		});

		// Écouteur pour le bouton de validation
		const checkoutBtn = cartModal.querySelector(".checkout-btn");
		if (checkoutBtn) {
			checkoutBtn.addEventListener("click", () => {
				this.checkout();
				cartOverlay.remove();
			});
		}

		// Mettre à jour l'affichage du panier avec les produits
		this.updateCartDisplay();

		/**
		 * Ajuste la taille de la modale du panier selon la taille de l'écran
		 * Améliore l'expérience utilisateur sur les appareils mobiles
		 */
		function adjustCartForMobile() {
			if (window.innerWidth <= 576) {
				cartModal.style.width = "100%";
			} else {
				cartModal.style.width = "400px";
			}
		}

		// Ajuster la taille initiale et lors du redimensionnement
		adjustCartForMobile();
		window.addEventListener("resize", adjustCartForMobile);
	},

	/**
	 * Met à jour l'affichage du panier sans le recréer entièrement
	 *
	 * Cette méthode:
	 * - Met à jour le contenu de la modale du panier existante
	 * - Recalcule le prix total
	 * - Ajoute des écouteurs d'événements pour les boutons de chaque produit
	 * - Affiche un message si le panier est vide
	 */
	updateCartDisplay() {
		const cartModal = document.querySelector(".cart-modal");
		if (!cartModal) return;

		const cart = window.ShopElite.state.cart;

		// Calculer le total du panier
		let totalPrice = cart.reduce(
			(total, item) => total + item.price * item.quantity,
			0
		);

		// Mettre à jour le contenu des articles
		const cartItemsContainer = cartModal.querySelector(".cart-items");
		if (cartItemsContainer) {
			// Vider le contenu actuel
			cartItemsContainer.innerHTML = "";

			// Si le panier est vide
			if (cart.length === 0) {
				cartItemsContainer.innerHTML = `<p class="cart-empty">Votre panier est vide</p>`;
				// Cacher le footer du panier si nécessaire
				const footerElement = cartModal.querySelector(".cart-footer");
				if (footerElement) footerElement.style.display = "none";
				return;
			} else {
				// S'assurer que le footer est visible
				const footerElement = cartModal.querySelector(".cart-footer");
				if (footerElement) footerElement.style.display = "block";
			}

			// Ajouter chaque article au panier
			cart.forEach((item) => {
				const itemElement = document.createElement("div");
				itemElement.className = "cart-item";

				itemElement.innerHTML = `
          <div class="cart-item-image">
            <img src="${item.image}" alt="${item.title}">
          </div>
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.title}</h4>
            <div class="cart-item-price">${item.price.toFixed(2)} €</div>
          </div>
          <div class="cart-item-actions">
            <button class="quantity-btn decrease" data-id="${
							item.id
						}">-</button>
            <span class="quantity-value">${item.quantity}</span>
            <button class="quantity-btn increase" data-id="${
							item.id
						}">+</button>
            <button class="remove-item" data-id="${item.id}">🗑️</button>
          </div>
        `;

				cartItemsContainer.appendChild(itemElement);
			});

			// Ajouter les écouteurs d'événements pour les boutons
			cartItemsContainer
				.querySelectorAll(".quantity-btn.decrease")
				.forEach((button) => {
					button.addEventListener("click", () => {
						const productId = parseInt(button.dataset.id);
						this.updateQuantity(productId, -1);
					});
				});

			cartItemsContainer
				.querySelectorAll(".quantity-btn.increase")
				.forEach((button) => {
					button.addEventListener("click", () => {
						const productId = parseInt(button.dataset.id);
						this.updateQuantity(productId, 1);
					});
				});

			cartItemsContainer.querySelectorAll(".remove-item").forEach((button) => {
				button.addEventListener("click", () => {
					const productId = parseInt(button.dataset.id);
					this.removeFromCart(productId);
				});
			});
		}

		// Mettre à jour le total dans le pied de page
		const footerElement = cartModal.querySelector(".cart-footer");
		if (footerElement) {
			const totalElement = footerElement.querySelector(".cart-total-value");
			if (totalElement) {
				totalElement.textContent = `${totalPrice.toFixed(2)} €`;
			}
		}
	},

	/**
	 * Met à jour la quantité d'un produit dans le panier
	 *
	 * Cette méthode:
	 * - Augmente ou diminue la quantité d'un produit
	 * - Supprime le produit si la quantité devient ≤ 0
	 * - Met à jour l'état global, sauvegarde et actualise l'interface
	 *
	 * @param {number} productId - L'identifiant du produit à mettre à jour
	 * @param {number} change - La modification de quantité (+1 ou -1)
	 */
	updateQuantity(productId, change) {
		const cart = window.ShopElite.state.cart;
		const productIndex = cart.findIndex((item) => item.id === productId);

		if (productIndex !== -1) {
			cart[productIndex].quantity += change;

			// Supprimer le produit si la quantité est inférieure ou égale à 0
			if (cart[productIndex].quantity <= 0) {
				cart.splice(productIndex, 1);
			}

			// Mettre à jour l'état global et sauvegarder
			window.ShopElite.updateState({ cart });
			this.saveCart();
			this.updateCartIcon();

			// Mettre à jour le panier existant au lieu d'en créer un nouveau
			this.updateCartDisplay();
		}
	},

	/**
	 * Supprime un produit du panier
	 *
	 * Cette méthode:
	 * - Filtre le panier pour retirer le produit spécifié
	 * - Met à jour l'état global, sauvegarde et actualise l'interface
	 *
	 * @param {number} productId - L'identifiant du produit à supprimer
	 */
	removeFromCart(productId) {
		const cart = window.ShopElite.state.cart.filter(
			(item) => item.id !== productId
		);

		window.ShopElite.updateState({ cart });
		this.saveCart();
		this.updateCartIcon();

		// Mettre à jour le panier existant au lieu d'en créer un nouveau
		this.updateCartDisplay();
	},

	/**
	 * Traite la validation de la commande
	 *
	 * Cette méthode:
	 * - Simule la finalisation d'une commande
	 * - Vide le panier après validation
	 * - Ferme la modale du panier
	 *
	 * Note: En situation réelle, redirigerait vers un processus de paiement
	 */
	checkout() {
		// Simulation de finalisation de commande
		alert(
			"Merci pour votre commande ! En situation réelle, vous seriez redirigé vers une page de paiement."
		);

		// Vider le panier après validation
		window.ShopElite.updateState({ cart: [] });
		this.saveCart();
		this.updateCartIcon();

		// Fermer la modale du panier
		const cartModal = document.querySelector(".cart-modal");
		const cartOverlay = document.querySelector(".cart-overlay");
		if (cartModal) cartModal.remove();
		if (cartOverlay) cartOverlay.remove();
	},

	/**
	 * Affiche une notification temporaire après ajout au panier
	 *
	 * Cette méthode:
	 * - Crée une notification visuelle pour informer l'utilisateur
	 * - Applique une animation de fondu pour l'entrée et la sortie
	 * - Supprime automatiquement la notification après un délai
	 *
	 * @param {string} productTitle - Le titre du produit ajouté
	 */
	showCartNotification(productTitle) {
		// Supprimer toute notification existante
		const existingNotification = document.querySelector(".cart-notification");
		if (existingNotification) {
			existingNotification.remove();
		}

		// Créer une nouvelle notification
		const notification = document.createElement("div");
		notification.className = "cart-notification";
		notification.textContent = `${productTitle} ajouté au panier !`;

		// Ajouter au document
		document.body.appendChild(notification);

		// Supprimer après quelques secondes avec animation
		setTimeout(() => {
			notification.style.opacity = "0";
			setTimeout(() => {
				notification.remove();
			}, 500);
		}, 3000);
	},
};

// Dans un environnement de modules ES, on exporterait ainsi:
// export default Cart;

// Pour notre structure actuelle sans bundler:
window.Cart = Cart;
