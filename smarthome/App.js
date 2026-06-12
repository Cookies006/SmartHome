import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import AuthScreen from './Auth.js';
import DashboardScreen from './Dashboard.js';
import FamillesScreen from './Familles.js';
import CoursesScreen from './Courses.js';
import HistoryScreen from './Historique.js';
import { ThemeProvider, useTheme } from './ThemeContext.js';
import api from './api.js';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Indique à l'application comment se comporter si une notification arrive 
// PENDANT que l'utilisateur est en train de l'utiliser.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

async function registerForPushNotificationsAsync() {
  let token;

  // 1. Sur Android, il faut créer un "Canal" de notifications
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  // 2. On vérifie qu'on est sur un vrai téléphone (les émulateurs ne reçoivent pas de push)
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    // 3. Si on n'a pas encore la permission, on la demande à l'utilisateur
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    // 4. Si l'utilisateur refuse, on annule tout
    if (finalStatus !== 'granted') {
      console.log('Permission refusée pour les notifications.');
      return;
    }
    
    // 5. Succès ! On récupère le fameux Token
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      console.error('❌ projectId introuvable dans app.json (extra.eas.projectId)');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    console.log("🎉 MON PUSH TOKEN EXPO EST :", token);
    
  } else {
    console.log('⚠️ Les notifications Push nécessitent un vrai téléphone, pas un émulateur.');
  }

  return token;
}

function AppContent() {
  const { theme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [historyItems, setHistoryItems] = useState([]);
  const [activeFamily, setActiveFamily] = useState(null);

  const [pushToken, setPushToken] = useState(null);

  // Récupère le token au démarrage
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setPushToken(token);
        console.log('🎟️ Token mis en attente :', token);
      }
    });
  }, []);

  // Dès que le token arrive ET qu'on est déjà connecté → on l'envoie
  useEffect(() => {
    if (pushToken && isLoggedIn) {
      sendPushToken(pushToken);
    }
  }, [pushToken, isLoggedIn]);

  const sendPushToken = async (token) => {
    try {
      await api.savePushToken(token);
      console.log('📱 Token envoyé au serveur avec succès !');
    } catch (err) {
      console.error("Erreur lors de l'envoi du token", err);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setActiveScreen('dashboard');

    // Token déjà dispo → on envoie immédiatement
    if (pushToken) {
      sendPushToken(pushToken);
    }
    // Sinon on attend qu'il arrive (useEffect le détectera)
  };

  const addHistoryItem = (item) => {
    setHistoryItems((current) => [{ ...item, boughtAt: item.boughtAt ?? new Date().toISOString() }, ...current]);
  };

  const renderScreen = () => {
    if (activeScreen === 'courses') {
      return <CoursesScreen onMarkBought={addHistoryItem} activeFamily={activeFamily} />;
    }
    if (activeScreen === 'history') {
  return <HistoryScreen activeFamily={activeFamily} />;
   }
    if (activeScreen === 'familles') {
      return <FamillesScreen activeFamily={activeFamily} onFamilyChange={setActiveFamily} />;
    }
    return (
      <DashboardScreen
        user={user}
        activeFamily={activeFamily}
        onFamilyChange={setActiveFamily}
        onNavigate={setActiveScreen}
        onLogout={() => { setIsLoggedIn(false); setUser(null); setActiveFamily(null); }}
      />
    );
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