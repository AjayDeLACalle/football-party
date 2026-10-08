import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, Platform, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

const ReducedMotion = createContext(false);
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let mounted = true;
    void AccessibilityInfo.isReduceMotionEnabled().then(value => { if (mounted) setReduced(value); });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    const media = Platform.OS === 'web' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    const update = () => setReduced(!!media?.matches);
    if (media) { update(); media.addEventListener('change', update); }
    return () => { mounted = false; subscription.remove(); media?.removeEventListener('change', update); };
  }, []);
  return <ReducedMotion.Provider value={reduced}>{children}</ReducedMotion.Provider>;
}
export function useReducedMotion() { return useContext(ReducedMotion); }
const AP = Animated.createAnimatedComponent(Pressable);
export function MotionPressable({ onPressIn, onPressOut, style, ...props }: PressableProps) {
  const [pressed, setPressed] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();
  function animate(toValue: number) {
    if (reduced) return;
    Animated.spring(scale, { toValue, speed: 35, bounciness: 3, useNativeDriver: true }).start();
  }
  return <AP {...props} onPressIn={event => { setPressed(true); animate(0.965); onPressIn?.(event); }} onPressOut={event => { setPressed(false); animate(1); onPressOut?.(event); }} style={[typeof style === 'function' ? style({ pressed }) : style, { transform: [{ scale }] }]} />;
}
export function Entrance({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const progress = useRef(new Animated.Value(0)).current;
  const reduced = useReducedMotion();
  useEffect(() => {
    Animated.timing(progress, { toValue: 1, duration: reduced ? 0 : 280, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
    return () => progress.stopAnimation();
  }, [progress, reduced]);
  return <Animated.View style={[style, { opacity: progress, transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [14, 0] }) }] }]}>{children}</Animated.View>;
}
