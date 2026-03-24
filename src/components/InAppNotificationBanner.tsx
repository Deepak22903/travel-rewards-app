/**
 * InAppNotificationBanner
 * Slide-down animated banner for foreground push notifications
 * All text content is now configurable via gameConfig.ts
 */

import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, colors, spacing, typography } from '../core/constants/theme';
import { TEXT_CONFIG } from '../core/constants/gameConfig';

// ─── Constants ───────────────────────────────────────────────────────────────

const AUTO_DISMISS_MS = 4_000;
const SLIDE_DURATION_MS = 350;
/** How far above the viewport the banner rests when hidden. */
const HIDDEN_OFFSET = -200;

// ─── Public handle type ───────────────────────────────────────────────────────

export interface InAppNotificationBannerHandle {
  /**
   * Slide the banner into view.
   * @param title   Notification title – falls back to a generic string when blank.
   * @param body    Notification body text (optional).
   * @param onPress Called when the user taps "View Rewards"; also dismisses
   *                the banner and cancels the auto-dismiss timer.
   */
  show: (title: string, body: string, onPress?: () => void) => void;
}

// ─── Internal state type ─────────────────────────────────────────────────────

interface BannerContent {
  title: string;
  body: string;
  onPress?: () => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export const InAppNotificationBanner = forwardRef<InAppNotificationBannerHandle>(
  (_, ref) => {
    const insets = useSafeAreaInsets();

    // Single Animated.Value for the vertical slide; initialised off-screen.
    const translateY = useRef(new Animated.Value(HIDDEN_OFFSET)).current;
    const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [content, setContent] = useState<BannerContent | null>(null);

    // ── slide out ────────────────────────────────────────────────────────────
    const slideOut = useCallback(() => {
      if (dismissTimer.current) {
        clearTimeout(dismissTimer.current);
        dismissTimer.current = null;
      }
      Animated.timing(translateY, {
        toValue: HIDDEN_OFFSET,
        duration: SLIDE_DURATION_MS,
        useNativeDriver: true,
      }).start(() => setContent(null));
    }, [translateY]);

    // ── show (exposed via ref) ───────────────────────────────────────────────
    const show = useCallback(
      (title: string, body: string, onPress?: () => void) => {
        // Cancel any pending auto-dismiss from a previous banner.
        if (dismissTimer.current) {
          clearTimeout(dismissTimer.current);
          dismissTimer.current = null;
        }

        // Snap to hidden position so rapid successive calls always slide from
        // the top rather than continuing from mid-animation.
        translateY.setValue(HIDDEN_OFFSET);

        // FCM data-only messages may have no title/body — provide a fallback.
        setContent({
          title: title?.trim() || TEXT_CONFIG.inAppNotification.defaultTitle,
          body: body?.trim() || '',
          onPress,
        });

        Animated.timing(translateY, {
          toValue: 0,
          duration: SLIDE_DURATION_MS,
          useNativeDriver: true,
        }).start(() => {
          // Schedule auto-dismiss; cancelled if the user taps "View Rewards".
          dismissTimer.current = setTimeout(slideOut, AUTO_DISMISS_MS);
        });
      },
      [translateY, slideOut],
    );

    useImperativeHandle(ref, () => ({ show }), [show]);

    // ── "View Rewards" press ─────────────────────────────────────────────────
    // Cancel the auto-dismiss timer and run the caller-supplied action.
    const handleActionPress = useCallback(() => {
      slideOut();
      content?.onPress?.();
    }, [slideOut, content]);

    // ── render ───────────────────────────────────────────────────────────────
    // The Animated.View stays mounted so translateY is never reset between
    // notifications. pointerEvents='none' while hidden prevents it from
    // inadvertently blocking touches when translated off-screen.
    return (
      <Animated.View
        style={[
          styles.container,
          {
            // Sit just below the status bar, consistent with safe-area gap used
            // across all other screens.
            top: insets.top + spacing.sm,
            transform: [{ translateY }],
          },
        ]}
        pointerEvents={content ? 'box-none' : 'none'}
      >
        {content && (
          <View style={styles.card}>
            {/* Text area */}
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {content.title}
              </Text>
              {!!content.body && (
                <Text style={styles.body} numberOfLines={2}>
                  {content.body}
                </Text>
              )}
            </View>

            {/* "View Rewards" CTA — only rendered when an onPress was supplied */}
            {content.onPress && (
              <TouchableOpacity
                style={styles.actionButton}
                onPress={handleActionPress}
                activeOpacity={0.8}
              >
                <Text style={styles.actionText}>{TEXT_CONFIG.inAppNotification.viewRewardsButton}</Text>
              </TouchableOpacity>
            )}

            {/* ✕ dismiss button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={slideOut}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.closeIcon}>{TEXT_CONFIG.inAppNotification.closeButton}</Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    );
  },
);

InAppNotificationBanner.displayName = 'InAppNotificationBanner';

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    zIndex: 9999,
    // Android: elevation must exceed that of any other view in the hierarchy.
    // iOS: shadow properties handle the drop-shadow.
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 9999,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    // Accent left-border matches the brand orange used elsewhere in the app.
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  body: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  actionButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  actionText: {
    fontSize: typography.sizes.xs,
    fontWeight: '600',
    color: colors.white,
  },
  closeButton: {
    padding: spacing.xs,
  },
  closeIcon: {
    fontSize: typography.sizes.xs,
    color: colors.textLight,
    fontWeight: '700',
  },
});
