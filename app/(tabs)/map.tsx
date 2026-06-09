import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Colors, Spacing, Radius } from '../../constants/theme';
import { MOCK_SPOTS, SpotType, SkillLevel, Spot } from '../../constants/mockData';

const SPOT_TYPE_FILTERS: { label: string; value: SpotType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: '🏟 Park', value: 'park' },
  { label: '🛤 Rail', value: 'rail' },
  { label: '📐 Ledge', value: 'ledge' },
  { label: '🚧 Gap', value: 'gap' },
  { label: '🪜 Stairs', value: 'stairs' },
];

const SKILL_COLORS: Record<SkillLevel, string> = {
  beginner: '#34C759',
  intermediate: '#FFD60A',
  advanced: '#FF6B00',
  pro: '#FF3B30',
};

function SpotPin({ spot, onPress }: { spot: Spot; onPress: () => void }) {
  return (
    <Marker
      coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
      onPress={onPress}
    >
      <View style={[styles.pin, { backgroundColor: SKILL_COLORS[spot.skillLevel] }]}>
        <Text style={styles.pinText}>🛹</Text>
      </View>
      <Callout tooltip>
        <View style={styles.callout}>
          <Text style={styles.calloutName}>{spot.name}</Text>
          <Text style={styles.calloutMeta}>{spot.checkedInNow} skating now</Text>
        </View>
      </Callout>
    </Marker>
  );
}

function SpotCard({ spot }: { spot: Spot }) {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.spotCard} onPress={() => router.push(`/spot/${spot.id}`)}>
      <Image source={{ uri: spot.thumbnail }} style={styles.spotCardImage} resizeMode="cover" />
      <View style={styles.spotCardInfo}>
        <Text style={styles.spotCardName} numberOfLines={1}>{spot.name}</Text>
        <Text style={styles.spotCardMeta}>{spot.neighborhood} · {spot.type}</Text>
        <View style={styles.spotCardFooter}>
          <Text style={[styles.skillDot, { color: SKILL_COLORS[spot.skillLevel] }]}>● {spot.skillLevel}</Text>
          {spot.checkedInNow > 0 && (
            <Text style={styles.liveNow}>🔴 {spot.checkedInNow} now</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function MapScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<SpotType | 'all'>('all');
  const [selectedSpot, setSelectedSpot] = useState<Spot | null>(null);

  const filtered = MOCK_SPOTS.filter(s => filter === 'all' || s.type === filter);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Spot Map</Text>
        <Text style={styles.subtitle}>LA 📍</Text>
      </View>

      {/* Type filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
        {SPOT_TYPE_FILTERS.map(f => (
          <TouchableOpacity
            key={f.value}
            style={[styles.chip, filter === f.value && styles.chipActive]}
            onPress={() => setFilter(f.value)}
          >
            <Text style={[styles.chipText, filter === f.value && styles.chipTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Legend */}
      <View style={styles.legend}>
        {Object.entries(SKILL_COLORS).map(([level, color]) => (
          <View key={level} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: color }]} />
            <Text style={styles.legendText}>{level}</Text>
          </View>
        ))}
      </View>

      {/* Map */}
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: 34.052,
          longitude: -118.35,
          latitudeDelta: 0.35,
          longitudeDelta: 0.35,
        }}
        userInterfaceStyle="dark"
        showsUserLocation
        showsMyLocationButton
      >
        {filtered.map(spot => (
          <SpotPin
            key={spot.id}
            spot={spot}
            onPress={() => setSelectedSpot(spot)}
          />
        ))}
      </MapView>

      {/* Bottom sheet: selected spot or spot list */}
      <View style={styles.bottomSheet}>
        <View style={styles.bottomHandle} />
        {selectedSpot ? (
          <View>
            <View style={styles.selectedHeader}>
              <Text style={styles.selectedTitle}>{selectedSpot.name}</Text>
              <TouchableOpacity onPress={() => setSelectedSpot(null)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>
            <SpotCard spot={selectedSpot} />
          </View>
        ) : (
          <>
            <Text style={styles.nearbyTitle}>Nearby Spots ({filtered.length})</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filtered.map(s => <SpotCard key={s.id} spot={s} />)}
            </ScrollView>
          </>
        )}
      </View>
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
    gap: 6,
  },
  title: { fontSize: 22, fontWeight: '900', color: Colors.text },
  subtitle: { fontSize: 14, color: Colors.textSecondary },
  filters: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm },
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
  legend: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 10, color: Colors.textSecondary, textTransform: 'capitalize' },
  map: { flex: 1 },
  pin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  pinText: { fontSize: 16 },
  callout: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.sm,
    padding: 8,
    minWidth: 120,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  calloutName: { fontSize: 13, fontWeight: '700', color: Colors.text },
  calloutMeta: { fontSize: 11, color: Colors.accent, marginTop: 2 },
  bottomSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: Spacing.md,
    paddingBottom: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  bottomHandle: {
    width: 36,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.sm,
  },
  nearbyTitle: { fontSize: 15, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm },
  selectedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  selectedTitle: { fontSize: 16, fontWeight: '800', color: Colors.text },
  closeBtn: { fontSize: 16, color: Colors.textSecondary },
  spotCard: {
    width: 200,
    backgroundColor: Colors.card,
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  spotCardImage: { width: '100%', height: 90 },
  spotCardInfo: { padding: 8 },
  spotCardName: { fontSize: 13, fontWeight: '700', color: Colors.text },
  spotCardMeta: { fontSize: 11, color: Colors.textSecondary, marginTop: 2, textTransform: 'capitalize' },
  spotCardFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  skillDot: { fontSize: 10, fontWeight: '700', textTransform: 'capitalize' },
  liveNow: { fontSize: 10, color: Colors.red, fontWeight: '600' },
});
