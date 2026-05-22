/**
 * Service API centralisé pour la communication avec le backend SmartHome
 * Dynamically configure API URL based on environment
 */

// Detect if running on Render (production) or locally
const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';

// For production on Render: update with your backend URL
const API_BASE_URL = isProduction 
  ? 'https://smarthome-i3kj.onrender.com/api'  // Your Render backend
  : 'http://localhost:5000/api';

let authToken = null;

/**
 * Définir le token JWT après la connexion
 */
export const setAuthToken = (token) => {
  authToken = token;
};

/**
 * Obtenir le token JWT actuel
 */
export const getAuthToken = () => {
  return authToken;
};

/**
 * Réinitialiser le token (lors de la déconnexion)
 */
export const clearAuthToken = () => {
  authToken = null;
};

/**
 * Fonction générique pour faire des appels API
 */
const apiCall = async (endpoint, method = 'GET', body = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
  };

  // Ajouter le token JWT s'il existe
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const options = {
      method,
      headers,
    };

    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw {
        status: response.status,
        message: data.error || 'Erreur serveur',
        data,
      };
    }

    return { success: true, data, status: response.status };
  } catch (error) {
    console.error(`Erreur API (${method} ${endpoint}):`, error);
    return {
      success: false,
      error: error.message || 'Erreur de connexion',
      status: error.status || 500,
      data: error.data,
    };
  }
};

// ==================== AUTHENTIFICATION ====================

/**
 * Enregistrer un nouvel utilisateur
 */
export const register = async (username, email, password, displayName = null) => {
  return apiCall('/auth/register', 'POST', {
    username,
    email,
    password,
    display_name: displayName || username,
  });
};

/**
 * Vérifier le code de confirmation
 */
export const verifyCode = async (email, code) => {
  const result = await apiCall('/auth/verify-code', 'POST', {
    email,
    code,
  });

  if (result.success && result.data.token) {
    setAuthToken(result.data.token);
  }

  return result;
};

/**
 * Se connecter avec username et password
 */
export const login = async (username, password) => {
  const result = await apiCall('/auth/login', 'POST', {
    username,
    password,
  });

  if (result.success && result.data.token) {
    setAuthToken(result.data.token);
  }

  return result;
};

/**
 * Obtenir le profil utilisateur actuel
 */
export const getProfile = async () => {
  return apiCall('/auth/profile', 'GET');
};

/**
 * Mettre à jour le profil utilisateur
 */
export const updateProfile = async (displayName, activeFamilyId) => {
  return apiCall('/auth/profile', 'PUT', {
    display_name: displayName,
    active_family_id: activeFamilyId,
  });
};

// ==================== FAMILLES ====================

/**
 * Récupérer toutes les familles de l'utilisateur
 */
export const getFamilies = async () => {
  return apiCall('/families', 'GET');
};

/**
 * Créer une nouvelle famille
 */
export const createFamily = async (name, description = '') => {
  return apiCall('/families', 'POST', {
    name,
    description,
  });
};

/**
 * Obtenir les détails d'une famille
 */
export const getFamily = async (familyId) => {
  return apiCall(`/families/${familyId}`, 'GET');
};

/**
 * Modifier une famille
 */
export const updateFamily = async (familyId, name, description) => {
  return apiCall(`/families/${familyId}`, 'PUT', {
    name,
    description,
  });
};

/**
 * Supprimer une famille
 */
export const deleteFamily = async (familyId) => {
  return apiCall(`/families/${familyId}`, 'DELETE');
};

/**
 * Ajouter un membre à une famille
 */
export const addFamilyMember = async (familyId, memberName, role = 'Membre') => {
  return apiCall(`/families/${familyId}/members`, 'POST', {
    member_name: memberName,
    role,
  });
};

/**
 * Retirer un membre d'une famille
 */
export const removeFamilyMember = async (familyId, memberId) => {
  return apiCall(`/families/${familyId}/members/${memberId}`, 'DELETE');
};

// ==================== LISTES DE COURSES ====================

/**
 * Récupérer toutes les listes de courses
 */
export const getShoppingLists = async () => {
  return apiCall('/shopping', 'GET');
};

/**
 * Créer une nouvelle liste de courses
 */
export const createShoppingList = async (name, familyId) => {
  return apiCall('/shopping', 'POST', {
    name,
    family_id: familyId,
  });
};

/**
 * Obtenir les détails d'une liste
 */
export const getShoppingList = async (listId) => {
  return apiCall(`/shopping/${listId}`, 'GET');
};

/**
 * Modifier une liste
 */
export const updateShoppingList = async (listId, name) => {
  return apiCall(`/shopping/${listId}`, 'PUT', {
    name,
  });
};

/**
 * Supprimer une liste
 */
export const deleteShoppingList = async (listId) => {
  return apiCall(`/shopping/${listId}`, 'DELETE');
};

/**
 * Ajouter un article à une liste
 */
export const addShoppingItem = async (listId, itemName, quantity = 1, category = 'Autre') => {
  return apiCall(`/shopping/${listId}/items`, 'POST', {
    item_name: itemName,
    quantity,
    category,
  });
};

/**
 * Modifier un article
 */
export const updateShoppingItem = async (listId, itemId, itemName, quantity, completed = false) => {
  return apiCall(`/shopping/${listId}/items/${itemId}`, 'PUT', {
    item_name: itemName,
    quantity,
    completed,
  });
};

/**
 * Supprimer un article
 */
export const removeShoppingItem = async (listId, itemId) => {
  return apiCall(`/shopping/${listId}/items/${itemId}`, 'DELETE');
};

// ==================== SANTÉ DE L'API ====================

/**
 * Vérifier la connexion avec le backend
 */
export const healthCheck = async () => {
  return apiCall('/health', 'GET');
};

export default {
  // Auth
  register,
  verifyCode,
  login,
  getProfile,
  updateProfile,
  setAuthToken,
  getAuthToken,
  clearAuthToken,

  // Familles
  getFamilies,
  createFamily,
  getFamily,
  updateFamily,
  deleteFamily,
  addFamilyMember,
  removeFamilyMember,

  // Listes de courses
  getShoppingLists,
  createShoppingList,
  getShoppingList,
  updateShoppingList,
  deleteShoppingList,
  addShoppingItem,
  updateShoppingItem,
  removeShoppingItem,

  // Utilitaires
  healthCheck,
};
