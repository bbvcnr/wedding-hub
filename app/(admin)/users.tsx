import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { useTheme } from '@/src/components/theme/theme-provider';
import { getAllUsers, banUser, unbanUser, deleteUserRecord, AdminUserRecord } from '@/src/services/adminService';

const ROLE_COLOR: Record<string, string> = {
  CLIENT:    '#3B82F6',
  VENDOR:    '#EC4899',
  ORGANIZER: '#14B8A6',
  ADMIN:     '#EF4444',
};

export default function AdminUsersScreen() {
  const { colors } = useTheme();
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const data = await getAllUsers().catch(() => []);
    setUsers(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleBan = (user: AdminUserRecord) => {
    const isBanned = user.profile.banned;
    Alert.alert(
      isBanned ? 'Unban User' : 'Ban User',
      `${isBanned ? 'Restore access for' : 'Block access for'} ${user.profile.name || user.profile.email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: isBanned ? 'Unban' : 'Ban',
          style: isBanned ? 'default' : 'destructive',
          onPress: async () => {
            isBanned ? await unbanUser(user.uid) : await banUser(user.uid);
            setUsers((prev) => prev.map((u) =>
              u.uid === user.uid ? { ...u, profile: { ...u.profile, banned: !isBanned } } : u
            ));
          },
        },
      ]
    );
  };

  const handleDelete = (user: AdminUserRecord) => {
    Alert.alert('Delete User', `Permanently delete ${user.profile.name || user.profile.email}?\n\nThis cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive',
        onPress: async () => {
          await deleteUserRecord(user.uid);
          setUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <ThemedText style={styles.headerTitle}>Users</ThemedText>
        <ThemedText variant="secondary" style={styles.headerSub}>{users.length} registered</ThemedText>
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 48 }} color={colors.accent.pink} size="large" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(u) => u.uid}
          contentContainerStyle={{ padding: 16, paddingBottom: 110, gap: 12 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.accent.blue + '18' }]}>
                <Ionicons name="people-outline" size={32} color={colors.accent.blue} />
              </View>
              <ThemedText style={styles.emptyTitle}>No users yet</ThemedText>
              <ThemedText variant="secondary" style={styles.emptySub}>Registered users will appear here.</ThemedText>
            </View>
          }
          renderItem={({ item }) => {
            const roleColor = ROLE_COLOR[item.profile.role] ?? '#6B7280';
            return (
              <ThemedView variant="card" style={[styles.card, item.profile.banned && { opacity: 0.55 }]}>
                <View style={styles.cardTop}>
                  <View style={[styles.avatar, { backgroundColor: roleColor + '20' }]}>
                    <Ionicons name="person" size={20} color={roleColor} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <ThemedText style={styles.name}>{item.profile.name || '—'}</ThemedText>
                      <View style={[styles.badge, { backgroundColor: roleColor + '18' }]}>
                        <Text style={[styles.badgeText, { color: roleColor }]}>{item.profile.role}</Text>
                      </View>
                      {item.profile.banned && (
                        <View style={[styles.badge, { backgroundColor: '#FEE2E2' }]}>
                          <Text style={[styles.badgeText, { color: '#EF4444' }]}>BANNED</Text>
                        </View>
                      )}
                    </View>
                    <ThemedText variant="secondary" style={styles.email}>{item.profile.email}</ThemedText>
                  </View>
                </View>

                <View style={styles.actions}>
                  <TouchableOpacity
                    onPress={() => handleBan(item)}
                    style={[styles.actionBtn, { backgroundColor: item.profile.banned ? '#10B981' : '#F59E0B' }]}
                  >
                    <Ionicons
                      name={item.profile.banned ? 'checkmark-circle' : 'ban'}
                      size={14}
                      color="#fff"
                    />
                    <Text style={styles.actionLabel}>
                      {item.profile.banned ? 'Unban' : 'Ban'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(item)}
                    style={[styles.actionBtn, { backgroundColor: '#EF4444' }]}
                  >
                    <Ionicons name="trash" size={14} color="#fff" />
                    <Text style={styles.actionLabel}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </ThemedView>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerTitle: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  headerSub: { fontSize: 13, marginTop: 2 },
  card: { borderRadius: 18, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 15, fontWeight: '700' },
  email: { fontSize: 12, marginTop: 2 },
  badge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 },
  badgeText: { fontSize: 10, fontWeight: '700' },
  actions: { flexDirection: 'row', gap: 8, marginTop: 12, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(0,0,0,0.06)' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  actionLabel: { fontSize: 13, fontWeight: '700', color: '#fff' },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 6 },
  emptySub: { fontSize: 14, textAlign: 'center' },
});
