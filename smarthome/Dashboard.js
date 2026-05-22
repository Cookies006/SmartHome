import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useTheme } from './ThemeContext';

// Couleurs light mode (par défaut)
const LIGHT_COLORS = {
  bgApp: '#EBF2FA',
  surface: '#FFFFFF',
  surfaceTint: '#E8EEF9',
  textDark: '#121A2F',
  textMuted: '#64748B',
  primary: '#2C5282',
  accentPurpleBg: '#EAE0F8',
  accentPurpleText: '#B794F6',
  danger: '#F08080',
  dangerBg: '#FCE8E8',
};



export default function DashboardScreen({ initialFamilyName = 'Famille Faye', isNewFamily = false, onLogout, onNavigate }) {
  const { theme, toggleTheme } = useTheme();
  const COLORS = theme.colors;
  const [familyName, setFamilyName] = useState(initialFamilyName);
  const [articleCount, setArticleCount] = useState(12);
  const [urgentCount, setUrgentCount] = useState(3);
  const [members, setMembers] = useState([
    { name: 'Papa' },
    { name: 'Maman' },
    { name: 'Fatou' },
  ]);
  const [activities, setActivities] = useState([
    {
      icon: '🍼',
      title: 'Lait 1er âge',
      subtitle: 'Ajouté par Maman • 10 min',
      urgent: true,
    },
    {
      icon: '🧻',
      title: 'Papier toilette',
      subtitle: 'Ajouté par Léo • 1h',
      urgent: false,
    },
  ]);

  useEffect(() => {
    if (isNewFamily) {
      setFamilyName(initialFamilyName);
      setArticleCount(0);
      setUrgentCount(0);
      setMembers([{ name: 'Vous' }]);
      setActivities([]);
    }
  }, [isNewFamily, initialFamilyName]);

  const handleNavigate = (screen) => {
    if (onNavigate) {
      onNavigate(screen);
    }
  };

  return (
    <View style={[styles.outerContainer, { backgroundColor: theme.colors.bgGray }]}>
      <View style={[styles.appContainer, { backgroundColor: theme.colors.bgApp }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.pageTitle, { color: theme.colors.textDark }]}>Tableau de bord</Text>
            <Text style={[styles.badgeFamily, { backgroundColor: theme.isDark ? '#3A3A3A' : '#EAE0F8', color: theme.isDark ? '#B794F6' : '#9A73D5', borderColor: theme.isDark ? '#554444' : '#D8C5F5' }]}>👨‍👩‍👧‍👦 {familyName}</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity style={styles.themeBtn} onPress={toggleTheme}>
              <Text style={styles.themeBtnIcon}>{theme.isDark ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileBtn} onPress={onLogout}>
              <Text style={styles.profileIcon}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={[styles.contentScroll, { backgroundColor: theme.colors.bgApp }]} showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={[styles.summaryCard, { backgroundColor: theme.colors.surfaceTint }]} onPress={() => handleNavigate('courses')}>
            <View>
              <Text style={[styles.summaryTitle, { color: theme.colors.textDark }]}>{articleCount} Article{articleCount > 1 ? 's' : ''}</Text>
              <Text style={[styles.summaryText, { color: theme.colors.textMuted }]}>À acheter cette semaine</Text>
            </View>
            <View style={[styles.badgeUrgentLarge, { backgroundColor: theme.colors.dangerBg }]}> 
              <Text style={styles.badgeUrgentIcon}>⏱️</Text>
              <Text style={[styles.badgeUrgentText, { color: theme.colors.danger }]}>{urgentCount} Urgents</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.textDark }]}>Membres du foyer</Text>
            <TouchableOpacity onPress={() => handleNavigate('familles')}>
              <Text style={[styles.manageLink, { color: theme.colors.primary }]}>Gérer ➔</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.membersRow}>
            {members.map((member) => (
              <View key={member.name} style={[styles.memberCard, { backgroundColor: theme.colors.surface }] }>
                <View style={[styles.memberAvatarSquare, { backgroundColor: theme.colors.accentPurpleBg }] }>
                  <Text style={[styles.memberAvatarIcon, { color: theme.colors.accentPurpleText }]}>{'👤'}</Text>
                </View>
                <Text style={[styles.memberName, { color: theme.colors.textDark }]}>{member.name}</Text>
              </View>
            ))}
          </ScrollView>

          <Text style={[styles.recentTitle, { color: theme.colors.textDark }]}>Activité récente</Text>
          <View style={[styles.actionList, { backgroundColor: theme.colors.surface }]}> 
            {activities.length > 0 ? (
              activities.map((activity, index) => (
                <View key={index} style={[styles.actionItem, { backgroundColor: theme.colors.bgApp }]}> 
                  <Text style={styles.activityIcon}>{activity.icon}</Text>
                  <View style={styles.actionTextContainer}>
                    <Text style={[styles.actionTitle, { color: theme.colors.textDark }] }>
                      {activity.title}{' '}
                      {activity.urgent && <Text style={[styles.activityUrgent, { color: theme.colors.danger }]}>● Urgent</Text>}
                    </Text>
                    <Text style={[styles.actionMeta, { color: theme.colors.textMuted }]}>{activity.subtitle}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.emptyActivity}>
                <Text style={[styles.emptyActivityText, { color: theme.colors.textMuted }]}> 
                  Aucune activité récente. Commencez par ajouter des articles !
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#CFD8DC',
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  appContainer: {
    flex: 1,
    backgroundColor: LIGHT_COLORS.bgApp,
    paddingTop: 0,
    maxWidth: 430,
    width: '100%',
    alignSelf: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 70,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: LIGHT_COLORS.textDark,
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  badgeFamily: {
    backgroundColor: LIGHT_COLORS.accentPurpleBg,
    color: '#9A73D5',
    fontSize: 11,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    fontWeight: '800',
    textTransform: 'uppercase',
    borderWidth: 1,
    borderColor: '#D8C5F5',
    alignSelf: 'flex-start',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  themeBtn: {
    backgroundColor: '#2C5282',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 5,
  },
  themeBtnIcon: {
    fontSize: 22,
  },
  profileBtn: {
    backgroundColor: '#2C5282',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 5,
  },
  profileIcon: {
    color: 'white',
    fontSize: 22,
  },
  contentScroll: {
    flex: 1,
    paddingHorizontal: 24,
  },
  summaryCard: {
    backgroundColor: LIGHT_COLORS.surfaceTint,
    borderRadius: 28,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  summaryTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: LIGHT_COLORS.textDark,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: 14,
    color: LIGHT_COLORS.textMuted,
    fontWeight: '600',
  },
  badgeUrgentLarge: {
    backgroundColor: LIGHT_COLORS.dangerBg,
    color: LIGHT_COLORS.danger,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(240,128,128,0.2)',
  },
  badgeUrgentIcon: {
    fontSize: 18,
    marginBottom: 4,
  },
  badgeUrgentText: {
    color: LIGHT_COLORS.danger,
    fontSize: 14,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: LIGHT_COLORS.textDark,
  },
  manageLink: {
    color: '#007AFF',
    fontWeight: '700',
  },
  membersRow: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  memberCard: {
    backgroundColor: LIGHT_COLORS.surface,
    minWidth: 110,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 3,
  },
  memberAvatarSquare: {
    width: 56,
    height: 56,
    backgroundColor: LIGHT_COLORS.accentPurpleBg,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  memberAvatarIcon: {
    fontSize: 28,
    color: LIGHT_COLORS.accentPurpleText,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '800',
    color: LIGHT_COLORS.textDark,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
    color: LIGHT_COLORS.textDark,
  },
  actionList: {
    backgroundColor: LIGHT_COLORS.surface,
    borderRadius: 28,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 3,
    marginBottom: 24,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: LIGHT_COLORS.bgApp,
    borderRadius: 20,
    marginBottom: 8,
  },
  activityIcon: {
    fontSize: 22,
    marginRight: 14,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: LIGHT_COLORS.textDark,
    marginBottom: 2,
  },
  activityUrgent: {
    color: LIGHT_COLORS.danger,
    fontSize: 12,
  },
  actionMeta: {
    fontSize: 13,
    color: LIGHT_COLORS.textMuted,
    fontWeight: '600',
  },
  emptyActivity: {
    padding: 20,
    alignItems: 'center',
  },
  emptyActivityText: {
    color: LIGHT_COLORS.textMuted,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});