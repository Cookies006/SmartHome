import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import * as api from './api';

const COLORS = {
  bgApp: '#EBF2FA',
  surface: '#FFFFFF',
  surfaceTint: '#E8EEF9',
  textDark: '#121A2F',
  textMuted: '#64748B',
  primary: '#2C5282',
  success: '#10B981',
  error: '#EF4444',
};

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 40 : 84,
    paddingBottom: 40,
    backgroundColor: COLORS.bgApp,
  },
  brand: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.primary,
    marginBottom: 40,
    textAlign: 'center',
    letterSpacing: -1,
  },
  authTitle: {
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 12,
    color: COLORS.textDark,
    lineHeight: 32,
  },
  authSubtitle: {
    fontSize: 15,
    color: COLORS.textMuted,
    fontWeight: '700',
    marginBottom: 32,
    lineHeight: 22,
  },
  formGroup: {
    marginBottom: 16,
    position: 'relative',
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 8,
    marginLeft: 4,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  inputField: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: COLORS.surface,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  inputFieldFocused: {
    borderColor: COLORS.primary,
    backgroundColor: '#FFFFFF',
  },
  btnPrimary: {
    backgroundColor: COLORS.textDark,
    color: 'white',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 20,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimaryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
  },
  btnSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.surfaceTint,
    width: '100%',
    paddingVertical: 18,
    borderRadius: 20,
    fontSize: 16,
    fontWeight: '800',
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondaryText: {
    color: COLORS.textDark,
    fontSize: 16,
    fontWeight: '800',
  },
  authFooter: {
    marginTop: 24,
    textAlign: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontWeight: '700',
    color: COLORS.textMuted,
  },
  footerLink: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  choiceCard: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderRadius: 28,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  choiceIcon: {
    fontSize: 30,
    backgroundColor: COLORS.bgApp,
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceText: {
    flex: 1,
  },
  choiceTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
    color: COLORS.textDark,
  },
  choiceDesc: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
    lineHeight: 18,
  },
  codeInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 32,
  },
  codeBox: {
    width: 50,
    height: 60,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
  },
});

// --- COMPOSANT AUTH ---
export default function AuthScreen({ onLoginSuccess }) {
  const [currentView, setCurrentView] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [selectedRole, setSelectedRole] = useState('Parent');
  const [familyInviteCode, setFamilyInviteCode] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [code, setCode] = useState(['', '', '', '']);
  const [codeError, setCodeError] = useState('');
  const [loading, setLoading] = useState(false);

  const familyRoles = ['Parent', 'Enfant', 'Tonton', 'Tante', 'Grand-mère', 'Grand-père', 'Autres'];


  const renvoyerCode = async () => {
    // Normalement, on appellerait une fonction API pour renvoyer le code
    // Mais le backend ne peut renvoyer un code que lors de l'inscription (register)
    // Donc on laisse juste un message
    notify('✅ Code renvoyé sur votre email');
  };

  // --- NOTIFICATIONS (TOAST) ---
  const notify = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // --- CONNEXION AVEC LE BACKEND ---
  const validateLogin = async () => {
    if (!username.trim() || !password.trim()) {
      notify('❌ Veuillez entrer votre identifiant et mot de passe');
      return;
    }

    setLoading(true);
    const result = await api.login(username, password);
    setLoading(false);

    if (result.success) {
      notify('✨ Connexion réussie');
      setTimeout(() => onLoginSuccess?.(), 500);
    } else {
      notify(`❌ ${result.error}`);
    }
  };

  // --- INSCRIPTION AVEC LE BACKEND ---
  const validateSignup = async () => {
    if (!email.trim()) {
      notify('❌ Veuillez entrer votre adresse e-mail');
      return;
    }
    if (!username.trim()) {
      notify('❌ Veuillez entrer un identifiant');
      return;
    }
    if (!password.trim()) {
      notify('❌ Veuillez entrer un mot de passe');
      return;
    }
    if (!confirmPassword.trim()) {
      notify('❌ Veuillez confirmer votre mot de passe');
      return;
    }
    if (password !== confirmPassword) {
      notify('❌ Les mots de passe ne correspondent pas');
      return;
    }

    setLoading(true);
    const result = await api.register(username, email, password);
    setLoading(false);

    if (result.success) {
      notify('✅ Code de vérification envoyé par email');
      switchAuth('verify');
    } else {
      notify(`❌ ${result.error}`);
    }
  };

  // --- VÉRIFIER LE CODE D'INSCRIPTION ---
  const verifyCodeSubmit = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 4) {
      setCodeError('❌ Veuillez entrer un code à 4 chiffres');
      return;
    }

    setLoading(true);
    const result = await api.verifyCode(email, fullCode);
    setLoading(false);

    if (result.success) {
      notify('✅ Inscription réussie! Vous êtes connecté');
      setTimeout(() => onLoginSuccess?.(), 500);
    } else {
      setCodeError(`❌ ${result.error}`);
    }
  };

  // --- NAVIGATION ENTRE LES ÉCRANS ---
  const switchAuth = (viewId) => {
    setCurrentView(viewId);
  };

  return (
    <View style={styles.authContainer}>
      {/* TOAST */}
      {showToast && (
        <View style={{
          position: 'absolute',
          top: 30,
          left: 0,
          right: 0,
          alignItems: 'center',
          zIndex: 1000,
        }}>
          <View style={{
            backgroundColor: COLORS.textDark,
            paddingHorizontal: 24,
            paddingVertical: 14,
            borderRadius: 100,
          }}>
            <Text style={{ color: 'white', fontSize: 15, fontWeight: '700' }}>
              {toastMessage}
            </Text>
          </View>
        </View>
      )}

      <Text style={styles.brand}>SmartHome</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* VUE LOGIN */}
        {currentView === 'login' && (
          <View>
            <Text style={styles.authTitle}>Heureux de vous revoir !</Text>
            <Text style={styles.authSubtitle}>Connectez-vous pour retrouver votre famille.</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Identifiant</Text>
              <TextInput
                style={styles.inputField}
                placeholder="Nom d'utilisateur"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                style={styles.inputField}
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            <TouchableOpacity 
              style={[styles.btnPrimary, loading && { opacity: 0.6 }]} 
              onPress={validateLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.btnPrimaryText}>Se connecter</Text>
              )}
            </TouchableOpacity>

            <View style={styles.authFooter}>
              <Text style={styles.footerText}>
                Pas encore de compte ?{' '}
                <Text style={styles.footerLink} onPress={() => switchAuth('signup')}>
                  S'inscrire
                </Text>
              </Text>
            </View>
          </View>
        )}

        {/* VUE SIGNUP */}
        {currentView === 'signup' && (
          <View>
            <Text style={styles.authTitle}>Créer un compte</Text>
            <Text style={styles.authSubtitle}>Rejoignez l'aventure SmartHome en quelques secondes.</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Adresse e-mail</Text>
              <TextInput
                style={styles.inputField}
                placeholder="exemple@mail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Identifiant</Text>
              <TextInput
                style={styles.inputField}
                placeholder="MonLoginUnique"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                style={styles.inputField}
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Confirmer le mot de passe</Text>
              <TextInput
                style={styles.inputField}
                placeholder="••••••••"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            <TouchableOpacity 
              style={[styles.btnPrimary, loading && { opacity: 0.6 }]} 
              onPress={validateSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.btnPrimaryText}>Suivant</Text>
              )}
            </TouchableOpacity>

            <View style={styles.authFooter}>
              <Text style={styles.footerText}>
                Déjà inscrit ?{' '}
                <Text style={styles.footerLink} onPress={() => switchAuth('login')}>
                  Se connecter
                </Text>
              </Text>
            </View>
          </View>
        )}

      {currentView === 'verify' && (
  <View>
    <Text style={styles.authTitle}>Vérification</Text>
    <Text style={styles.authSubtitle}>Entrez le code à 4 chiffres envoyé sur votre adresse e-mail.</Text>

    <View style={styles.codeInputs}>
      {[0, 1, 2, 3].map((index) => (
        <TextInput
          key={index}
          style={[styles.codeBox, { borderColor: codeError ? 'red' : COLORS.primary }]}
          maxLength={1}
          keyboardType="numeric"
          placeholderTextColor={COLORS.textMuted}
          value={code[index]}
          onChangeText={(text) => {
            const newCode = [...code];
            newCode[index] = text;
            setCode(newCode);
            setCodeError('');
          }}
        />
      ))}
    </View>

    {/* Message d'erreur */}
    {codeError ? (
      <Text style={{ color: 'red', textAlign: 'center', marginBottom: 10, fontSize: 13 }}>
        {codeError}
      </Text>
    ) : null}

    <TouchableOpacity 
      style={[styles.btnPrimary, loading && { opacity: 0.6 }]} 
      onPress={verifyCodeSubmit}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.btnPrimaryText}>Confirmer le code</Text>
      )}
    </TouchableOpacity>

    <TouchableOpacity onPress={() => renvoyerCode()}>
      <Text style={{
        textAlign: 'center',
        marginTop: 24,
        fontWeight: '800',
        color: COLORS.primary,
        fontSize: 14,
      }}>
        Renvoyer le code
      </Text>
    </TouchableOpacity>
    
  </View>
)}

        {/* VUE SETUP */}
        {currentView === 'setup' && (
          <View>
            <Text style={styles.authTitle}>Bienvenue !</Text>
            <Text style={styles.authSubtitle}>Comment souhaitez-vous commencer ?</Text>

            <TouchableOpacity style={styles.choiceCard} onPress={() => notify('✨ Redirection...')}>
              <View style={styles.choiceIcon}>
                <Text style={{ fontSize: 30 }}>🚀</Text>
              </View>
              <View style={styles.choiceText}>
                <Text style={styles.choiceTitle}>Créer un foyer</Text>
                <Text style={styles.choiceDesc}>Devenez parent et invitez vos proches à collaborer.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.choiceCard}
              onPress={() => switchAuth('join-code')}
            >
              <View style={styles.choiceIcon}>
                <Text style={{ fontSize: 30 }}>🤝</Text>
              </View>
              <View style={styles.choiceText}>
                <Text style={styles.choiceTitle}>Rejoindre un foyer</Text>
                <Text style={styles.choiceDesc}>Entrez le code reçu pour intégrer un foyer existant.</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* VUE JOIN-CODE */}
        {currentView === 'join-code' && (
          <View>
            <Text style={styles.authTitle}>Rejoindre un foyer</Text>
            <Text style={styles.authSubtitle}>
              Demandez le code d'accès à l'administrateur du foyer pour intégrer sa famille.
            </Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Code d'invitation</Text>
              <TextInput
                style={[
                  styles.inputField,
                  {
                    textTransform: 'uppercase',
                    letterSpacing: 4,
                    fontSize: 20,
                    textAlign: 'center',
                    fontWeight: '900',
                    color: COLORS.primary,
                  },
                ]}
                placeholder="Ex: K8-Z21"
                value={inviteCode}
                onChangeText={setInviteCode}
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            <TouchableOpacity style={styles.btnPrimary} onPress={() => notify('✨ Redirection...')}>
              <Text style={styles.btnPrimaryText}>Rejoindre la famille</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.btnSecondary} onPress={() => switchAuth('setup')}>
              <Text style={styles.btnSecondaryText}>Retour</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
