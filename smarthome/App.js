import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import AuthScreen from './Auth.js';
import DashboardScreen from './Dashboard.js';
import FamillesScreen from './Familles.js';
import CoursesScreen from './Courses.js';
import HistoryScreen from './Historique.js';
import { ThemeProvider, useTheme } from './ThemeContext.js';

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [historyItems, setHistoryItems] = useState([]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setActiveScreen('dashboard');
  };

  const addHistoryItem = (item) => {
    setHistoryItems((current) => [{ ...item, boughtAt: item.boughtAt ?? new Date().toISOString() }, ...current]);
  };

  const renderScreen = () => {
    if (activeScreen === 'courses') {
      return <CoursesScreen onMarkBought={addHistoryItem} />;
    }
    if (activeScreen === 'history') {
      return <HistoryScreen historyItems={historyItems} />;
    }
    if (activeScreen === 'familles') {
      return <FamillesScreen />;
    }
    return <DashboardScreen onNavigate={setActiveScreen} onLogout={() => setIsLoggedIn(false)} />;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.bgApp }]}>
      <StatusBar barStyle={theme.isDark ? "light-content" : "dark-content"} />
      {!isLoggedIn ? (
        <AuthScreen onLoginSuccess={handleLoginSuccess} />
      ) : (
        <View style={styles.loggedInContainer}>
          <View style={styles.screenContainer}>{renderScreen()}</View>
          <View style={[styles.bottomNavContainer, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.surfaceTint }]}>
            <View style={styles.bottomNav}>
              <TouchableOpacity
                style={[styles.navItem, activeScreen === 'dashboard' && [styles.navItemActive, { backgroundColor: theme.colors.primary }]]}
                onPress={() => setActiveScreen('dashboard')}
              >
                <Text style={[styles.navIcon, activeScreen === 'dashboard' && styles.navItemActiveText, { color: activeScreen === 'dashboard' ? theme.colors.surface : theme.colors.textMuted }]}>📊</Text>
                <Text style={[styles.navItemText, activeScreen === 'dashboard' && styles.navItemActiveText, { color: activeScreen === 'dashboard' ? theme.colors.surface : theme.colors.textMuted }]}>Accueil</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.navItem, activeScreen === 'courses' && [styles.navItemActive, { backgroundColor: theme.colors.primary }]]}
                onPress={() => setActiveScreen('courses')}
              >
                <Text style={[styles.navIcon, activeScreen === 'courses' && styles.navItemActiveText, { color: activeScreen === 'courses' ? theme.colors.surface : theme.colors.textMuted }]}>🛒</Text>
                <Text style={[styles.navItemText, activeScreen === 'courses' && styles.navItemActiveText, { color: activeScreen === 'courses' ? theme.colors.surface : theme.colors.textMuted }]}>Courses</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.navItem, activeScreen === 'history' && [styles.navItemActive, { backgroundColor: theme.colors.primary }]]}
                onPress={() => setActiveScreen('history')}
              >
                <Text style={[styles.navIcon, activeScreen === 'history' && styles.navItemActiveText, { color: activeScreen === 'history' ? theme.colors.surface : theme.colors.textMuted }]}>📜</Text>
                <Text style={[styles.navItemText, activeScreen === 'history' && styles.navItemActiveText, { color: activeScreen === 'history' ? theme.colors.surface : theme.colors.textMuted }]}>Historique</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.navItem, activeScreen === 'familles' && [styles.navItemActive, { backgroundColor: theme.colors.primary }]]}
                onPress={() => setActiveScreen('familles')}
              >
                <Text style={[styles.navIcon, activeScreen === 'familles' && styles.navItemActiveText, { color: activeScreen === 'familles' ? theme.colors.surface : theme.colors.textMuted }]}>👨‍👩‍👧‍👦</Text>
                <Text style={[styles.navItemText, activeScreen === 'familles' && styles.navItemActiveText, { color: activeScreen === 'familles' ? theme.colors.surface : theme.colors.textMuted }]}>Familles</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBF2FA',
  },
  loggedInContainer: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  bottomNavContainer: {
    backgroundColor: '#FFFFFF',
    borderTopColor: '#E8EEF9',
    borderTopWidth: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  navItemActive: {
    backgroundColor: '#2C5282',
  },
  navIcon: {
    fontSize: 20,
    color: '#64748B',
  },
  navItemText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  navItemActiveText: {
    color: '#FFFFFF',
  },
});
