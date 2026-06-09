import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius } from '../../constants/theme';
import { MOCK_FEED, MOCK_SPOTS, FeedPost, SkillLevel } from '../../constants/mockData';
import { useState } from 'react';

const SKILL_FILTERS: { label: string; value: SkillLevel | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: '🟢 Beginner', value: 'beginner' },
  { label: '🟡 Intermediate', value: 'intermediate' },
  { label: '🔴 Advanced', value: 'advanced' },
  { label: '⚡ Pro', value: 'pro' },
];

function SkillBadge({ level }: { level: SkillLevel }) {
  const colors: Record<SkillLevel, string> = {
    beginner: '#34C759',
    intermediate: '#FFD60A',
    advanced: '#FF6B00',
    pro: '#FF3B30',
  };
  return (
    <View style={[styles.badge, { backgroundColor: colors[level] + '22', borderColor: colors[level] }]}>
      <Text style={[styles.badgeText, { color: colors[level] }]}>{level.toUpperCase()}</Text>
    </View>
  );
}

function FeedCard({ post }: { post: FeedPost }) {
  const router = useRouter();
  const [liked, setLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likes);

  return (
    <View style={styles.card}>
      {/* Header */}
      <TouchableOpacity
        style={styles.cardHeader}
        onPress={() => router.push(`/skater/${post.skater.id}`)}
      >
        <Image source={{ uri: post.skater.avatar }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.username}>@{post.skater.username}</Text>
          <Text style={styles.timestamp}>{post.timestamp} · {post.spot.neighborhood}</Text>
        </View>
        <SkillBadge level={post.skater.skillLevel} />
      </TouchableOpacity>

      {/* Media */}
      <TouchableOpacity onPress={() => router.push(`/spot/${post.spot.id}`)}>
        <Image source={{ uri: post.thumbnail }} style={styles.media} resizeMode="cover" />
        {post.trick && (
          <View style={styles.trickTag}>
            <Text style={styles.trickText}>🛹 {post.trick}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Spot Tag */}
      <TouchableOpacity
        style={styles.spotTag}
        onPress={() => router.push(`/spot/${post.spot.id}`)}
      >
        <Text style={styles.spotTagText}>📍 {post.spot.name}</Text>
      </TouchableOpacity>

      {/* Caption */}
      <Text style={styles.caption}>{post.caption}</Text>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.action}
          onPress={() => {
            setLiked(!liked);
            setLikeCount(liked ? likeCount - 1 : likeCount + 1);
          }}
        >
          <Text style={styles.actionIcon}>{liked ? '❤️' : '🤍'}</Text>
          <Text style={styles.actionCount}>{likeCount.toLocaleString()}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action}>
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionCount}>{post.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.action}>
          <Text style={styles.actionIcon}>↗️</Text>
          <Text style={styles.actionCount}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function TrendingSpot({ spot }: { spot: typeof MOCK_SPOTS[0] }) {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.trendingCard} onPress={() => router.push(`/spot/${spot.id}`)}>
      <Image source={{ uri: spot.thumbnail }} style={styles.trendingImage} resizeMode="cover" />
      <View style={styles.trendingOverlay}>
        <Text style={styles.trendingName} numberOfLines={1}>{spot.name}</Text>
        <Text style={styles.trendingMeta}>🔥 {spot.checkedInNow} now</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function FeedScreen() {
  const [filter, setFilter] = useState<SkillLevel | 'all'>('all');

  const filtered = MOCK_FEED.filter(p =>
    filter === 'all' ? true : p.spot.skillLevel === filter || p.skater.skillLevel === filter
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>L8nes</Text>
        <Text style={styles.logoSub}>LA 🛹</Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* Trending spots */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🔥 Trending Near You</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
                {MOCK_SPOTS.map(s => <TrendingSpot key={s.id} spot={s} />)}
              </ScrollView>
            </View>

            {/* Skill filter */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
              {SKILL_FILTERS.map(f => (
                <TouchableOpacity
                  key={f.value}
                  style={[styles.filterChip, filter === f.value && styles.filterChipActive]}
                  onPress={() => setFilter(f.value)}
                >
                  <Text style={[styles.filterText, filter === f.value && styles.filterTextActive]}>
                    {f.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        }
        renderItem={({ item }) => <FeedCard post={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: Colors.border }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 6,
  },
  logo: { fontSize: 28, fontWeight: '900', color: Colors.accent, letterSpacing: -1 },
  logoSub: { fontSize: 14, color: Colors.textSecondary },
  section: { paddingHorizontal: Spacing.md, paddingTop: Spacing.md },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  trendingCard: {
    width: 140,
    height: 90,
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginRight: Spacing.sm,
  },
  trendingImage: { width: '100%', height: '100%' },
  trendingOverlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
  },
  trendingName: { fontSize: 11, fontWeight: '700', color: Colors.text },
  trendingMeta: { fontSize: 10, color: Colors.accent },
  filters: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Colors.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterChipActive: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filterText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  filterTextActive: { color: Colors.background },
  card: { backgroundColor: Colors.background, paddingBottom: Spacing.md },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: Colors.card },
  username: { fontSize: 14, fontWeight: '700', color: Colors.text },
  timestamp: { fontSize: 12, color: Colors.textSecondary },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radius.full,
    borderWidth: 1,
  },
  badgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  media: { width: '100%', height: 360, backgroundColor: Colors.card },
  trickTag: {
    position: 'absolute',
    bottom: 12, left: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  trickText: { fontSize: 12, color: Colors.text, fontWeight: '600' },
  spotTag: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
  },
  spotTagText: { fontSize: 13, color: Colors.accent, fontWeight: '600' },
  caption: {
    marginHorizontal: Spacing.md,
    marginTop: 4,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    gap: Spacing.lg,
  },
  action: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionIcon: { fontSize: 18 },
  actionCount: { fontSize: 13, color: Colors.textSecondary, fontWeight: '600' },
});
