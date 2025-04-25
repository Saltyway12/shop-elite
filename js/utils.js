/**
 * utils.js - Module de fonctions utilitaires partagées
 *
 * Ce module fournit diverses fonctions utilitaires qui peuvent être utilisées
 * par plusieurs modules de l'application. Il centralise des fonctionnalités
 * communes pour éviter la duplication de code.
 */

const Utils = {
	/**
	 * Formatte un prix avec 2 décimales et le symbole €
	 *
	 * Assure une présentation cohérente des prix dans toute l'application
	 *
	 * @param {number} price - Le prix à formater
	 * @returns {string} Le prix formaté (ex: "15.99 €")
	 */
	formatPrice(price) {
		return `${price.toFixed(2)} €`;
	},

	/**
	 * Met en majuscule la première lettre d'une chaîne
	 *
	 * Utile pour améliorer l'affichage des titres, catégories, etc.
	 *
	 * @param {string} string - La chaîne à transformer
	 * @returns {string} La chaîne avec la première lettre en majuscule
	 */
	capitalizeFirstLetter(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},

	/**
	 * Tronque un texte à une longueur maximale et ajoute des points de suspension
	 *
	 * Idéal pour les descriptions produit ou autres textes longs
	 * qui doivent être affichés dans un espace limité
	 *
	 * @param {string} text - Texte à tronquer
	 * @param {number} maxLength - Longueur maximale
	 * @returns {string} Texte tronqué avec des points de suspension si nécessaire
	 */
	truncateText(text, maxLength) {
		if (text.length <= maxLength) return text;
		return text.substring(0, maxLength) + "...";
	},

	/**
	 * Récupère un paramètre depuis l'URL
	 *
	 * Permet de récupérer facilement les paramètres de requête dans l'URL
	 *
	 * @param {string} paramName - Nom du paramètre à récupérer
	 * @returns {string|null} Valeur du paramètre ou null si non trouvé
	 */
	getUrlParam(paramName) {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get(paramName);
	},

	/**
	 * Valide une adresse email
	 *
	 * Vérifie si une chaîne est une adresse email valide
	 * en utilisant une expression régulière simple
	 *
	 * @param {string} email - Email à valider
	 * @returns {boolean} True si l'email est valide, false sinon
	 */
	validateEmail(email) {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	},

	/**
	 * Génère un identifiant unique
	 *
	 * Utilise une combinaison de timestamp et nombre aléatoire
	 * pour générer un identifiant pratiquement unique
	 *
	 * @returns {string} Identifiant unique
	 */
	generateUniqueId() {
		return Date.now().toString(36) + Math.random().toString(36).substring(2);
	},

	/**
	 * Délai d'attente (Promise)
	 *
	 * Crée une promesse qui se résout après un délai spécifié
	 * Utile pour les temporisations ou animations
	 *
	 * @param {number} ms - Millisecondes à attendre
	 * @returns {Promise} Promise qui se résout après le délai
	 */
	delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	},

	/**
	 * Détecte si l'appareil est mobile
	 *
	 * Vérifie le user-agent pour déterminer si l'utilisateur
	 * est sur un appareil mobile
	 *
	 * @returns {boolean} True si l'appareil est mobile, false sinon
	 */
	isMobileDevice() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);
	},

	/**
	 * Sauvegarde une valeur dans le localStorage avec gestion d'erreur
	 *
	 * Cette méthode:
	 * - Convertit la valeur en JSON
	 * - Gère les erreurs potentielles (stockage plein, etc.)
	 * - Retourne un booléen indiquant le succès ou l'échec
	 *
	 * @param {string} key - Clé de stockage
	 * @param {any} value - Valeur à stocker (sera JSON.stringify)
	 * @returns {boolean} True si sauvegardé avec succès, false sinon
	 */
	saveToLocalStorage(key, value) {
		try {
			localStorage.setItem(key, JSON.stringify(value));
			return true;
		} catch (error) {
			console.error("Erreur lors de la sauvegarde dans localStorage:", error);
			return false;
		}
	},

	/**
	 * Récupère une valeur depuis le localStorage avec gestion d'erreur
	 *
	 * Cette méthode:
	 * - Récupère et parse la valeur stockée
	 * - Gère les erreurs potentielles (données corrompues, etc.)
	 * - Retourne une valeur par défaut en cas d'erreur
	 *
	 * @param {string} key - Clé de stockage
	 * @param {any} defaultValue - Valeur par défaut si non trouvée
	 * @returns {any} Valeur stockée ou valeur par défaut
	 */
	getFromLocalStorage(key, defaultValue = null) {
		try {
			const item = localStorage.getItem(key);
			return item ? JSON.parse(item) : defaultValue;
		} catch (error) {
			console.error(
				"Erreur lors de la récupération depuis localStorage:",
				error
			);
			return defaultValue;
		}
	},
};

// Dans un environnement de modules ES, on exporterait ainsi:
// export default Utils;

// Pour notre structure actuelle sans bundler:
window.Utils = Utils;
