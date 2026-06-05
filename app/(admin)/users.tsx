import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView } from '@/src/components/theme/themed-view';
import { useTheme } from '@/src/components/theme/theme-provider';
import { getAllUsers, banUser, unbanUser, deleteUserRecord, AdminUserRecord } from '@/src/services/adminService';

const ROLE_COLOR: Record<string, string> = {
  CLIENT: '#3B82F6',
  VENDOR: '#EC4899',
  ADMIN:  '#DC2626',
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
            if (isBanned) {
              await unbanUser(user.uid);
            } else {
              await banUser(user.uid);
            }
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
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteUserRecord(user.uid);
          setUsers((prev) => prev.filter((u) => u.uid !== user.uid));
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top', 'left', 'right']}>
      <ThemedView variant="background" style={styles.header}>
        <ThemedText className="text-2xl font-bold">Users</ThemedText>
        <ThemedText variant="secondary" className="text-sm mt-1">{users.length} registered</ThemedText>
      </ThemedView>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#DC2626" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(u) => u.uid}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={({ item }) => (
            <ThemedView variant="card" style={[styles.card, item.profile.banned && { opacity: 0.6 }]}>
              <View style={styles.cardTop}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={20} color="#fff" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <ThemedText className="font-semibold">{item.profile.name || '—'}</ThemedText>
                    <View style={[styles.roleBadge, { backgroundColor: (ROLE_COLOR[item.profile.role] ?? '#6B7280') + '20' }]}>
                      <ThemedText style={{ fontSize: 10, fontWeight: '700', color: ROLE_COLOR[item.profile.role] ?? '#6B7280' }}>
                        {item.profile.role}
                      </ThemedText>
                    </View>
                    {item.profile.banned && (
                      <View style={[styles.roleBadge, { backgroundColor: '#FEE2E2' }]}>
                        <ThemedText style={{ fontSize: 10, fontWeight: '700', color: '#DC2626' }}>BANNED</ThemedText>
                      </View>
                    )}
                  </View>
                  <ThemedText variant="secondary" className="text-xs mt-0.5">{item.profile.email}</ThemedText>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity onPress={() => handleBan(item)} style={[styles.actionBtn, { borderColor: item.profile.banned ? '#10B981' : '#F59E0B' }]}>
                  <Ionicons name={item.profile.banned ? 'checkmark-circle-outline' : 'ban-outline'} size={14} color={item.profile.banned ? '#10B981' : '#F59E0B'} />
                  <ThemedText style={{ fontSize: 12, fontWeight: '600', marginLeft: 4, color: item.profile.banned ? '#10B981' : '#F59E0B' }}>
                    {item.profile.banned ? 'Unban' : 'Ban'}
                  </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item)} style={[styles.actionBtn, { borderColor: '#EF4444' }]}>
                  <Ionicons name="trash-outline" size={14} color="#EF4444" />
                  <ThemedText style={{ fontSize: 12, fontWeight: '600', marginLeft: 4, color: '#EF4444' }}>Delete</ThemedText>
                </TouchableOpacity>
              </View>
            </ThemedView>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  card: { borderRadius: 16, padding: 14 },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#6B7280', alignItems: 'center', justifyContent: 'center' },
  roleBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 12, paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5E7EB' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
});
