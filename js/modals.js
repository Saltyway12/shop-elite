/**
 * modals.js - Module de gestion des fenêtres modales
 *
 * Ce module gère toutes les modales de l'application:
 * - Modale de mot de passe oublié
 * - Modale de création de compte
 * - Navigation entre les sections
 * - Fonctionnalités communes (fermeture avec Escape, etc.)
 */

const Modals = {
	/**
	 * Références aux éléments DOM des modales
	 * Ces propriétés sont initialisées dans la méthode init()
	 */
	buttonMdp: null, // Bouton "Mot de passe oublié"
	buttonFermer: null, // Bouton de fermeture de la modale mot de passe
	modaleMdp: null, // Modale "Mot de passe oublié"
	buttonCompte: null, // Bouton "Je crée mon compte"
	modalCompte: null, // Modale de création de compte
	buttonFermerCompte: null, // Bouton de fermeture de la modale compte
	logoEyes1: null, // Icône œil ouvert (mot de passe visible)
	logoEyes2: null, // Icône œil fermé (mot de passe masqué)
	inputMDP: null, // Champ de saisie du mot de passe

	/**
	 * Initialise toutes les modales de l'application
	 *
	 * Cette méthode:
	 * - Récupère les références DOM nécessaires
	 * - Initialise chaque sous-composant de gestion des modales
	 */
	init() {
		// Récupérer tous les éléments DOM nécessaires
		this.buttonMdp = document.getElementById("button-mdp");
		this.buttonFermer = document.querySelector(".button-fermer");
		this.modaleMdp = document.querySelector(".modal-mdp");

		this.buttonCompte = document.getElementById("buttonCompte");
		this.modalCompte = document.querySelector(".modal-compte");
		this.buttonFermerCompte = document.getElementById("buttonFermerCompte");

		this.logoEyes1 = document.querySelector(".LogoEyes1");
		this.logoEyes2 = document.querySelector(".LogoEyes2");
		this.inputMDP = document.querySelector(".inputMDP");

		// Initialiser les écouteurs pour chaque modale
		this.initPasswordModal(); // Modale "Mot de passe oublié"
		this.initAccountModal(); // Modale "Création de compte"
		this.initPasswordVisibility(); // Visibilité du mot de passe
		this.initGlobalListeners(); // Écouteurs globaux (ex: Escape)
		this.initSectionNavigation(); // Navigation entre sections
	},

	/**
	 * Initialise la modale "Mot de passe oublié"
	 *
	 * Configure les écouteurs d'événements pour:
	 * - Ouvrir la modale au clic sur le bouton correspondant
	 * - Fermer la modale au clic sur le bouton de fermeture
	 * - Fermer la modale au clic à l'extérieur
	 */
	initPasswordModal() {
		if (this.buttonMdp && this.buttonFermer && this.modaleMdp) {
			this.buttonMdp.addEventListener("click", (e) => {
				e.preventDefault();
				this.modaleMdp.classList.add("active");
			});

			this.buttonFermer.addEventListener("click", (e) => {
				e.preventDefault();
				this.modaleMdp.classList.remove("active");
			});

			// Fermer la modale en cliquant à l'extérieur
			this.modaleMdp.addEventListener("click", (e) => {
				if (e.target === this.modaleMdp) {
					this.modaleMdp.classList.remove("active");
				}
			});
		}
	},

	/**
	 * Initialise la modale "Création de compte"
	 *
	 * Configure les écouteurs d'événements pour:
	 * - Ouvrir la modale au clic sur le bouton "Je crée mon compte"
	 * - Fermer la modale au clic sur le bouton de fermeture
	 * - Fermer la modale au clic à l'extérieur
	 */
	initAccountModal() {
		if (this.buttonCompte && this.buttonFermerCompte && this.modalCompte) {
			this.buttonCompte.addEventListener("click", (e) => {
				e.preventDefault();
				this.modalCompte.classList.add("active");
			});

			this.buttonFermerCompte.addEventListener("click", (e) => {
				e.preventDefault();
				this.modalCompte.classList.remove("active");
			});

			// Fermer la modale en cliquant à l'extérieur
			this.modalCompte.addEventListener("click", (e) => {
				if (e.target === this.modalCompte) {
					this.modalCompte.classList.remove("active");
				}
			});
		}
	},

	/**
	 * Initialise la fonctionnalité de visibilité du mot de passe
	 *
	 * Cette méthode permet de basculer entre:
	 * - Affichage en clair du mot de passe (type="text")
	 * - Masquage du mot de passe (type="password")
	 * en cliquant sur les icônes d'œil ouvert/fermé
	 */
	initPasswordVisibility() {
		if (this.logoEyes1 && this.logoEyes2 && this.inputMDP) {
			this.logoEyes1.addEventListener("click", () => {
				this.inputMDP.type = "password";
				this.logoEyes1.style.display = "none";
				this.logoEyes2.style.display = "block";
			});

			this.logoEyes2.addEventListener("click", () => {
				this.inputMDP.type = "text";
				this.logoEyes2.style.display = "none";
				this.logoEyes1.style.display = "block";
			});
		}
	},

	/**
	 * Initialise les écouteurs globaux (touche Escape)
	 *
	 * Cette méthode configure l'écoute de la touche Escape pour:
	 * - Fermer toutes les modales ouvertes
	 * - Fermer la modale de détail produit si elle existe
	 * - Fermer la modale du panier si elle existe
	 *
	 * Améliore l'ergonomie en permettant une fermeture rapide au clavier
	 */
	initGlobalListeners() {
		// Ajouter un écouteur pour la touche Escape pour fermer les modales
		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape") {
				// Fermer toutes les modales
				if (this.modaleMdp) this.modaleMdp.classList.remove("active");
				if (this.modalCompte) this.modalCompte.classList.remove("active");

				// Fermer également la modale de détail produit si elle existe
				const productDetail = document.querySelector(".product-detail");
				if (productDetail) productDetail.remove();

				// Fermer la modale du panier si elle existe
				const cartModal = document.querySelector(".cart-modal");
				const cartOverlay = document.querySelector(".cart-overlay");
				if (cartModal) cartModal.remove();
				if (cartOverlay) cartOverlay.remove();
			}
		});
	},

	/**
	 * Initialise la navigation entre les sections
	 *
	 * Cette méthode configure les liens de navigation pour changer de section
	 * (accueil, login) sans rechargement de page, en utilisant:
	 * - Les attributs href des liens pour déterminer la section cible
	 * - La méthode UI.toggleSection pour effectuer le changement
	 */
	initSectionNavigation() {
		// Gestion des clics sur les liens de navigation avec section
		document.querySelectorAll("a[href^='#']").forEach((link) => {
			link.addEventListener("click", function (e) {
				const sectionId = this.getAttribute("href").substring(1);
				const section = document.getElementById(sectionId);

				if (section && (sectionId === "accueil" || sectionId === "login")) {
					e.preventDefault();
					UI.toggleSection(sectionId);
				}
			});
		});
	},
};

// Dans un environnement de modules ES, on exporterait ainsi:
// export default Modals;

// Pour notre structure actuelle sans bundler:
window.Modals = Modals;
