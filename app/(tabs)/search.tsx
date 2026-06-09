import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Colors, Spacing, Radius } from '../../constants/theme';
import { MOCK_SPOTS, MOCK_SKATERS, SkillLevel, SpotType } from '../../constants/mockData';

type Tab = 'spots' | 'skaters';

const NEIGHBORHOODS = ['All', 'Venice', 'Hollywood', 'Downtown', 'West LA', 'Westlake', 'East LA'];
const SKILL_LEVELS: (SkillLevel | 'all')[] = ['all', 'beginner', 'intermediate', 'advanced', 'pro'];
const SKILL_COLORS: Record<SkillLevel, string> = {
  beginner: '#34C759',
  intermediate: '#FFD60A',
  advanced: '#FF6B00',
  pro: '#FF3B30',
};

export default function SearchScreen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<Tab>('spots');
  const [hood, setHood] = useState('All');
  const [skill, setSkill] = useState<SkillLevel | 'all'>('all');

  const filteredSpots = MOCK_SPOTS.filter(s => {
    const matchQ = query === '' || s.name.toLowerCase().includes(query.toLowerCase()) || s.neighborhood.toLowerCase().includes(query.toLowerCase());
    const matchHood = hood === 'All' || s.neighborhood === hood;
    const matchSkill = skill === 'all' || s.skillLevel === skill;
    return matchQ && matchHood && matchSkill;
  });

  const filteredSkaters = MOCK_SKATERS.filter(s => {
    const matchQ = query === '' || s.username.toLowerCase().includes(query.toLowerCase()) || s.displayName.toLowerCase().includes(query.toLowerCase());
    const matchSkill = skill === 'all' || s.skillLevel === skill;
    return matchQ && matchSkill;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
      </View>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Spots, skaters, neighborhoods..."
          placeholderTextColor={Colors.textMuted}
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['spots', 'skaters'] as Tab[]).map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'spots' ? '📍 Spots' : '🛹 Skaters'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
        {SKILL_LEVELS.map(l => (
          <TouchableOpacity
            key={l}
            style={[styles.chip, skill === l && styles.chipActive]}
            onPress={() => setSkill(l)}
          >
            <Text style={[styles.chipText, skill === l && styles.chipTextActive]}>
              {l === 'all' ? 'All Levels' : l.charAt(0).toUpperCase() + l.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {tab === 'spots' && (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.neighborhoods}>
            {NEIGHBORHOODS.map(n => (
              <TouchableOpacity
                key={n}
                style={[styles.chip, hood === n && styles.chipActive]}
                onPress={() => setHood(n)}
              >
                <Text style={[styles.chipText, hood === n && styles.chipTextActive]}>{n}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <FlatList
            data={filteredSpots}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.spotRow} onPress={() => router.push(`/spot/${item.id}`)}>
                <Image source={{ uri: item.thumbnail }} style={styles.spotThumb} resizeMode="cover" />
                <View style={styles.spotInfo}>
                  <Text style={styles.spotName}>{item.name}</Text>
                  <Text style={styles.spotMeta}>{item.neighborhood} · {item.type}</Text>
                  <View style={styles.spotStats}>
                    <Text style={[styles.skillLabel, { color: SKILL_COLORS[item.skillLevel] }]}>
                      ● {item.skillLevel}
                    </Text>
                    <Text style={styles.statText}>⭐ {item.rating}</Text>
                    <Text style={styles.statText}>🎥 {item.clipCount}</Text>
                  </View>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No spots found 🤷</Text>
              </View>
            }
          />
        </>
      )}

      {tab === 'skaters' && (
        <FlatList
          data={filteredSkaters}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.skaterRow} onPress={() => router.push(`/skater/${item.id}`)}>
              <Image source={{ uri: item.avatar }} style={styles.skaterAvatar} />
              <View style={styles.skaterInfo}>
                <Text style={styles.skaterName}>{item.displayName}</Text>
                <Text style={styles.skaterHandle}>@{item.username}</Text>
                <Text style={styles.skaterMeta}>{item.location}</Text>
              </View>
              <View style={styles.skaterRight}>
                <Text style={[styles.skillBadge, { color: SKILL_COLORS[item.skillLevel] }]}>
                  {item.skillLevel.toUpperCase()}
                </Text>
                <Text style={styles.followerCount}>{item.followers.toLocaleString()} followers</Text>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No skaters found 🤷</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  title: { fontSize: 22, fontWeight: '900', color: Colors.text },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    marginHorizontal: Spacing.md,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  searchIcon: { fontSize: 16, marginRight: 6 },
  searchInput: { flex: 1, height: 44, color: Colors.text, fontSize: 15 },
  clearBtn: { fontSize: 14, color: Colors.textSecondary, padding: 4 },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    padding: 3,
    marginBottom: Spacing.sm,
  },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: Radius.sm },
  tabActive: { backgroundColor: Colors.accent },
  tabText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },
  tabTextActive: { color: Colors.background },
  filters: { paddingHorizontal: Spacing.md, marginBottom: Spacing.xs },
  neighborhoods: { paddingHorizontal: Spacing.md, marginBottom: Spacing.sm },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: Colors.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  chipText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  chipTextActive: { color: Colors.background },
  spotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  spotThumb: { width: 72, height: 56, borderRadius: Radius.sm, backgroundColor: Colors.card },
  spotInfo: { flex: 1 },
  spotName: { fontSize: 14, fontWeight: '700', color: Colors.text },
  spotMeta: { fontSize: 12, color: Colors.textSecondary, marginTop: 2, textTransform: 'capitalize' },
  spotStats: { flexDirection: 'row', gap: 10, marginTop: 4 },
  skillLabel: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
  statText: { fontSize: 11, color: Colors.textSecondary },
  chevron: { fontSize: 20, color: Colors.textMuted },
  skaterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  skaterAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.card },
  skaterInfo: { flex: 1 },
  skaterName: { fontSize: 14, fontWeight: '700', color: Colors.text },
  skaterHandle: { fontSize: 12, color: Colors.accent },
  skaterMeta: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  skaterRight: { alignItems: 'flex-end', gap: 4 },
  skillBadge: { fontSize: 10, fontWeight: '800' },
  followerCount: { fontSize: 10, color: Colors.textSecondary },
  separator: { height: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.md },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 15, color: Colors.textSecondary },
});
