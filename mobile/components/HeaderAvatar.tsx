import { Pressable, View, Text, Image, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DrawerActions, useNavigation } from '@react-navigation/native';

import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';

export function HeaderAvatar() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { user, isAuthenticated } = useAuth();
  const navigation = useNavigation();

  const openDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  if (!isAuthenticated) {
    return (
      <Pressable onPress={openDrawer} style={styles.container} hitSlop={8}>
        <FontAwesome name="user-circle-o" size={28} color={colors.textSecondary} />
      </Pressable>
    );
  }

  if (user?.photoURL) {
    return (
      <Pressable onPress={openDrawer} style={styles.container} hitSlop={8}>
        <Image source={{ uri: user.photoURL }} style={styles.avatarImage} />
      </Pressable>
    );
  }

  const initial =
    user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?';

  return (
    <Pressable onPress={openDrawer} style={styles.container} hitSlop={8}>
      <View style={[styles.avatarCircle, { backgroundColor: colors.buttonBackground }]}>
        <Text style={[styles.avatarText, { color: colors.buttonText }]}>{initial}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {},
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
