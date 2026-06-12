import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useTheme } from './ThemeContext';
import * as api from './api';

const categories = [
  'Fruits & Légumes',
  'Rayon Frais',
  'Viandes & Poissons',
  'Épicerie',
  'Boissons',
  'Entretien & Hygiène',
  'Bébé',
  'Autre',
];

const icons = [
  '🛒', '🍎', '🍌', '🥕', '🥬', '🍞', '🥛', '🧀', '🍗', '🐟',
  '🥤', '🧴', '🧻', '🍼', '🧽', '🧹', '🧺', '📦', '🍫', '☕',
];

export default function CoursesScreen({ onMarkBought, activeFamily }) {
  const { theme } = useTheme();
  const COLORS = theme.colors;

  const styles = StyleSheet.create({
    outerContainer: {
      flex: 1,
      backgroundColor: COLORS.bgGray,
      paddingTop: Platform.OS === 'android' ? 24 : 0,
    },
    appContainer: {
      flex: 1,
      maxWidth: 430,
      alignSelf: 'center',
      width: '100%',
      backgroundColor: COLORS.bgApp,
      paddingTop: Platform.OS === 'android' ? 0 : 14,
    },
    header: {
      paddingTop: 54,
      paddingHorizontal: 24,
      paddingBottom: 20,
    },
    pageTitle: {
      fontSize: 28,
      fontWeight: '900',
      color: COLORS.textDark,
      letterSpacing: -0.5,
    },
    count: { color: COLORS.primary },
    contentScroll: { flex: 1, paddingHorizontal: 24 },
    productCard: {
      backgroundColor: COLORS.surface,
      borderRadius: 20,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      shadowColor: COLORS.cardShadow,
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 10,
      elevation: 3,
    },
    productCardChecked: { opacity: 0.7 },
    checkbox: {
      width: 26,
      height: 26,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: '#CBD5E1',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.bgApp,
    },
    checkboxChecked: { backgroundColor: '#34D399', borderColor: '#34D399' },
    checkboxTick: { color: 'white', fontWeight: '900' },
    productInfo: { flex: 1 },
    productName: {
      fontSize: 16,
      fontWeight: '800',
      marginBottom: 2,
      color: COLORS.textDark,
    },
    productNameChecked: {
      textDecorationLine: 'line-through',
      color: COLORS.textMuted,
    },
    // 🌟 NOUVEAU : Style pour la quantité
    quantityBadge: {
      color: COLORS.primary,
      fontSize: 15,
      fontWeight: '900',
    },
    productMeta: { fontSize: 13, fontWeight: '700', color: COLORS.textMuted },
    urgentTag: { color: COLORS.danger, fontWeight: '800' },
    cardActions: { flexDirection: 'row', gap: 8 },
    actionBtn: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: COLORS.bgApp,
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteBtn: { opacity: 0.7 },
    actionBtnText: { fontSize: 16 },
    fabAdd: {
      position: 'absolute',
      right: 24,
      bottom: 100,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: COLORS.primary,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 8,
    },
    fabIcon: { color: 'white', fontSize: 30, lineHeight: 34 },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(18, 26, 47, 0.4)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    modalContent: {
      width: '100%',
      maxWidth: 360,
      borderRadius: 28,
      padding: 24,
      backgroundColor: COLORS.surface,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '900',
      marginBottom: 20,
      color: COLORS.textDark,
    },
    inputRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    inputField: {
      width: '100%',
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: COLORS.surfaceTint,
      backgroundColor: COLORS.bgApp,
      fontSize: 16,
      fontWeight: '700',
      color: COLORS.textDark,
    },
    iconPicker: {
      width: 80,
      height: 56,
      borderRadius: 14,
      borderWidth: 2,
      borderColor: COLORS.surfaceTint,
      backgroundColor: COLORS.bgApp,
      justifyContent: 'center',
      alignItems: 'center',
    },
    iconPickerText: { fontSize: 24 },
    categorySelect: {
      width: '100%',
      borderRadius: 14,
      borderWidth: 2,
      borderColor: COLORS.surfaceTint,
      backgroundColor: COLORS.bgApp,
      paddingVertical: 14,
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    categoryText: { color: COLORS.textDark, fontWeight: '700' },
    categoryPlaceholder: { color: COLORS.textMuted, fontWeight: '700' },
    urgentToggle: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
    urgentLabel: { fontWeight: '700', color: COLORS.textDark },
    modalActions: { flexDirection: 'row', gap: 12 },
    btnModal: {
      flex: 1,
      paddingVertical: 16,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnCancel: { backgroundColor: COLORS.bgApp },
    btnCancelText: { color: COLORS.textMuted, fontWeight: '800' },
    btnAdd: { backgroundColor: COLORS.primary },
    btnAddText: { color: 'white', fontWeight: '800' },
    btnDanger: { backgroundColor: COLORS.danger },
    btnDangerText: { color: 'white', fontWeight: '800' },
    toastContainer: {
      position: 'absolute',
      top: 30,
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 1000,
    },
    filterContainer: {
      flexGrow: 0,
      marginBottom: 16,
    },
    filterContentContainer: {
      paddingHorizontal: 24,
      gap: 8,
    },
    filterBadge: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 100,
      backgroundColor: COLORS.surface,
      borderWidth: 1,
      borderColor: COLORS.surfaceTint,
    },
    filterBadgeActive: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
    },
    filterBadgeText: {
      fontSize: 14,
      fontWeight: '700',
      color: COLORS.textMuted,
    },
    filterBadgeTextActive: {
      color: 'white',
    },
    toastContent: {
      backgroundColor: COLORS.textDark,
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 100,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    toastText: { color: 'white', fontSize: 15, fontWeight: '700' },
    confirmText: {
      marginBottom: 24,
      fontWeight: '700',
      color: COLORS.textMuted,
      fontSize: 15,
    },
    categoryOption: {
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.surfaceTint,
    },
    categoryOptionText: { fontSize: 16, color: COLORS.textDark },
    pickerSection: {
      marginTop: 12,
      borderRadius: 18,
      backgroundColor: COLORS.bgApp,
      padding: 12,
      borderWidth: 1,
      borderColor: COLORS.surfaceTint,
    },
    pickerTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: COLORS.textDark,
      marginBottom: 10,
    },
    categoryList: { maxHeight: 180 },
    iconGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      paddingVertical: 10,
    },
    iconOption: {
      width: 50,
      height: 50,
      borderRadius: 12,
      backgroundColor: COLORS.bgApp,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 5,
    },
    iconOptionText: { fontSize: 24 },
    emptyState: { padding: 40, alignItems: 'center' },
    emptyStateText: { color: COLORS.textMuted, fontWeight: '700', fontSize: 14, textAlign: 'center' },
  });

  const [products, setProducts] = useState([]);
  const [listId, setListId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingId, setPendingId] = useState(null);
  
  const [newIcon, setNewIcon] = useState('🛒');
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newUrgent, setNewUrgent] = useState(false);
  // 🌟 NOUVEAU : La variable pour la quantité !
  const [newQuantity, setNewQuantity] = useState(''); 

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastIcon, setToastIcon] = useState('✅');
  const [categoryPickerOpen, setCategoryPickerOpen] = useState(false);
  const [iconPickerOpen, setIconPickerOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [currentUserName, setCurrentUserName] = useState('');

  useEffect(() => {
    if (showToast) {
      const timeout = setTimeout(() => setShowToast(false), 2500);
      return () => clearTimeout(timeout);
    }
  }, [showToast]);

  const notify = (message, icon = '✅') => {
    setToastMessage(message);
    setToastIcon(icon);
    setShowToast(true);
  };

  const loadData = useCallback(async () => {
    try {
      const profileResult = await api.getProfile();
      if (profileResult.success) {
        setCurrentUserName(profileResult.data.display_name || profileResult.data.username);
      }

      let familyId = activeFamily?.id;

      if (!familyId) {
        const profileResult = await api.getProfile();
        if (!profileResult.success) return;
        const userFamilies = profileResult.data.families || [];
        if (!userFamilies || userFamilies.length === 0) {
          setLoading(false);
          setRefreshing(false);
          return;
        }
        familyId = userFamilies[0].family_id || userFamilies[0].id;
      }
      
      const listsResult = await api.getShoppingLists(familyId);

      if (listsResult.success) {
        const lists = listsResult.data.lists || listsResult.data || [];
        let currentListId = listId;

        if (!currentListId) {
          if (lists.length === 0) {
            const newList = await api.createShoppingList('Ma liste', familyId);
            if (newList.success) {
              currentListId = newList.data?.list?.id || newList.data?.id;
              setListId(currentListId);
            }
          } else {
            currentListId = lists[0].id;
            setListId(currentListId);
          }
        }

        if (currentListId) {
          const listResult = await api.getShoppingList(currentListId);
          if (listResult.success) {
            setProducts(listResult.data?.items || listResult.data || []);
          }
        }
      }
    } catch (e) {
      console.error('Erreur chargement courses:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [listId, activeFamily]);

  useEffect(() => {
    setListId(null);
    setProducts([]);
    loadData();
  }, [activeFamily]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const toggleBuy = async (id) => {
    const item = products.find((p) => p.id === id);
    if (!item) return;

    const becomingChecked = !item.checked;

    setProducts((current) =>
      current.map((p) =>
        p.id === id 
          ? { ...p, checked: becomingChecked, bought_by_name: becomingChecked ? currentUserName : null } 
          : p
      )
    );

    await api.updateShoppingItem(id, { checked: becomingChecked });

    if (becomingChecked) {
      onMarkBought?.({
        id: 'h' + Date.now(),
        icon: item.icon || '🛒',
        name: item.name,
        category: item.category,
        boughtAt: new Date().toISOString(),
      });
      notify('Produit acheté', '✅');
      setTimeout(() => {
        setProducts((current) => current.filter((p) => p.id !== id));
      }, 800);
    } else {
      notify('Marqué comme non acheté', '🔄');
    }
  };

  const requestAction = (action, id) => {
    const item = products.find((p) => p.id === id);
    if (!item) return;

    if (action === 'urgent' && item.urgent) {
      executeUrgent(id, false);
      return;
    }

    setPendingAction(action);
    setPendingId(id);
    setShowConfirmModal(true);
  };

  const hideConfirm = () => {
    setShowConfirmModal(false);
    setPendingAction(null);
    setPendingId(null);
  };

  const executeAction = () => {
    if (pendingAction === 'delete') executeRemove(pendingId);
    else if (pendingAction === 'urgent') executeUrgent(pendingId, true);
    hideConfirm();
  };

  const executeUrgent = async (id, makingUrgent) => {
    setProducts((current) =>
      current.map((p) => p.id === id ? { ...p, urgent: makingUrgent } : p)
    );
    await api.updateShoppingItem(id, { urgent: makingUrgent });
    notify(makingUrgent ? 'Marqué urgent' : 'Urgence retirée', '🚨');
  };

  const executeRemove = async (id) => {
    setProducts((current) => current.filter((p) => p.id !== id));
    await api.removeShoppingItem(id);
    notify('Article supprimé', '🗑️');
  };

  const showModal = () => {
    setNewIcon('🛒');
    setNewName('');
    setNewQuantity(''); // 🌟 NOUVEAU : On remet la quantité à zéro à l'ouverture
    setNewCategory('');
    setNewUrgent(false);
    setShowAddModal(true);
  };

  const hideModal = () => {
    setShowAddModal(false);
    setCategoryPickerOpen(false);
    setIconPickerOpen(false);
  };

  const addItem = async () => {
  if (!newName.trim()) { notify('Veuillez saisir un nom', '⚠️'); return; }
  if (!newCategory) { notify('Veuillez choisir une catégorie', '⚠️'); return; }
  if (!listId) { notify('Aucune liste disponible', '⚠️'); return; }

  // ✅ CORRECTION : vérification du doublon AVANT l'appel API
  const nomAComparer = newName.trim().toLowerCase();
  const produitExistant = products.find(p => p.name.toLowerCase() === nomAComparer);
  if (produitExistant) {
    notify('Ce produit est déjà dans la liste !', '⚠️');
    return; // On arrête avant même d'appeler le serveur
  }

  const result = await api.addShoppingItem(listId, newIcon, newName, newCategory, newUrgent, newQuantity);
  if (result.success) {
    setProducts((current) => [result.data.item, ...current]);
    hideModal();
    notify('Ajouté à la liste', '🛒');
  } else {
    notify('Erreur lors de l\'ajout', '❌');
  }
};

  const filteredProducts = selectedFilter
  ? products.filter((p) => p.category === selectedFilter)
  : products;

  const currentCount = products.length;

  if (loading) {
    return (
      <View style={[styles.outerContainer, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.appContainer}>
        {showToast && (
          <View style={styles.toastContainer}>
            <View style={styles.toastContent}>
              <Text style={styles.toastText}>{toastIcon}</Text>
              <Text style={styles.toastText}>{toastMessage}</Text>
            </View>
          </View>
        )}

        <View style={styles.header}>
          <Text style={styles.pageTitle}>
            📦 Courses (<Text style={styles.count}>{currentCount}</Text>)
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContentContainer}
        >
          <TouchableOpacity
            style={[styles.filterBadge, !selectedFilter && styles.filterBadgeActive]}
            onPress={() => setSelectedFilter(null)}
          >
            <Text style={[styles.filterBadgeText, !selectedFilter && styles.filterBadgeTextActive]}>✨ Tout</Text>
          </TouchableOpacity>

          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.filterBadge, selectedFilter === category && styles.filterBadgeActive]}
              onPress={() => setSelectedFilter(selectedFilter === category ? null : category)}
            >
              <Text style={[styles.filterBadgeText, selectedFilter === category && styles.filterBadgeTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView
          style={styles.contentScroll}
          contentContainerStyle={{ paddingBottom: 140 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                {selectedFilter 
                  ? `Aucun article dans la catégorie "${selectedFilter}".`
                  : "Aucun article pour l'instant.\nAppuyez sur + pour en ajouter !"}
              </Text>
            </View>
          ) : (
            filteredProducts.map((product) => (
              <View
                key={product.id}
                style={[styles.productCard, product.checked && styles.productCardChecked]}
              >
                <TouchableOpacity
                  style={[styles.checkbox, product.checked && styles.checkboxChecked]}
                  onPress={() => toggleBuy(product.id)}
                >
                  {product.checked && <Text style={styles.checkboxTick}>✓</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={styles.productInfo} onPress={() => toggleBuy(product.id)}>
                  <Text style={[styles.productName, product.checked && styles.productNameChecked]}>
                    {product.icon} {product.name} 
                    {/* 🌟 NOUVEAU : Affichage de la quantité juste à côté du nom ! */}
                    {product.quantity ? (
                      <Text style={[styles.quantityBadge, product.checked && styles.productNameChecked]}>
                        {' '}({product.quantity})
                      </Text>
                    ) : null}
                  </Text>
                  
                  <Text style={styles.productMeta}>
                    <Text>{product.category}</Text>
                    {product.urgent && <Text style={styles.urgentTag}> • 🚨 Urgent</Text>}
                    
                    {(product.added_by_name || product.added_by || product.user_name) && (
                      <Text>
                        {' '}• Ajouté par {product.added_by_name || product.added_by || product.user_name}
                      </Text>
                    )}
                  </Text>
                </TouchableOpacity>

                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.actionBtn} onPress={() => requestAction('urgent', product.id)}>
                    <Text style={styles.actionBtnText}>🚨</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn]} onPress={() => requestAction('delete', product.id)}>
                    <Text style={styles.actionBtnText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>

        <TouchableOpacity style={styles.fabAdd} onPress={showModal}>
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>

        {/* ADD MODAL */}
        <Modal visible={showAddModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Ajouter un article</Text>

              <View style={styles.inputRow}>
                <TouchableOpacity
                  style={styles.iconPicker}
                  onPress={() => { setIconPickerOpen(p => !p); setCategoryPickerOpen(false); }}
                >
                  <Text style={styles.iconPickerText}>{newIcon}</Text>
                </TouchableOpacity>
                <TextInput
                  style={[styles.inputField, { flex: 1 }]}
                  placeholder="Nom du produit..."
                  value={newName}
                  onChangeText={setNewName}
                  placeholderTextColor={COLORS.textMuted}
                />
              </View>

              {/* 🌟 NOUVEAU : Champ pour écrire la quantité */}
              <TextInput
                style={[styles.inputField, { marginBottom: 16 }]}
                placeholder="Quantité (ex: 2, 500g, 1L)..."
                value={newQuantity}
                onChangeText={setNewQuantity}
                placeholderTextColor={COLORS.textMuted}
              />

              <TouchableOpacity
                style={styles.categorySelect}
                onPress={() => { setCategoryPickerOpen(p => !p); setIconPickerOpen(false); }}
              >
                <Text style={newCategory ? styles.categoryText : styles.categoryPlaceholder}>
                  {newCategory || 'Catégorie...'}
                </Text>
              </TouchableOpacity>

              {iconPickerOpen && (
                <View style={styles.pickerSection}>
                  <Text style={styles.pickerTitle}>Choisir une icône</Text>
                  <ScrollView contentContainerStyle={styles.iconGrid}>
                    {icons.map((icon) => (
                      <TouchableOpacity key={icon} style={styles.iconOption} onPress={() => { setNewIcon(icon); setIconPickerOpen(false); }}>
                        <Text style={styles.iconOptionText}>{icon}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {categoryPickerOpen && (
                <View style={styles.pickerSection}>
                  <Text style={styles.pickerTitle}>Choisir une catégorie</Text>
                  <ScrollView style={styles.categoryList}>
                    {categories.map((category) => (
                      <TouchableOpacity key={category} style={styles.categoryOption} onPress={() => { setNewCategory(category); setCategoryPickerOpen(false); }}>
                        <Text style={styles.categoryOptionText}>{category}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <TouchableOpacity style={styles.urgentToggle} onPress={() => setNewUrgent(p => !p)}>
                <View style={[styles.checkbox, newUrgent && styles.checkboxChecked]}>
                  {newUrgent && <Text style={styles.checkboxTick}>✓</Text>}
                </View>
                <Text style={styles.urgentLabel}>Marquer comme urgent</Text>
              </TouchableOpacity>

              <View style={styles.modalActions}>
                <TouchableOpacity style={[styles.btnModal, styles.btnCancel]} onPress={hideModal}>
                  <Text style={styles.btnCancelText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnModal, styles.btnAdd]} onPress={addItem}>
                  <Text style={styles.btnAddText}>Ajouter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* CONFIRM MODAL */}
        <Modal visible={showConfirmModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {pendingAction === 'delete' ? 'Supprimer l\'article ?' : 'Signaler comme Urgent ?'}
              </Text>
              <Text style={styles.confirmText}>
                {pendingAction === 'delete'
                  ? 'Cet article disparaîtra définitivement de votre liste.'
                  : 'Toute la famille verra que ce produit manque cruellement !'}
              </Text>
              <View style={styles.modalActions}>
                <TouchableOpacity style={[styles.btnModal, styles.btnCancel]} onPress={hideConfirm}>
                  <Text style={styles.btnCancelText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btnModal, pendingAction === 'delete' ? styles.btnDanger : styles.btnAdd]}
                  onPress={executeAction}
                >
                  <Text style={pendingAction === 'delete' ? styles.btnDangerText : styles.btnAddText}>
                    {pendingAction === 'delete' ? 'Supprimer' : "C'est Urgent"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}