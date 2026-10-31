import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

export type EffortKey = 'none' | 'low' | 'medium' | 'high' | 'max' | 'ultra';

export const EFFORT_LEVELS: { key: EffortKey; label: string; progress: number }[] = [
  { key: 'none', label: '轻度', progress: 0 },
  { key: 'low', label: '中', progress: 0.2 },
  { key: 'medium', label: '高', progress: 0.4 },
  { key: 'high', label: '极高', progress: 0.6 },
  { key: 'max', label: '最高', progress: 0.8 },
  { key: 'ultra', label: 'Ultra', progress: 1 },
];

const SPARKS = [
  { left: '12%', top: '62%', size: 3 },
  { left: '22%', top: '34%', size: 2 },
  { left: '33%', top: '58%', size: 4 },
  { left: '44%', top: '28%', size: 2 },
  { left: '52%', top: '64%', size: 3 },
  { left: '61%', top: '40%', size: 2 },
  { left: '70%', top: '60%', size: 3 },
  { left: '78%', top: '32%', size: 2 },
  { left: '86%', top: '56%', size: 4 },
  { left: '91%', top: '38%', size: 2 },
];

const TRACK_HEIGHT = 48;
const THUMB = 44;

export function EffortCard({
  level = 'medium',
  modelName = 'DeepSeek V3.2',
  fastMode = false,
  onChange,
  onCycle,
  onFastToggle,
  onOpen,
}: {
  level?: EffortKey;
  modelName?: string;
  fastMode?: boolean;
  onChange?: (next: EffortKey) => void;
  onCycle?: () => void;
  onFastToggle?: () => void;
  onOpen?: () => void;
}) {
  const index = useMemo(
    () => Math.max(0, EFFORT_LEVELS.findIndex((item) => item.key === level)),
    [level],
  );
  const current = EFFORT_LEVELS[index] ?? EFFORT_LEVELS[0];
  const isUltra = current.key === 'ultra';
  const fill = Math.max(current.progress, 0.02);

  const select = useCallback(
    (next: number) => {
      const clamped = Math.min(Math.max(next, 0), EFFORT_LEVELS.length - 1);
      onChange?.(EFFORT_LEVELS[clamped].key);
    },
    [onChange],
  );

  return (
    <View className="rounded-[26px] border border-white/12 bg-[#1c1c1e] px-4 pb-4 pt-3">
      <View className="flex-row items-center justify-between">
        <Pressable
          accessibilityLabel="Fast mode"
          onPress={onFastToggle}
          hitSlop={10}
          className="size-9 items-center justify-center rounded-full"
        >
          <Text className={fastMode ? 'text-[20px] text-[#0A84FF]' : 'text-[20px] text-white/70'}>
            {'\u26A1'}
          </Text>
        </Pressable>

        <View className="items-center">
          <Pressable accessibilityLabel="Effort level" onPress={onOpen} hitSlop={8} className="flex-row items-center">
            <Text className="text-[17px] font-semibold text-[#0A84FF]">{current.label}</Text>
            <Text className="ml-1 text-[15px] text-[#0A84FF]">{'\u203A'}</Text>
          </Pressable>
          <Text className="mt-0.5 text-[13px] text-white/60">{modelName}</Text>
        </View>

        <Pressable
          accessibilityLabel="Cycle effort"
          onPress={onCycle ?? (() => select(index + 1))}
          hitSlop={10}
          className="size-9 items-center justify-center rounded-full"
        >
          <Text className="text-[18px] text-white/70">{'\u21BB'}</Text>
        </Pressable>
      </View>

      <View className="mt-3 overflow-hidden rounded-full bg-[#2c2c2e]" style={{ height: TRACK_HEIGHT }}>
        {isUltra ? (
          <LinearGradient
            colors={['#3B5BFF', '#6B4BFF', '#A24BFF']}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
            style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fill * 100}%` }}
          />
        ) : (
          <View
            className="bg-[#0A84FF]"
            style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${fill * 100}%`, opacity: fill > 0.02 ? 1 : 0 }}
          />
        )}

        {isUltra
          ? SPARKS.map((spark, sparkIndex) => (
              <View
                key={`spark-${sparkIndex}`}
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  left: spark.left as unknown as number,
                  top: spark.top as unknown as number,
                  width: spark.size,
                  height: spark.size,
                  borderRadius: spark.size,
                  backgroundColor: 'rgba(255,255,255,0.85)',
                }}
              />
            ))
          : null}

        {EFFORT_LEVELS.map((item, itemIndex) => {
          if (itemIndex === 0 || itemIndex === EFFORT_LEVELS.length - 1) return null;
          return (
            <View
              key={item.key}
              pointerEvents="none"
              style={{
                position: 'absolute',
                left: `${(item.progress * 100)}%`,
                top: TRACK_HEIGHT / 2 - 2,
                width: 4,
                height: 4,
                marginLeft: -2,
                borderRadius: 2,
                backgroundColor: item.progress <= current.progress ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)',
              }}
            />
          );
        })}

        {EFFORT_LEVELS.map((item, itemIndex) => (
          <Pressable
            key={`hit-${item.key}`}
            accessibilityLabel={item.label}
            onPress={() => select(itemIndex)}
            style={{
              position: 'absolute',
              left: `${(item.progress * 100)}%`,
              top: 0,
              bottom: 0,
              width: 48,
              marginLeft: -24,
            }}
          />
        ))}

        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: `${(current.progress * 100)}%`,
            top: (TRACK_HEIGHT - THUMB) / 2,
            width: THUMB,
            height: THUMB,
            marginLeft: -THUMB / 2,
            borderRadius: THUMB / 2,
            backgroundColor: '#FFFFFF',
          }}
        />
      </View>
    </View>
  );
}
