import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { useTheme } from './ThemeContext';
import * as api from './api';

// 1. NOTRE PETITE MÉMOIRE GLOBALE ANTI-POISSON ROUGE
let lastActiveFamilyId = null;

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
  btnPrimaryModal: {
    backgroundColor: COLORS.primary,
  },
  btnPrimaryModalText: {
    color: 'white',
    fontWeight: '800',
  },
  btnDanger: {
    backgroundColor: COLORS.danger,
  },
  btnDangerText: {
    color: 'white',
    fontWeight: '800',
  },
  toast: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  toastContent: {
    backgroundColor: COLORS.textDark,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 100,
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  toastText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
  },
  inviteCodeContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  inviteCodeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  inviteCode: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 4,
    marginBottom: 8,
  },
  inviteCodeExpiry: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginBottom: 12,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
  },
  emptyStateText: {
    color: COLORS.textMuted,
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default function FamillesScreen({ activeFamily, onFamilyChange }) {
  const { theme } = useTheme();
  const styles = createStyles(theme.colors);

  const [families, setFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [members, setMembers] = useState([]);
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(true);

  // 🛡️ ÉTATS POUR LA GESTION DES ROLES ET SÉCURITÉ UI
  const [isParent, setIsParent] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState(null);
  const [familyRoles, setFamilyRoles] = useState({});

  const [showFamilyOptions, setShowFamilyOptions] = useState(false);
  const [showAddFamilyModal, setShowAddFamilyModal] = useState(false);
  const [showJoinFamilyModal, setShowJoinFamilyModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [newFamilyName, setNewFamilyName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [joinRole, setJoinRole] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastIcon, setToastIcon] = useState('');
  const [showToast, setShowToast] = useState(false);

  const notify = (msg, icon = '✅') => {
    setToastMessage(msg);
    setToastIcon(icon);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const loadFamilies = async () => {
    setLoading(true);
    const profileResult = await api.getProfile();
    
    if (profileResult.success) {
      setCurrentUserProfile(profileResult.data);
      let userFamiliesData = profileResult.data.families || [];
      const rolesMap = {};

      if (userFamiliesData && userFamiliesData.length > 0) {
        // Sauvegarde préventive des rôles par id de famille depuis le profil
        userFamiliesData.forEach(f => {
          const idFamille = f.family_id !== undefined ? f.family_id : f.id;
          if (idFamille && f.role) {
            rolesMap[idFamille] = f.role;
          }
        });
        setFamilyRoles(rolesMap);
        
        // 🚨 LE CORRECTIF INTELLIGENT 🚨
        if (userFamiliesData[0].family_id !== undefined && userFamiliesData[0].name === undefined) {
          const realFamilies = [];
          for (const member of userFamiliesData) {
            const famRes = await api.getFamily(member.family_id);
            if (famRes.success && famRes.data.family) {
              if (!realFamilies.find(f => f.id === famRes.data.family.id)) {
                realFamilies.push(famRes.data.family);
              }
            }
          }
          userFamiliesData = realFamilies;
        }

        setFamilies(userFamiliesData);
        if (userFamiliesData.length > 0) {
          const familyToSelect = lastActiveFamilyId
            ? userFamiliesData.find(f => f.id === lastActiveFamilyId) || userFamiliesData[0]
            : userFamiliesData[0];
          // On passe directement rolesMap et profile pour éviter le délai asynchrone du setState
          selectFamily(familyToSelect, rolesMap, profileResult.data);
        }
      } else {
        setFamilies([]);
        setSelectedFamily(null);
        setMembers([]);
        setIsParent(false);
        if (onFamilyChange) {
          onFamilyChange(null);
        }
      }
    }
    setLoading(false);
  };

  const selectFamily = async (family, rolesMap = null, profile = null) => {
    lastActiveFamilyId = family.id;
    setSelectedFamily(family);
    setInviteCode(family.invite_code || '');
    setShowFamilyOptions(false);

    if (onFamilyChange) {
      onFamilyChange(family);
    }
    
    const result = await api.getFamily(family.id);
    if (result.success) {
      const fetchedMembers = result.data.members || [];
      setMembers(fetchedMembers);

      // 🔐 RECHERCHE DU RÔLE DE L'UTILISATEUR CONNECTÉ
      const currentRoles = rolesMap || familyRoles;
      const currentProfile = profile || currentUserProfile;
      let role = currentRoles[family.id];

      // Sécurité alternative : si non trouvé dans la map du profil, on cherche dans la liste des membres du foyer
      if (!role && currentProfile) {
        const me = fetchedMembers.find(m => 
          m.id === currentProfile.id || 
          m.user_id === currentProfile.id || 
          m.member_name === currentProfile.name
        );
        if (me) role = me.role;
      }

      // Seuls les "Parent" ont les accès administrateur
      setIsParent(role === 'Parent');
    }
  };

  useEffect(() => {
    loadFamilies();
  }, []);

  const executeAddFamily = async () => {
    if (!newFamilyName.trim()) {
      notify('Veuillez entrer un nom', '⚠️');
      return;
    }
    const result = await api.createFamily(newFamilyName, 'Parent');
    if (result.success) {
      setShowAddFamilyModal(false);
      setNewFamilyName('');
      notify('Foyer créé avec succès !', '🏠');
      loadFamilies();
    } else {
      notify('Erreur lors de la création', '❌');
    }
  };

  const executeJoinNewFamily = async () => {
    const code = joinCode.toUpperCase().trim();
    if (!code) {
      notify('Veuillez entrer un code', '⚠️');
      return;
    }
    if (!joinRole) {
      notify('Veuillez choisir votre rôle', '⚠️');
      return;
    }
    const result = await api.joinFamily(code, joinRole);
    if (result.success) {
      notify('Foyer rejoint avec succès !', '✅');
      setShowJoinFamilyModal(false);
      setJoinCode('');
      setJoinRole('');
      loadFamilies();
    } else {
      notify('Code invalide ou expiré', '❌');
    }
  };

  const requestDeleteMember = (member) => {
    setMemberToDelete(member);
    setShowConfirmModal(true);
  };

  const executeDeleteMember = async () => {
    if (memberToDelete) {
      const result = await api.removeFamilyMember(selectedFamily.id, memberToDelete.id);
      if (result.success) {
        setMembers(members.filter(m => m.id !== memberToDelete.id));
        notify('Membre retiré', '🗑️');

        await loadFamilies();
      } 
      else {
        notify('Erreur lors de la suppression', '❌');
      }
    }
    setShowConfirmModal(false);
    setMemberToDelete(null);
  };

  const executeGenerateCode = async () => {
    const result = await api.generateFamilyCode(selectedFamily.id);
    if (result.success) {
      setInviteCode(result.data.invite_code);
      notify('Code généré (valide 2h) !', '🔑');
    } else {
      notify('Erreur de génération', '❌');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showToast && (
        <View style={styles.toast}>
          <View style={styles.toastContent}>
            <Text>{toastIcon}</Text>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        </View>
      )}

      <View style={styles.header}>
        <Text style={styles.pageTitle}>👨‍👩‍👧‍👦 Familles</Text>
      </View>

      <ScrollView style={styles.contentScroll} showsVerticalScrollIndicator={false}>
        {/* FAMILY SELECTOR */}
        {families.length > 0 && (
          <View style={styles.familySelectorWrapper}>
            <View style={styles.selectorBox}>
              <TouchableOpacity onPress={() => setShowFamilyOptions(p => !p)} style={styles.selectorButton}>
                <Text style={styles.selectorText}>{selectedFamily?.name || 'Choisir un foyer'}</Text>
              </TouchableOpacity>
            </View>
            {showFamilyOptions && (
              <View style={styles.selectorOptions}>
                {families.map((family) => (
                  <TouchableOpacity
                    key={family.id}
                    onPress={() => selectFamily(family)}
                    style={styles.familyOption}
                  >
                    <Text style={family.id === selectedFamily?.id ? styles.familyOptionTextActive : styles.familyOptionText}>
                      {family.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* INVITE CARD 🛡️ MASQUÉE SI PAS PARENT */}
        {selectedFamily && isParent && (
          <View style={styles.inviteCard}>
            <Text style={styles.inviteCardTitle}>Agrandir la famille</Text>
            <Text style={styles.inviteCardDesc}>Générez un code sécurisé et temporaire pour inviter un proche.</Text>
            
            {inviteCode ? (
              <View style={styles.inviteCodeContainer}>
                <Text style={styles.inviteCodeLabel}>Code d'accès temporaire</Text>
                <Text style={styles.inviteCode}>{inviteCode}</Text>
                <Text style={styles.inviteCodeExpiry}>⏱️ Ce code expire dans 2 heures</Text>
              </View>
            ) : null}

            <TouchableOpacity style={styles.btnPrimary} onPress={executeGenerateCode}>
              <Text style={styles.btnPrimaryText}>
                {inviteCode ? '🔄 Générer un nouveau code' : '+ Générer un code (2H)'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* MEMBERS */}
        {selectedFamily && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Membres ({members.length})</Text>
            </View>
            <View style={styles.memberList}>
              {members.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>Aucun membre dans ce foyer.</Text>
                </View>
              ) : (
                members.map((member) => (
                  <View key={member.id} style={styles.memberRow}>
                    <View style={styles.memberAvatar}>
                      <Text style={{ fontSize: 20 }}>👤</Text>
                    </View>
                    <View style={styles.memberInfo}>
                      <Text style={styles.memberName}>{member.member_name}</Text>
                      <Text style={[styles.memberRole, member.role === 'Parent' && styles.memberRoleAdmin]}>
                        {member.role}
                      </Text>
                    </View>
                    {/* 🛡️ CROIX DE SUPPRESSION MASQUÉE SI PAS PARENT */}
                    {isParent && member.can_delete && (
                      <TouchableOpacity
                        style={styles.btnRemoveMember}
                        onPress={() => requestDeleteMember(member)}
                      >
                        <Text style={{ fontSize: 16, color: COLORS.textMuted }}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              )}
            </View>
          </>
        )}

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
              placeholder="Ex: FAYE2024"
              value={joinCode}
              onChangeText={setJoinCode}
              placeholderTextColor={COLORS.textMuted}
            />
            <Text style={{ fontSize: 13, fontWeight: '800', color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: 10 }}>
              Votre rôle dans ce foyer
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
              {['Parent', 'Enfant', 'Tonton', 'Tante', 'Grandmère', 'Grandpère', 'Autres'].map((role) => (
                <TouchableOpacity
                  key={role}
                  onPress={() => setJoinRole(role)}
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 20,
                    marginRight: 8,
                    backgroundColor: joinRole === role ? COLORS.primary : COLORS.bgApp,
                    borderWidth: 2,
                    borderColor: joinRole === role ? COLORS.primary : COLORS.surfaceTint,
                  }}
                >
                  <Text style={{ fontWeight: '800', fontSize: 13, color: joinRole === role ? 'white' : COLORS.textMuted }}>
                    {role}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
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
              Voulez-vous vraiment retirer <Text style={{ color: COLORS.textDark, fontWeight: '900' }}>{memberToDelete?.member_name}</Text> de ce foyer ?
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