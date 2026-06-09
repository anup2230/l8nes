import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '../../constants/theme';
import { MOCK_SPOTS, MOCK_FEED, SkillLevel } from '../../constants/mockData';

const SKILL_COLORS: Record<SkillLevel, string> = {
  beginner: '#34C759',
  intermediate: '#FFD60A',
  advanced: '#FF6B00',
  pro: '#FF3B30',
};

const SECURITY_LABELS = { none: '✅ No security', low: '⚠️ Low risk', medium: '🟠 Medium risk', high: '🔴 High risk' };
const SURFACE_LABELS = { smooth: '🟢 Smooth', rough: '🔴 Rough', mixed: '🟡 Mixed' };

export default function SpotDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const spot = MOCK_SPOTS.find(s => s.id === id);
  const clips = MOCK_FEED.filter(p => p.spot.id === id);

  if (!spot) return (
    <SafeAreaView style={styles.container}>
      <Text style={{ color: Colors.text, padding: 20 }}>Spot not found</Text>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Image source={{ uri: spot.thumbnail }} style={styles.heroImage} resizeMode="cover" />
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          {spot.checkedInNow > 0 && (
            <View style={styles.liveTag}>
              <Text style={styles.liveText}>🔴 {spot.checkedInNow} skating now</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          {/* Title */}
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.spotName}>{spot.name}</Text>
              <Text style={styles.neighborhood}>📍 {spot.neighborhood}, LA</Text>
            </View>
            <View style={[styles.ratingBadge]}>
              <Text style={styles.ratingText}>⭐ {spot.rating}</Text>
            </View>
          </View>

          {/* Tags */}
          <View style={styles.tagsRow}>
            <View style={[styles.tag, { backgroundColor: SKILL_COLORS[spot.skillLevel] + '22', borderColor: SKILL_COLORS[spot.skillLevel] }]}>
              <Text style={[styles.tagText, { color: SKILL_COLORS[spot.skillLevel] }]}>{spot.skillLevel.toUpperCase()}</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{spot.type.toUpperCase()}</Text>
            </View>
            {spot.tags.slice(0, 3).map(t => (
              <View key={t} style={styles.tag}>
                <Text style={styles.tagText}>#{t}</Text>
              </View>
            ))}
          </View>

          {/* Description */}
          <Text style={styles.description}>{spot.description}</Text>

          {/* Stats */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{spot.clipCount}</Text>
              <Text style={styles.statLabel}>Clips</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{spot.skaterCount}</Text>
              <Text style={styles.statLabel}>Skaters</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{spot.checkedInNow}</Text>
              <Text style={styles.statLabel}>Now</Text>
            </View>
          </View>

          {/* Info cards */}
          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Security</Text>
              <Text style={styles.infoValue}>{SECURITY_LABELS[spot.security]}</Text>
            </View>
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>Surface</Text>
              <Text style={styles.infoValue}>{SURFACE_LABELS[spot.surface]}</Text>
            </View>
          </View>

          {/* Added by */}
          <TouchableOpacity
            style={styles.addedBy}
            onPress={() => router.push(`/skater/${spot.addedBy.id}`)}
          >
            <Image source={{ uri: spot.addedBy.avatar }} style={styles.addedByAvatar} />
            <View>
              <Text style={styles.addedByLabel}>Added by</Text>
              <Text style={styles.addedByName}>@{spot.addedBy.username}</Text>
            </View>
          </TouchableOpacity>

          {/* Check in CTA */}
          <TouchableOpacity style={styles.checkInBtn}>
            <Text style={styles.checkInText}>🛹 I'm Skating Here</Text>
          </TouchableOpacity>

          {/* Clips at this spot */}
          {clips.length > 0 && (
            <View style={styles.clipsSection}>
              <Text style={styles.sectionTitle}>Clips at this spot</Text>
              {clips.map(clip => (
                <View key={clip.id} style={styles.clipRow}>
                  <Image source={{ uri: clip.skater.avatar }} style={styles.clipAvatar} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.clipUser}>@{clip.skater.username}</Text>
                    <Text style={styles.clipCaption} numberOfLines={1}>{clip.caption}</Text>
                    {clip.trick && <Text style={styles.clipTrick}>🛹 {clip.trick}</Text>}
                  </View>
                  <Text style={styles.clipLikes}>❤️ {clip.likes.toLocaleString()}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  hero: { position: 'relative' },
  heroImage: { width: '100%', height: 300, backgroundColor: Colors.card },
  backBtn: {
    position: 'absolute', top: 16, left: 16,
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  backIcon: { fontSize: 24, color: Colors.text, marginTop: -2 },
  liveTag: {
    position: 'absolute', bottom: 12, right: 12,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full,
  },
  liveText: { fontSize: 12, color: Colors.text, fontWeight: '700' },
  content: { padding: Spacing.md },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: Spacing.sm },
  spotName: { fontSize: 24, fontWeight: '900', color: Colors.text },
  neighborhood: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  ratingBadge: {
    backgroundColor: Colors.card,
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border,
  },
  ratingText: { fontSize: 14, fontWeight: '700', color: Colors.text },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: Spacing.sm },
  tag: {
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Colors.card,
    borderWidth: 1, borderColor: Colors.border,
  },
  tagText: { fontSize: 10, fontWeight: '700', color: Colors.textSecondary, letterSpacing: 0.3 },
  description: { fontSize: 14, color: Colors.textSecondary, lineHeight: 21, marginBottom: Spacing.md },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md },
  statValue: { fontSize: 22, fontWeight: '900', color: Colors.accent },
  statLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  infoRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  infoCard: {
    flex: 1, backgroundColor: Colors.card,
    borderRadius: Radius.md, padding: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  infoLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '700', marginBottom: 4 },
  infoValue: { fontSize: 12, color: Colors.text, fontWeight: '600' },
  addedBy: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.card, borderRadius: Radius.md,
    padding: Spacing.sm, marginBottom: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  addedByAvatar: { width: 36, height: 36, borderRadius: 18 },
  addedByLabel: { fontSize: 10, color: Colors.textMuted },
  addedByName: { fontSize: 13, fontWeight: '700', color: Colors.accent },
  checkInBtn: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  checkInText: { fontSize: 16, fontWeight: '900', color: Colors.background },
  clipsSection: { marginBottom: Spacing.xl },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.text, marginBottom: Spacing.sm },
  clipRow: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  clipAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.card },
  clipUser: { fontSize: 13, fontWeight: '700', color: Colors.text },
  clipCaption: { fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  clipTrick: { fontSize: 11, color: Colors.accent, marginTop: 2 },
  clipLikes: { fontSize: 12, color: Colors.textSecondary },
});
