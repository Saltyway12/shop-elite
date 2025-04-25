/**
 * ui.js - Module de gestion générale de l'interface utilisateur
 *
 * Ce module gère les éléments d'interface partagés et les fonctionnalités
 * générales d'interface utilisateur qui ne sont pas spécifiques à un module:
 * - Navigation entre les sections (accueil, login)
 * - Système de notification pour l'utilisateur
 * - Initialisation générale de l'interface
 */

const UI = {
	/**
	 * Change la section visible (accueil ou login)
	 *
	 * Cette méthode:
	 * - Masque toutes les sections
	 * - Affiche uniquement la section demandée
	 * - Met à jour l'URL pour refléter la section active (sans rechargement)
	 *
	 * @param {string} section - L'identifiant de la section à afficher
	 */
	toggleSection(section) {
		// Masquer toutes les sections
		const sections = document.querySelectorAll("#accueil, #login");
		sections.forEach((s) => {
			s.style.display = "none";
		});

		// Afficher la section demandée
		const sectionToShow = document.getElementById(section);
		if (sectionToShow) {
			sectionToShow.style.display = "block";
		}

		// Mettre à jour l'URL pour refléter la section active (sans rechargement)
		history.pushState(null, null, `#${section}`);
	},

	/**
	 * Affiche une notification temporaire à l'utilisateur
	 *
	 * Cette méthode crée et affiche une notification stylisée qui:
	 * - Apparaît avec animation de fondu
	 * - Disparaît automatiquement après une durée spécifiée
	 * - Utilise une couleur différente selon le type de notification
	 *
	 * @param {string} message - Le message à afficher
	 * @param {string} type - Le type de notification (success, error, warning, info)
	 * @param {number} duration - Durée d'affichage en millisecondes
	 */
	showNotification(message, type = "success", duration = 3000) {
		// Supprimer toute notification existante
		const existingNotification = document.querySelector(".user-notification");
		if (existingNotification) {
			existingNotification.remove();
		}

		// Déterminer la couleur selon le type
		let backgroundColor;
		switch (type) {
			case "success":
				backgroundColor = "rgba(76, 175, 80, 0.9)"; // Vert
				break;
			case "error":
				backgroundColor = "rgba(244, 67, 54, 0.9)"; // Rouge
				break;
			case "warning":
				backgroundColor = "rgba(255, 152, 0, 0.9)"; // Orange
				break;
			case "info":
				backgroundColor = "rgba(33, 150, 243, 0.9)"; // Bleu
				break;
			default:
				backgroundColor = "rgba(76, 175, 80, 0.9)"; // Vert par défaut
		}

		// Créer la notification
		const notification = document.createElement("div");
		notification.className = "user-notification";
		notification.textContent = message;
		notification.style.backgroundColor = backgroundColor;

		// Ajouter au DOM
		document.body.appendChild(notification);

		// Animer l'entrée
		setTimeout(() => {
			notification.classList.add("active");
		}, 10);

		// Fermer après la durée spécifiée
		setTimeout(() => {
			notification.classList.remove("active");
			setTimeout(() => {
				notification.remove();
			}, 300); // Attendre la fin de l'animation de sortie
		}, duration);
	},

	/**
	 * Initialise les éléments d'interface utilisateur dynamiques
	 *
	 * Cette méthode:
	 * - Vérifie si une section est spécifiée dans l'URL
	 * - Configure la gestion du bouton "retour" du navigateur
	 * - Assure que la bonne section est affichée au chargement
	 */
	init() {
		// Vérifier si une section est spécifiée dans l'URL (gestion des liens directs)
		const hash = window.location.hash;
		if (hash) {
			const section = hash.substring(1);
			if (section === "accueil" || section === "login") {
				this.toggleSection(section);
			} else {
				this.toggleSection("accueil"); // Section par défaut
			}
		} else {
			this.toggleSection("accueil"); // Section par défaut
		}

		// Ajouter des écouteurs pour le bouton "retour"
		window.addEventListener("popstate", () => {
			const hash = window.location.hash;
			const section = hash ? hash.substring(1) : "accueil";

			if (section === "accueil" || section === "login") {
				this.toggleSection(section);
			} else {
				this.toggleSection("accueil");
			}
		});
	},
};

// Dans un environnement de modules ES, on exporterait ainsi:
// export default UI;

// Pour notre structure actuelle sans bundler:
window.UI = UI;
