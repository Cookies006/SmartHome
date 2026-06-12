import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { useTheme } from './ThemeContext';
import * as api from './api'; // 🔌 Import de l'API

export default function HistoryScreen({ activeFamily }) {
  const { theme } = useTheme();
  const COLORS = theme.colors;

  // 📦 États pour gérer les données réelles du serveur
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 🔄 Fonction pour charger l'historique de la famille depuis le serveur Python
  const loadHistory = useCallback(async () => {
    if (!activeFamily?.id) {
      setHistoryItems([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    const result = await api.getFamilyHistory(activeFamily.id);
    if (result.success) {
      setHistoryItems(result.data.data || result.data || []);
    }
    setLoading(false);
    setRefreshing(false);
  }, [activeFamily]);

  // Charger les données au premier affichage ou quand on change de famille
  useEffect(() => {
    setLoading(true);
    loadHistory();
  }, [loadHistory]);

  // Action de tirer pour rafraîchir la page
  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

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
    countText: {
      marginTop: 8,
      color: COLORS.textMuted,
      fontSize: 14,
      fontWeight: '700',
    },
    centerState: {
      flex: 1,
      paddingHorizontal: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      color: COLORS.textMuted,
      fontSize: 16,
      lineHeight: 24,
      textAlign: 'center',
    },
    historyList: {
      paddingHorizontal: 24,
    },
    historyContentList: {
      paddingBottom: 140,
    },
    historyCard: {
      backgroundColor: COLORS.surface,
      borderRadius: 20,
      padding: 16,
      marginBottom: 12,
      shadowColor: COLORS.cardShadow,
      shadowOpacity: 0.16,
      shadowOffset: { width: 0, height: 4 },
      shadowRadius: 10,
      elevation: 3,
    },
    historyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    itemIcon: {
      fontSize: 28,
    },
    itemText: {
      flex: 1,
    },
    itemName: {
      fontSize: 16,
      fontWeight: '800',
      color: COLORS.textDark,
      marginBottom: 4,
    },
    itemMeta: {
      fontSize: 13,
      color: COLORS.textMuted,
      lineHeight: 20,
    },
    itemDate: {
      marginTop: 10,
      fontSize: 12,
      color: COLORS.textMuted,
      fontWeight: '700',
    },
  });

  return (
    <View style={styles.outerContainer}>
      <View style={styles.appContainer}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Historique des achats</Text>
          {!loading && (
            <Text style={styles.countText}>
              {historyItems.length} article{historyItems.length > 1 ? 's' : ''} acheté{historyItems.length > 1 ? 's' : ''}
            </Text>
          )}
        </View>

        {loading ? (
          // ⏳ Écran de chargement pendant l'appel API
          <View style={styles.centerState}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : historyItems.length === 0 ? (
          <ScrollView 
            contentContainerStyle={styles.centerState}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
          >
            <Text style={styles.emptyText}>
              Pas encore d'articles achetés dans cette famille. Coche un produit dans l'onglet Courses pour le voir ici !
            </Text>
          </ScrollView>
        ) : (
          <ScrollView 
            style={styles.historyList} 
            contentContainerStyle={styles.historyContentList}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
          >
            {historyItems.map((item) => {
              // Gestion de la date selon le format renvoyé par ton modèle Python (boughtAt, bought_at ou updated_at)
              const rawDate = item.boughtAt || item.bought_at || item.updated_at || new Date().toISOString();
              
              return (
                <View key={item.id} style={styles.historyCard}>
                  <View style={styles.historyRow}>
                    <Text style={styles.itemIcon}>{item.icon || '🛒'}</Text>
                    <View style={styles.itemText}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemMeta}>
                        {item.category}
                        {item.bought_by_name && ` • Par ${item.bought_by_name}`}
                      </Text>
                      <Text style={styles.itemDate}>
                        {new Date(rawDate).toLocaleString('fr-FR', {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </View>
  );
}