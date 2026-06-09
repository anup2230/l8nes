import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '../../constants/theme';
import { MOCK_SKATERS, MOCK_SPOTS, MOCK_FEED, SkillLevel } from '../../constants/mockData';

const ME = MOCK_SKATERS[0]; // Jake Torres as the logged-in user

const SKILL_COLORS: Record<SkillLevel, string> = {
  beginner: '#34C759',
  intermediate: '#FFD60A',
  advanced: '#FF6B00',
  pro: '#FF3B30',
};

function StatBlock({ value, label }: { value: string | number; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{typeof value === 'number' ? value.toLocaleString() : value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const myPosts = MOCK_FEED.filter(p => p.skater.id === ME.id);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity style={styles.settingsBtn}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar + info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: ME.avatar }} style={styles.avatar} />
            <View style={[styles.skillRing, { borderColor: SKILL_COLORS[ME.skillLevel] }]} />
          </View>
          <Text style={styles.displayName}>{ME.displayName}</Text>
          <Text style={styles.username}>@{ME.username}</Text>
          <Text style={styles.bio}>{ME.bio}</Text>
          <Text style={styles.location}>📍 {ME.location}</Text>

          {/* Skill badge */}
          <View style={[styles.skillBadge, { backgroundColor: SKILL_COLORS[ME.skillLevel] + '22', borderColor: SKILL_COLORS[ME.skillLevel] }]}>
            <Text style={[styles.skillBadgeText, { color: SKILL_COLORS[ME.skillLevel] }]}>
              {ME.skillLevel.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatBlock value={ME.followers} label="Followers" />
          <View style={styles.statDivider} />
          <StatBlock value={ME.following} label="Following" />
          <View style={styles.statDivider} />
          <StatBlock value={ME.spotsAdded} label="Spots" />
          <View style={styles.statDivider} />
          <StatBlock value={myPosts.length} label="Clips" />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareBtn}>
            <Text style={styles.shareBtnText}>↗️</Text>
          </TouchableOpacity>
        </View>

        {/* My Clips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Clips</Text>
          {myPosts.length === 0 ? (
            <View style={styles.emptyClips}>
              <Text style={styles.emptyText}>No clips yet. Go skate! 🛹</Text>
            </View>
          ) : (
            <View style={styles.clipsGrid}>
              {myPosts.map(post => (
                <TouchableOpacity
                  key={post.id}
                  style={styles.clipThumb}
                  onPress={() => router.push(`/spot/${post.spot.id}`)}
                >
                  <Image source={{ uri: post.thumbnail }} style={styles.clipImage} resizeMode="cover" />
                  <View style={styles.clipOverlay}>
                    <Text style={styles.clipLikes}>❤️ {post.likes}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Favorite Spots */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Favorite Spots</Text>
          {MOCK_SPOTS.slice(0, 3).map(spot => (
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  title: { fontSize: 22, fontWeight: '900', color: Colors.text },
  settingsBtn: { padding: 4 },
  settingsIcon: { fontSize: 20 },
  profileSection: { alignItems: 'center', paddingVertical: Spacing.lg, paddingHorizontal: Spacing.md },
  avatarWrap: { position: 'relative', marginBottom: Spacing.sm },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: Colors.card },
  skillRing: {
    position: 'absolute', top: -3, left: -3, right: -3, bottom: -3,
    borderRadius: 48, borderWidth: 3,
  },
  displayName: { fontSize: 22, fontWeight: '900', color: Colors.text, marginBottom: 2 },
  username: { fontSize: 14, color: Colors.accent, marginBottom: Spacing.sm },
  bio: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: 4 },
  location: { fontSize: 12, color: Colors.textMuted, marginBottom: Spacing.sm },
  skillBadge: {
    paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: Radius.full, borderWidth: 1, marginTop: 4,
  },
  skillBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { fontSize: 20, fontWeight: '900', color: Colors.text },
  statLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: Colors.border },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  editBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  editBtnText: { fontSize: 14, fontWeight: '700', color: Colors.text },
  shareBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  shareBtnText: { fontSize: 16 },
  section: { paddingHorizontal: Spacing.md, paddingTop: Spacing.lg },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: Spacing.sm },
  clipsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 3 },
  clipThumb: { width: '32%', aspectRatio: 1, borderRadius: Radius.sm, overflow: 'hidden' },
  clipImage: { width: '100%', height: '100%' },
  clipOverlay: {
    position: 'absolute', bottom: 4, left: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6,
  },
  clipLikes: { fontSize: 10, color: Colors.text, fontWeight: '700' },
  emptyClips: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { fontSize: 14, color: Colors.textSecondary },
  spotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  spotThumb: { width: 60, height: 46, borderRadius: Radius.sm, backgroundColor: Colors.card },
  spotInfo: { flex: 1 },
  spotName: { fontSize: 13, fontWeight: '700', color: Colors.text },
  spotMeta: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  chevron: { fontSize: 20, color: Colors.textMuted },
});
