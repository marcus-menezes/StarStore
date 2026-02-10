import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';

import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTheme } from '@/contexts/ThemeContext';
import Colors from '@/constants/Colors';
import { Spacing, BorderRadius } from '@/constants/Spacing';
import { t } from '@/i18n';

interface MenuItemProps {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  colors: typeof Colors.light;
  onPress: () => void;
}

function MenuItem({ icon, label, colors, onPress }: MenuItemProps) {
  return (
    <Pressable style={[styles.menuItem, { backgroundColor: colors.surface }]} onPress={onPress}>
      <FontAwesome name={icon} size={20} color={colors.textSecondary} />
      <Text style={[styles.menuLabel, { color: colors.text }]}>{label}</Text>
      <FontAwesome name="chevron-right" size={14} color={colors.textSecondary} />
    </Pressable>
  );
}

type ThemeOption = 'light' | 'dark' | 'system';

const THEME_OPTIONS: {
  key: ThemeOption;
  labelKey: string;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
}[] = [
  { key: 'light', labelKey: 'settings.themeLight', icon: 'sun-o' },
  { key: 'dark', labelKey: 'settings.themeDark', icon: 'moon-o' },
  { key: 'system', labelKey: 'settings.themeSystem', icon: 'mobile' },
];

export function DrawerContent(props: DrawerContentComponentProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const { themePreference, setThemePreference } = useTheme();

  const closeDrawer = () => props.navigation.closeDrawer();

  if (!isAuthenticated) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top', 'bottom']}
      >
        <View style={styles.guestContainer}>
          <FontAwesome name="user-circle" size={80} color={colors.textSecondary} />
          <Text style={[styles.guestTitle, { color: colors.text }]}>{t('profile.guestTitle')}</Text>
          <Text style={[styles.guestSubtitle, { color: colors.textSecondary }]}>
            {t('profile.guestSubtitle')}
          </Text>

          <Pressable
            style={[styles.signInButton, { backgroundColor: colors.buttonBackground }]}
            onPress={() => {
              closeDrawer();
              router.push('/(auth)/login');
            }}
          >
            <Text style={[styles.signInButtonText, { color: colors.buttonText }]}>
              {t('profile.signInButton')}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.registerButton, { borderColor: colors.tint }]}
            onPress={() => {
              closeDrawer();
              router.push('/(auth)/register');
            }}
          >
            <Text style={[styles.registerButtonText, { color: colors.text }]}>
              {t('profile.createAccountButton')}
            </Text>
          </Pressable>
        </View>

        {/* Settings section for guests too */}
        <View style={[styles.settingsSection, { borderTopColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t('settings.title')}
          </Text>
          <View style={styles.themeRow}>
            <FontAwesome name="paint-brush" size={16} color={colors.textSecondary} />
            <Text style={[styles.themeLabel, { color: colors.text }]}>{t('settings.theme')}</Text>
          </View>
          <View style={styles.themeOptions}>
            {THEME_OPTIONS.map((option) => {
              const isSelected = themePreference === option.key;
              return (
                <Pressable
                  key={option.key}
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor: isSelected ? colors.buttonBackground : colors.surface,
                      borderColor: isSelected ? colors.buttonBackground : colors.border,
                    },
                  ]}
                  onPress={() => setThemePreference(option.key)}
                >
                  <FontAwesome
                    name={option.icon}
                    size={14}
                    color={isSelected ? colors.buttonText : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.themeOptionText,
                      { color: isSelected ? colors.buttonText : colors.text },
                    ]}
                  >
                    {t(option.labelKey)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      <DrawerContentScrollView {...props} contentContainerStyle={styles.scrollContent}>
        {/* Profile header */}
        <View style={[styles.profileHeader, { backgroundColor: colors.surface }]}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.buttonBackground }]}>
              <Text style={[styles.avatarText, { color: colors.buttonText }]}>
                {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.displayName || t('profile.defaultUserName')}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{user?.email}</Text>
        </View>

        {/* Menu items */}
        <View style={styles.menuSection}>
          <MenuItem
            icon="user"
            label={t('profile.editProfile')}
            colors={colors}
            onPress={() => {
              closeDrawer();
              router.push('/edit-profile');
            }}
          />
          <MenuItem
            icon="question-circle"
            label={t('profile.helpSupport')}
            colors={colors}
            onPress={() => {
              closeDrawer();
              router.push('/help');
            }}
          />
        </View>

        {/* Settings inline */}
        <View style={[styles.settingsInline, { borderTopColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t('settings.title')}
          </Text>

          {/* Theme selector */}
          <View style={styles.themeRow}>
            <FontAwesome name="paint-brush" size={16} color={colors.textSecondary} />
            <Text style={[styles.themeLabel, { color: colors.text }]}>{t('settings.theme')}</Text>
          </View>
          <View style={styles.themeOptions}>
            {THEME_OPTIONS.map((option) => {
              const isSelected = themePreference === option.key;
              return (
                <Pressable
                  key={option.key}
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor: isSelected ? colors.buttonBackground : colors.surface,
                      borderColor: isSelected ? colors.buttonBackground : colors.border,
                    },
                  ]}
                  onPress={() => setThemePreference(option.key)}
                >
                  <FontAwesome
                    name={option.icon}
                    size={14}
                    color={isSelected ? colors.buttonText : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.themeOptionText,
                      { color: isSelected ? colors.buttonText : colors.text },
                    ]}
                  >
                    {t(option.labelKey)}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Language info */}
          <View style={[styles.settingRow, { backgroundColor: colors.surface }]}>
            <FontAwesome name="globe" size={18} color={colors.textSecondary} />
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              {t('settings.language')}
            </Text>
            <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
              {t('settings.languagePt')}
            </Text>
          </View>
        </View>
      </DrawerContentScrollView>

      {/* Sign out button at the bottom */}
      <View style={styles.signOutContainer}>
        <Pressable
          style={[styles.signOutButton, { borderColor: colors.error }]}
          onPress={signOut}
          disabled={isLoading}
        >
          <FontAwesome name="sign-out" size={18} color={colors.error} />
          <Text style={[styles.signOutText, { color: colors.error }]}>
            {isLoading ? t('profile.signingOut') : t('profile.signOut')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  guestTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: Spacing.lg,
  },
  guestSubtitle: {
    fontSize: 13,
    marginTop: Spacing.sm,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  signInButton: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    width: '100%',
    alignItems: 'center',
  },
  signInButtonText: {
    fontWeight: '600',
    fontSize: 15,
  },
  registerButton: {
    borderWidth: 2,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    width: '100%',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  registerButtonText: {
    fontWeight: '600',
    fontSize: 15,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    marginBottom: Spacing.md,
    borderBottomLeftRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  avatarPlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: Spacing.sm,
  },
  userEmail: {
    fontSize: 13,
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
    fontSize: 15,
  },
  // Settings inline section
  settingsInline: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderTopWidth: 1,
  },
  settingsSection: {
    padding: Spacing.md,
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  themeLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  themeOptions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  themeOptionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  settingLabel: {
    flex: 1,
    marginLeft: Spacing.md,
    fontSize: 15,
  },
  settingValue: {
    fontSize: 14,
  },
  signOutContainer: {
    padding: Spacing.md,
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
    fontSize: 15,
    fontWeight: '600',
  },
});
