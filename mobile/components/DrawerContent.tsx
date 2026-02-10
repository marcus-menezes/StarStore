import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { router } from 'expo-router';
import { Image, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Colors, { type ThemeColors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import { t } from '@/i18n';
import { type Locale, useLocaleStore } from '@/store/localeStore';
import { useThemeStore } from '@/store/themeStore';
import { styles } from './DrawerContent.styles';

interface MenuItemProps {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  colors: ThemeColors;
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

const LOCALE_OPTIONS: {
  key: Locale;
  labelKey: string;
}[] = [
  { key: 'pt-BR', labelKey: 'settings.languagePt' },
  { key: 'en', labelKey: 'settings.languageEn' },
];

export function DrawerContent(props: DrawerContentComponentProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { user, isAuthenticated, isLoading, signOut } = useAuth();
  const { themePreference, setThemePreference } = useThemeStore();
  const { locale, setLocale } = useLocaleStore();

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
                    {t(option.labelKey as Parameters<typeof t>[0])}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.themeRow}>
            <FontAwesome name="globe" size={16} color={colors.textSecondary} />
            <Text style={[styles.themeLabel, { color: colors.text }]}>
              {t('settings.language')}
            </Text>
          </View>
          <View style={styles.themeOptions}>
            {LOCALE_OPTIONS.map((option) => {
              const isSelected = locale === option.key;
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
                  onPress={() => setLocale(option.key)}
                >
                  <Text
                    style={[
                      styles.themeOptionText,
                      { color: isSelected ? colors.buttonText : colors.text },
                    ]}
                  >
                    {t(option.labelKey as Parameters<typeof t>[0])}
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

        <View style={[styles.settingsInline, { borderTopColor: colors.border }]}>
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
                    {t(option.labelKey as Parameters<typeof t>[0])}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.themeRow}>
            <FontAwesome name="globe" size={16} color={colors.textSecondary} />
            <Text style={[styles.themeLabel, { color: colors.text }]}>
              {t('settings.language')}
            </Text>
          </View>
          <View style={styles.themeOptions}>
            {LOCALE_OPTIONS.map((option) => {
              const isSelected = locale === option.key;
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
                  onPress={() => setLocale(option.key)}
                >
                  <Text
                    style={[
                      styles.themeOptionText,
                      { color: isSelected ? colors.buttonText : colors.text },
                    ]}
                  >
                    {t(option.labelKey as Parameters<typeof t>[0])}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </DrawerContentScrollView>

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
