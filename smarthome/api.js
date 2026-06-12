/**
 * Service API centralisé pour la communication avec le backend SmartHome
 */

const API_BASE_URL = 'https://smarthome-i3kj.onrender.com/api';

let authToken = null;

export const setAuthToken = (token) => { authToken = token; };
export const getAuthToken = () => authToken;
export const clearAuthToken = () => { authToken = null; };

const apiCall = async (endpoint, method = 'GET', body = null) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = { 'Content-Type': 'application/json' };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  try {
    const options = { method, headers };
    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw { status: response.status, message: data.error || 'Erreur serveur', data };
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

export const register = async (username, email, password, confirmPassword, displayName = null) => {
  return apiCall('/auth/register', 'POST', {
    username,
    email,
    password,
    confirmPassword,
    display_name: displayName || username,
  });
};

export const verifyCode = async (email, code) => {
  const result = await apiCall('/auth/verify-code', 'POST', { email, code });
  if (result.success && result.data.token) setAuthToken(result.data.token);
  return result;
};

export const login = async (username, password) => {
  const result = await apiCall('/auth/login', 'POST', { username, password });
  if (result.success && result.data.token) setAuthToken(result.data.token);
  return result;
};

export const getProfile = async () => apiCall('/auth/profile', 'GET');

export const updateProfile = async (displayName, activeFamilyId) => {
  return apiCall('/auth/profile', 'PUT', {
    display_name: displayName,
    active_family_id: activeFamilyId,
  });
};
// ==================== NOTIFICATIONS ====================

export const savePushToken = async (pushToken) => {
  return apiCall('/auth/push-token', 'PUT', {
    push_token: pushToken,
  });
};

// ==================== FAMILLES ====================

export const getFamilies = async () => apiCall('/families', 'GET');

export const createFamily = async (name, role = 'Parent') => {
  return apiCall('/families', 'POST', { name, role });
};

export const generateFamilyCode = async (familyId) => {
  return apiCall(`/families/${familyId}/generate-code`, 'POST');
};

export const getFamily = async (familyId) => apiCall(`/families/${familyId}`, 'GET');

export const updateFamily = async (familyId, name, description) => {
  return apiCall(`/families/${familyId}`, 'PUT', { name, description });
};

export const deleteFamily = async (familyId) => apiCall(`/families/${familyId}`, 'DELETE');

export const addFamilyMember = async (familyId, memberName, role = 'Autres') => {
  return apiCall(`/families/${familyId}/members`, 'POST', {
    member_name: memberName,
    role,
  });
};

export const removeFamilyMember = async (familyId, memberId) => {
  return apiCall(`/families/members/${memberId}`, 'DELETE');
};

export const joinFamily = async (inviteCode, role = 'Autres') => {
  return apiCall('/families/join', 'POST', { invite_code: inviteCode, role });
};

// ==================== LISTES DE COURSES ====================

export const getShoppingLists = async (familyId) => {
  return apiCall(`/shopping/family/${familyId}`, 'GET');
};

export const getShoppingList = async (listId) => {
  return apiCall(`/shopping/list/${listId}`, 'GET');
};

export const createShoppingList = async (name, familyId) => {
  return apiCall('/shopping', 'POST', { name, family_id: familyId });
};

export const updateShoppingList = async (listId, name) => {
  return apiCall(`/shopping/list/${listId}`, 'PUT', { name });
};

export const deleteShoppingList = async (listId) => {
  return apiCall(`/shopping/list/${listId}`, 'DELETE');
};

export const addShoppingItem = async (listId, icon, name, category, urgent = false, quantity = null) => {
  return apiCall('/shopping/items', 'POST', {
    shopping_list_id: listId,
    icon,
    name,
    category,
    urgent,
    quantity,
  });
};

export const updateShoppingItem = async (itemId, updates) => {
  return apiCall(`/shopping/items/${itemId}`, 'PUT', updates);
};

export const removeShoppingItem = async (itemId) => {
  return apiCall(`/shopping/items/${itemId}`, 'DELETE');
};

// ==================== HISTORIQUE ====================
export const getFamilyHistory = async (familyId) => {
  return apiCall(`/shopping/family/${familyId}/history`, 'GET');
};

// ==================== SANTÉ ====================

export const healthCheck = async () => apiCall('/health', 'GET');

export default {
  register,
  verifyCode,
  login,
  getProfile,
  updateProfile,
  setAuthToken,
  getAuthToken,
  clearAuthToken,
  getFamilies,
  createFamily,
  getFamily,
  updateFamily,
  deleteFamily,
  addFamilyMember,
  removeFamilyMember,
  joinFamily,
  getShoppingLists,
  createShoppingList,
  getShoppingList,
  updateShoppingList,
  deleteShoppingList,
  addShoppingItem,
  updateShoppingItem,
  removeShoppingItem,
  healthCheck,
  savePushToken,
};