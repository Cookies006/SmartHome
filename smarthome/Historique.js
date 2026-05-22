import React from 'react';
import { View, Text, ScrollView, StyleSheet, Platform } from 'react-native';
import { useTheme } from './ThemeContext';

export default function HistoryScreen({ historyItems = [] }) {
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
    countText: {
      marginTop: 8,
      color: COLORS.textMuted,
      fontSize: 14,
      fontWeight: '700',
    },
    emptyState: {
      flex: 1,
      paddingHorizontal: 24,
      justifyContent: 'center',
    },
    emptyText: {
      color: COLORS.textMuted,
      fontSize: 16,
      lineHeight: 24,
      textAlign: 'center',
    },
    historyList: {
      paddingHorizontal: 24,
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
          <Text style={styles.countText}>{historyItems.length} article{historyItems.length > 1 ? 's' : ''} acheté{historyItems.length > 1 ? 's' : ''}</Text>
        </View>

        {historyItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              Pas encore d'articles achetés. Coche un produit dans Courses pour le voir apparaître ici.
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
            {historyItems.map((item) => (
              <View key={item.id} style={styles.historyCard}>
                <View style={styles.historyRow}>
                  <Text style={styles.itemIcon}>{item.icon}</Text>
                  <View style={styles.itemText}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemMeta}>{item.category}</Text>
                    <Text style={styles.itemDate}>{new Date(item.boughtAt).toLocaleString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
