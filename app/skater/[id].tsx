import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Colors, Spacing, Radius } from '../../constants/theme';
import { MOCK_SKATERS, MOCK_FEED, MOCK_SPOTS, SkillLevel } from '../../constants/mockData';

const SKILL_COLORS: Record<SkillLevel, string> = {
  beginner: '#34C759',
  intermediate: '#FFD60A',
  advanced: '#FF6B00',
  pro: '#FF3B30',
};

export default function SkaterProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const skater = MOCK_SKATERS.find(s => s.id === id);
  const [following, setFollowing] = useState(skater?.isFollowing ?? false);

  if (!skater) return (
    <SafeAreaView style={styles.container}>
      <Text style={{ color: Colors.text, padding: 20 }}>Skater not found</Text>
    </SafeAreaView>
  );

  const posts = MOCK_FEED.filter(p => p.skater.id === id);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Nav */}
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.navTitle}>@{skater.username}</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Profile */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: skater.avatar }} style={styles.avatar} />
            <View style={[styles.skillRing, { borderColor: SKILL_COLORS[skater.skillLevel] }]} />
          </View>
          <Text style={styles.displayName}>{skater.displayName}</Text>
          <Text style={styles.username}>@{skater.username}</Text>
          <Text style={styles.bio}>{skater.bio}</Text>
          <Text style={styles.location}>📍 {skater.location}</Text>
          <View style={[styles.skillBadge, { backgroundColor: SKILL_COLORS[skater.skillLevel] + '22', borderColor: SKILL_COLORS[skater.skillLevel] }]}>
            <Text style={[styles.skillText, { color: SKILL_COLORS[skater.skillLevel] }]}>
              {skater.skillLevel.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{skater.followers.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{skater.following.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{skater.spotsAdded}</Text>
            <Text style={styles.statLabel}>Spots</Text>
          </View>
        </View>

        {/* Follow / Message */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.followBtn, following && styles.followingBtn]}
            onPress={() => setFollowing(!following)}
          >
            <Text style={[styles.followText, following && styles.followingText]}>
              {following ? 'Following ✓' : 'Follow'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.msgBtn}>
            <Text style={styles.msgText}>💬 Message</Text>
          </TouchableOpacity>
        </View>

        {/* Clips */}
        {posts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Clips</Text>
            <View style={styles.clipsGrid}>
              {posts.map(post => (
                <TouchableOpacity
                  key={post.id}
                  style={styles.clipThumb}
                  onPress={() => router.push(`/spot/${post.spot.id}`)}
                >
                  <Image source={{ uri: post.thumbnail }} style={styles.clipImage} resizeMode="cover" />
                  <View style={styles.clipOverlay}>
                    {post.trick && <Text style={styles.clipTrick}>{post.trick}</Text>}
                    <Text style={styles.clipLikes}>❤️ {post.likes.toLocaleString()}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Spots added */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spots Added</Text>
          {MOCK_SPOTS.filter(s => s.addedBy.id === id).map(spot => (
            <TouchableOpacity
              key={spot.id}
              style={styles.spotRow}
              onPress={() => router.push(`/spot/${spot.id}`)}
            >
              <Image source={{ uri: spot.thumbnail }} style={styles.spotThumb} resizeMode="cover" />
              <View style={styles.spotInfo}>
                <Text style={styles.spotName}>{spot.name}</Text>
                <Text style={styles.spotMeta}>{spot.neighborhood} · ⭐ {spot.rating}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
          {MOCK_SPOTS.filter(s => s.addedBy.id === id).length === 0 && (
            <Text style={styles.noSpots}>No spots added yet</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  nav: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
  },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backIcon: { fontSize: 28, color: Colors.text },
  navTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  profileSection: { alignItems: 'center', paddingVertical: Spacing.md, paddingHorizontal: Spacing.md },
  avatarWrap: { position: 'relative', marginBottom: Spacing.sm },
  avatar: { width: 86, height: 86, borderRadius: 43, backgroundColor: Colors.card },
  skillRing: {
    position: 'absolute', top: -3, left: -3, right: -3, bottom: -3,
    borderRadius: 46, borderWidth: 3,
  },
  displayName: { fontSize: 20, fontWeight: '900', color: Colors.text, marginBottom: 2 },
  username: { fontSize: 13, color: Colors.accent, marginBottom: 6 },
  bio: { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', marginBottom: 4 },
  location: { fontSize: 12, color: Colors.textMuted, marginBottom: 8 },
  skillBadge: {
    paddingHorizontal: 12, paddingVertical: 3,
    borderRadius: Radius.full, borderWidth: 1,
  },
  skillText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-around',
    paddingVertical: Spacing.md,
    borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 18, fontWeight: '900', color: Colors.text },
  statLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.border },
  actions: {
    flexDirection: 'row', gap: Spacing.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
  },
  followBtn: {
    flex: 1, paddingVertical: 11, backgroundColor: Colors.accent,
    borderRadius: Radius.md, alignItems: 'center',
  },
  followingBtn: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border },
  followText: { fontSize: 14, fontWeight: '800', color: Colors.background },
  followingText: { color: Colors.text },
  msgBtn: {
    paddingHorizontal: 18, paddingVertical: 11,
    backgroundColor: Colors.card, borderRadius: Radius.md,
    alignItems: 'center', borderWidth: 1, borderColor: Colors.border,
  },
  msgText: { fontSize: 14, fontWeight: '700', color: Colors.text },
  section: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg },
  sectionTitle: { fontSize: 15, fontWeight: '800', color: Colors.text, marginBottom: Spacing.sm },
  clipsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
  clipThumb: { width: '32%', aspectRatio: 1, borderRadius: Radius.sm, overflow: 'hidden' },
  clipImage: { width: '100%', height: '100%' },
  clipOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', padding: 5,
  },
  clipTrick: { fontSize: 9, color: Colors.accent, fontWeight: '700' },
  clipLikes: { fontSize: 10, color: Colors.text, fontWeight: '600' },
  spotRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: Spacing.sm, gap: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  spotThumb: { width: 58, height: 44, borderRadius: Radius.sm, backgroundColor: Colors.card },
  spotInfo: { flex: 1 },
  spotName: { fontSize: 13, fontWeight: '700', color: Colors.text },
  spotMeta: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  chevron: { fontSize: 20, color: Colors.textMuted },
  noSpots: { fontSize: 13, color: Colors.textSecondary, paddingVertical: Spacing.md },
});
