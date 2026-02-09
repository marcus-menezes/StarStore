import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { Link } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import Colors from '@/constants/Colors';
import { Spacing, BorderRadius } from '@/constants/Spacing';

export default function ProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];

  const { user, isAuthenticated, isLoading, signOut } = useAuth();

  if (!isAuthenticated) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.guestContainer}>
          <FontAwesome name="user-circle" size={80} color={colors.textSecondary} />
          <Text style={[styles.guestTitle, { color: colors.text }]}>
            Welcome to StarStore
          </Text>
          <Text style={[styles.guestSubtitle, { color: colors.textSecondary }]}>
            Sign in to access your account and track orders
          </Text>

          <Link href="/(auth)/login" asChild>
            <Pressable style={styles.signInButton}>
              <Text style={styles.signInButtonText}>Sign In</Text>
            </Pressable>
          </Link>

          <Link href="/(auth)/register" asChild>
            <Pressable style={[styles.registerButton, { borderColor: Colors.primary }]}>
              <Text style={[styles.registerButtonText, { color: Colors.primary }]}>
                Create Account
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.profileHeader, { backgroundColor: colors.surface }]}>
        {user?.photoURL ? (
          <Image source={{ uri: user.photoURL }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: Colors.primary }]}>
            <Text style={styles.avatarText}>
              {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <Text style={[styles.userName, { color: colors.text }]}>
          {user?.displayName || 'User'}
        </Text>
        <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
          {user?.email}
        </Text>
      </View>

      <View style={styles.menuSection}>
        <MenuItem
          icon="user"
          label="Edit Profile"
          colors={colors}
          onPress={() => {}}
        />
        <MenuItem
          icon="bell"
          label="Notifications"
          colors={colors}
          onPress={() => {}}
        />
        <MenuItem
          icon="cog"
          label="Settings"
          colors={colors}
          onPress={() => {}}
        />
        <MenuItem
          icon="question-circle"
          label="Help & Support"
          colors={colors}
          onPress={() => {}}
        />
      </View>

      <View style={styles.signOutContainer}>
        <Pressable
          style={[styles.signOutButton, { borderColor: colors.error }]}
          onPress={signOut}
          disabled={isLoading}>
          <FontAwesome name="sign-out" size={18} color={colors.error} />
          <Text style={[styles.signOutText, { color: colors.error }]}>
            {isLoading ? 'Signing out...' : 'Sign Out'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

interface MenuItemProps {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  colors: typeof Colors.light;
  onPress: () => void;
}

function MenuItem({ icon, label, colors, onPress }: MenuItemProps) {
  return (
    <Pressable
      style={[styles.menuItem, { backgroundColor: colors.surface }]}
      onPress={onPress}>
      <FontAwesome name={icon} size={20} color={colors.textSecondary} />
      <Text style={[styles.menuLabel, { color: colors.text }]}>{label}</Text>
      <FontAwesome name="chevron-right" size={14} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  guestTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: Spacing.lg,
  },
  guestSubtitle: {
    fontSize: 14,
    marginTop: Spacing.sm,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  signInButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    width: '100%',
    alignItems: 'center',
  },
  signInButtonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
  registerButton: {
    borderWidth: 2,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    width: '100%',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  registerButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: Spacing.md,
  },
  userEmail: {
    fontSize: 14,
    marginTop: Spacing.xs,
  },
  menuSection: {
    paddingHorizontal: Spacing.md,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  menuLabel: {
    flex: 1,
    marginLeft: Spacing.md,
    fontSize: 16,
  },
  signOutContainer: {
    padding: Spacing.md,
    marginTop: 'auto',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  signOutText: {
    marginLeft: Spacing.sm,
    fontSize: 16,
    fontWeight: '600',
  },
});
