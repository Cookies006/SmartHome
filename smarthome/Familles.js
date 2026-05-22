import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput, StyleSheet, Alert, Platform } from 'react-native';
import { useTheme } from './ThemeContext';

const COLORS = {
  bgApp: '#EBF2FA',
  surface: '#FFFFFF',
  surfaceTint: '#E8EEF9',
  textDark: '#121A2F',
  textMuted: '#64748B',
  primary: '#2C5282',
  accentPurpleBg: '#EAE0F8',
  danger: '#F08080',
};

const createStyles = (COLORS) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgApp,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 54,
    paddingBottom: 20,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textDark,
    letterSpacing: -0.5,
  },
  contentScroll: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  familySelectorWrapper: {
    marginBottom: 24,
  },
  selectorBox: {
    width: '100%',
    borderWidth: 2,
    borderColor: COLORS.surfaceTint,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
  },
  selectorButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  selectorText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  selectorOptions: {
    marginTop: 8,
    borderWidth: 2,
    borderColor: COLORS.surfaceTint,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
  },
  familyOption: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceTint,
    backgroundColor: COLORS.surface,
  },
  familyOptionText: {
    fontSize: 16,
    color: COLORS.textDark,
  },
  familyOptionTextActive: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '900',
  },
  inviteCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    padding: 24,
    marginBottom: 24,
    elevation: 3,
  },
  inviteCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
    color: COLORS.textDark,
  },
  inviteCardDesc: {
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginBottom: 16,
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
    color: COLORS.textDark,
  },
  memberList: {
    gap: 12,
    marginBottom: 24,
  },
  memberRow: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    elevation: 2,
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.accentPurpleBg,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
    color: COLORS.textDark,
  },
  memberRole: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  memberRoleAdmin: {
    color: COLORS.primary,
  },
  btnRemoveMember: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.bgApp,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
    color: 'white',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 20,
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
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSecondaryText: {
    color: COLORS.textDark,
    fontSize: 16,
    fontWeight: '800',
  },
  btnAddFamily: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    width: '100%',
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnAddFamilyText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(18, 26, 47, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    width: '90%',
    maxWidth: 360,
    borderRadius: 28,
    padding: 24,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 20,
    color: COLORS.textDark,
  },
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
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  btnModal: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 20,
    fontWeight: '800',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancel: {
    backgroundColor: COLORS.bgApp,
  },
  btnCancelText: {
    color: COLORS.textMuted,
    fontWeight: '800',
  },
  btnDanger: {
    backgroundColor: COLORS.danger,
  },
  btnDangerText: {
    color: 'white',
    fontWeight: '800',
  },
  btnPrimaryModal: {
    backgroundColor: COLORS.primary,
  },
  btnPrimaryModalText: {
    color: 'white',
    fontWeight: '800',
  },
  toast: {
    position: 'absolute',
    top: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
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
  toastText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
  },
  inviteCodeContainer: {
    backgroundColor: COLORS.surfaceTint,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 16,
  },
  inviteCodeLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  inviteCode: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 4,
    marginBottom: 4,
    textAlign: 'center',
  },
  inviteCodeExpiry: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.danger,
    marginBottom: 16,
  },
});

const familiesData = {
  'faye': {
    members: [
      { id: 'm1', name: 'Papa (Vous)', role: 'Administrateur', roleClass: 'role-admin', bg: COLORS.accentPurpleBg, canDelete: false },
      { id: 'm2', name: 'Maman', role: 'Membre', roleClass: '', bg: '#D1FAE5', canDelete: true },
      { id: 'm3', name: 'Fatou', role: 'Enfant', roleClass: '', bg: '#FEE2E2', canDelete: true }
    ]
  },
  'coloc': {
    members: [
      { id: 'c1', name: 'Toi (Vous)', role: 'Administrateur', roleClass: 'role-admin', bg: COLORS.accentPurpleBg, canDelete: false },
      { id: 'c2', name: 'Marc', role: 'Enfant', roleClass: '', bg: '#FEF3C7', canDelete: true },
      { id: 'c3', name: 'Sophie', role: 'Membre', roleClass: '', bg: '#E0F2FE', canDelete: true }
    ]
  },
  'khadija': {
    members: [
      { id: 'k1', name: 'Khadija (Vous)', role: 'Administrateur', roleClass: 'role-admin', bg: COLORS.accentPurpleBg, canDelete: false },
      { id: 'k2', name: 'Amina', role: 'Membre', roleClass: '', bg: '#D1FAE5', canDelete: true },
      { id: 'k3', name: 'Youssef', role: 'Enfant', roleClass: '', bg: '#FEE2E2', canDelete: true }
    ]
  }
};

export default function FamillesScreen() {
  const { theme } = useTheme();
  const styles = createStyles(theme.colors);
  const [selectedFamily, setSelectedFamily] = useState('faye');
  const [members, setMembers] = useState(familiesData.faye.members);
  const [showFamilyOptions, setShowFamilyOptions] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastIcon, setToastIcon] = useState('✨');
  const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);
  const [showJoinFamilyModal, setShowJoinFamilyModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [inviteCode, setInviteCode] = useState(null);
  const [families, setFamilies] = useState({
    'faye': 'Famille Faye (Active)',
    'coloc': 'Colocation Paris',
    'khadija': 'Famille Khadija',
  });

  const notify = (message, icon = '✨') => {
    setToastMessage(message);
    setToastIcon(icon);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const changeFamily = (familyId, familyLabel = null) => {
    setSelectedFamily(familyId);
    setMembers(familiesData[familyId].members);
    setInviteCode(null);
    setShowFamilyOptions(false);
    const label = familyLabel ?? families[familyId] ?? 'Nouveau foyer';
    notify(`Basculé sur : ${label.replace(' (Active)', '')}`, '🔄');
  };

  const toggleFamilyDropdown = () => {
    setShowFamilyOptions((current) => !current);
  };

  const generateInvite = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 2; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    code += '-';
    for (let i = 0; i < 3; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
    setInviteCode(code);
    notify('Code généré avec succès !', '✨');
  };

  const copyInviteCode = () => {
    if (inviteCode) {
      // Utiliser Alert pour simuler la copie (ou intégrer une vraie solution clipboard plus tard)
      Alert.alert('Code d\'invitation', inviteCode, [
        { text: 'OK', onPress: () => notify('Code copié !', '📋') }
      ]);
    }
  };

  const requestDeleteMember = (member) => {
    setMemberToDelete(member);
    setShowConfirmModal(true);
  };

  const executeDeleteMember = () => {
    if (memberToDelete) {
      setMembers(members.filter(m => m.id !== memberToDelete.id));
      notify('Membre retiré', '🗑️');
    }
    setShowConfirmModal(false);
    setMemberToDelete(null);
  };

  const executeAddFamily = () => {
    if (!newFamilyName.trim()) {
      notify('Veuillez entrer un nom', '⚠️');
      return;
    }

    const newFamilyId = 'new_' + Date.now();
    const newFamilies = { ...families, [newFamilyId]: newFamilyName };
    setFamilies(newFamilies);
    
    familiesData[newFamilyId] = {
      members: [
        { id: 'm_' + Date.now(), name: 'Vous', role: 'Administrateur', roleClass: 'role-admin', bg: COLORS.accentPurpleBg, canDelete: false }
      ]
    };

    changeFamily(newFamilyId, newFamilyName);
    setShowAddFamilyModal(false);
    setNewFamilyName('');
    notify('Foyer créé avec succès !', '🏠');
  };

  const executeJoinNewFamily = () => {
    const code = joinCode.toUpperCase().trim();
    
    if (code === 'K8-Z21') {
      notify('Foyer rejoint avec succès !', '✅');
      setShowJoinFamilyModal(false);
      setJoinCode('');
    } else {
      notify('Code invalide ou expiré', '❌');
    }
  };

  return (
    <View style={styles.container}>
      {/* TOAST */}
      {showToast && (
        <View style={styles.toast}>
          <View style={styles.toastContent}>
            <Text>{toastIcon}</Text>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        </View>
      )}

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>👨‍👩‍👧‍👦 Familles</Text>
      </View>

      {/* CONTENT */}
      <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
        {/* FAMILY SELECTOR */}
        <View style={styles.familySelectorWrapper}>
          <View style={styles.selectorBox}>
            <TouchableOpacity onPress={toggleFamilyDropdown} style={styles.selectorButton}>
              <Text style={styles.selectorText}>{families[selectedFamily]}</Text>
            </TouchableOpacity>
          </View>
          {showFamilyOptions && (
            <View style={styles.selectorOptions}>
              {Object.keys(families).map((familyId) => (
                <TouchableOpacity
                  key={familyId}
                  onPress={() => changeFamily(familyId)}
                  style={styles.familyOption}
                >
                  <Text
                    style={familyId === selectedFamily ? styles.familyOptionTextActive : styles.familyOptionText}
                  >
                    {families[familyId]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* INVITE CARD */}
        <View style={styles.inviteCard}>
          <Text style={styles.inviteCardTitle}>Agrandir la famille</Text>
          <Text style={styles.inviteCardDesc}>Invitez de nouveaux membres à rejoindre votre foyer.</Text>
          
          {!inviteCode ? (
            <TouchableOpacity style={styles.btnPrimary} onPress={generateInvite}>
              <Text style={styles.btnPrimaryText}>+ Inviter</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.inviteCodeContainer}>
              <Text style={styles.inviteCodeLabel}>Code d'accès</Text>
              <Text style={styles.inviteCode}>{inviteCode}</Text>
              <Text style={styles.inviteCodeExpiry}>⏱️ Valide pour 24h</Text>
              <TouchableOpacity style={styles.btnSecondary} onPress={copyInviteCode}>
                <Text style={styles.btnSecondaryText}>Copier le code</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* MEMBERS SECTION */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Membres ({members.length})</Text>
        </View>

        <View style={styles.memberList}>
          {members.map((member) => (
            <View key={member.id} style={styles.memberRow}>
              <View style={[styles.memberAvatar, { backgroundColor: member.bg }]}>
                <Text style={{ fontSize: 20 }}>👤</Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={[styles.memberRole, member.roleClass === 'role-admin' && styles.memberRoleAdmin]}>
                  {member.role}
                </Text>
              </View>
              {member.canDelete && (
                <TouchableOpacity 
                  style={styles.btnRemoveMember}
                  onPress={() => requestDeleteMember(member)}
                >
                  <Text style={{ fontSize: 16, color: COLORS.textMuted }}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* ACTION BUTTONS */}
        <TouchableOpacity style={styles.btnAddFamily} onPress={() => setShowAddFamilyModal(true)}>
          <Text style={{ fontSize: 20 }}>➕</Text>
          <Text style={styles.btnAddFamilyText}>Créer un nouveau foyer</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.btnAddFamily, { borderColor: COLORS.primary, marginTop: 12 }]}
          onPress={() => setShowJoinFamilyModal(true)}
        >
          <Text style={{ fontSize: 20 }}>🔗</Text>
          <Text style={[styles.btnAddFamilyText, { color: COLORS.primary }]}>Rejoindre avec un code</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MODALS */}
      {/* ADD FAMILY MODAL */}
      <Modal visible={showAddFamilyModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouveau Foyer</Text>
            <TextInput
              style={styles.inputField}
              placeholder="Ex: Maison de vacances..."
              value={newFamilyName}
              onChangeText={setNewFamilyName}
              placeholderTextColor={COLORS.textMuted}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.btnModal, styles.btnCancel]} onPress={() => setShowAddFamilyModal(false)}>
                <Text style={styles.btnCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnModal, styles.btnPrimaryModal]} onPress={executeAddFamily}>
                <Text style={styles.btnPrimaryModalText}>Créer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* JOIN FAMILY MODAL */}
      <Modal visible={showJoinFamilyModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Rejoindre un foyer</Text>
            <Text style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 15, fontWeight: '700' }}>
              Entrez le code d'invitation que vous avez reçu.
            </Text>
            <TextInput
              style={[styles.inputField, { textTransform: 'uppercase', textAlign: 'center', letterSpacing: 3, fontWeight: '900' }]}
              placeholder="Ex: K8-Z21"
              value={joinCode}
              onChangeText={setJoinCode}
              placeholderTextColor={COLORS.textMuted}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.btnModal, styles.btnCancel]} onPress={() => setShowJoinFamilyModal(false)}>
                <Text style={styles.btnCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnModal, styles.btnPrimaryModal]} onPress={executeJoinNewFamily}>
                <Text style={styles.btnPrimaryModalText}>Rejoindre</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* CONFIRM DELETE MODAL */}
      <Modal visible={showConfirmModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { textAlign: 'center' }]}>Retirer ce membre ?</Text>
            <Text style={{ marginBottom: 24, fontWeight: '700', color: COLORS.textMuted, fontSize: 15, textAlign: 'center' }}>
              Voulez-vous vraiment retirer <Text style={{ color: COLORS.textDark, fontWeight: '900' }}>{memberToDelete?.name}</Text> de ce foyer ?
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.btnModal, styles.btnCancel]} onPress={() => setShowConfirmModal(false)}>
                <Text style={styles.btnCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnModal, styles.btnDanger]} onPress={executeDeleteMember}>
                <Text style={styles.btnDangerText}>Retirer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
