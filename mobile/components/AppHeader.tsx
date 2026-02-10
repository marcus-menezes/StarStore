import type React from 'react';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DrawerActions, useNavigation } from '@react-navigation/native';

import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';

interface AppHeaderProps {
  /** Title shown in the header. Defaults to "StarStore" */
  title?: string;
  /** Optional right-side content rendered between the title and avatar */
  rightContent?: React.ReactNode;
}

export function AppHeader({ title = 'StarStore', rightContent }: AppHeaderProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { user, isAuthenticated } = useAuth();
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const renderAvatar = () => {
    if (!isAuthenticated) {
      return (
        <Pressable onPress={openDrawer} style={styles.avatarButton} hitSlop={8}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.border }]}>
            <FontAwesome name="user" size={16} color={colors.textSecondary} />
          </View>
        </Pressable>
      );
    }

    if (user?.photoURL) {
      return (
        <Pressable onPress={openDrawer} style={styles.avatarButton} hitSlop={8}>
          <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
        </Pressable>
      );
    }

    const initial =
      user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?';

    return (
      <Pressable onPress={openDrawer} style={styles.avatarButton} hitSlop={8}>
        <View style={[styles.avatarCircle, { backgroundColor: colors.buttonBackground }]}>
          <Text style={[styles.avatarInitial, { color: colors.buttonText }]}>{initial}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.leftSection}>
        <Text
          style={[styles.logo, { color: colorScheme === 'dark' ? Colors.primary : colors.text }]}
        >
          {title}
        </Text>
      </View>

      <View style={styles.rightSection}>
        {rightContent}
        {renderAvatar()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatarButton: {},
  avatarImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 15,
    fontWeight: 'bold',
  },
});
