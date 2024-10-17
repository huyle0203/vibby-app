// import { useCallback, useMemo } from "react";
// import { Platform } from "react-native";
// import * as Haptics from 'expo-haptics';

// type FeedbackType =
//   | "light"
//   | "medium"
//   | "heavy"
//   | "selection"
//   | "success"
//   | "warning"
//   | "error";

// export const useHaptic = (feedbackType: FeedbackType = "selection") => {
//   const isSimulator = Platform.OS === 'ios' && !Platform.isPad && !Platform.isTV;

//   const createHapticHandler = useCallback(
//     (type: Haptics.ImpactFeedbackStyle) => {
//       return isSimulator ? () => {} : () => Haptics.impactAsync(type);
//     },
//     [isSimulator]
//   );

//   const createNotificationFeedback = useCallback(
//     (type: Haptics.NotificationFeedbackType) => {
//       return isSimulator ? () => {} : () => Haptics.notificationAsync(type);
//     },
//     [isSimulator]
//   );

//   const hapticHandlers = useMemo(
//     () => ({
//       light: createHapticHandler(Haptics.ImpactFeedbackStyle.Light),
//       medium: createHapticHandler(Haptics.ImpactFeedbackStyle.Medium),
//       heavy: createHapticHandler(Haptics.ImpactFeedbackStyle.Heavy),
//       selection: isSimulator ? () => {} : Haptics.selectionAsync,
//       success: createNotificationFeedback(Haptics.NotificationFeedbackType.Success),
//       warning: createNotificationFeedback(Haptics.NotificationFeedbackType.Warning),
//       error: createNotificationFeedback(Haptics.NotificationFeedbackType.Error),
//     }),
//     [createHapticHandler, createNotificationFeedback, isSimulator]
//   );

//   return hapticHandlers[feedbackType];
// };