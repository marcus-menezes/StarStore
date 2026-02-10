import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useAuth } from '@/hooks/useAuth';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFeedback } from '@/contexts/FeedbackContext';
import Colors from '@/constants/Colors';
import { t } from '@/i18n';
import { authRepository } from '@/repositories';
import { styles } from './edit-profile.styles';

export default function EditProfileScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { user } = useAuth();
  const { showToast, showModal } = useFeedback();

  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges = displayName.trim() !== (user?.displayName ?? '');

  const handleSave = async () => {
    if (!hasChanges) return;

    const trimmed = displayName.trim();
    if (trimmed.length < 2) {
      showToast({ message: t('editProfile.nameMin'), type: 'warning' });
      return;
    }

    setIsSaving(true);
    try {
      await authRepository.updateDisplayName(trimmed);
      showModal({
        title: t('editProfile.successTitle'),
        message: t('editProfile.successMessage'),
        icon: 'check-circle',
        iconColor: '#16a34a',
        buttons: [{ text: t('common.ok'), onPress: () => router.back() }],
      });
    } catch {
      showToast({ message: t('editProfile.errorMessage'), type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  const initial =
    user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || '?';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          {user?.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.buttonBackground }]}>
              <Text style={[styles.avatarText, { color: colors.buttonText }]}>{initial}</Text>
            </View>
          )}
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>{t('editProfile.nameLabel')}</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder={t('editProfile.namePlaceholder')}
              placeholderTextColor={colors.textSecondary}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>
              {t('editProfile.emailLabel')}
            </Text>
            <View
              style={[
                styles.input,
                styles.disabledInput,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.disabledText, { color: colors.textSecondary }]}>
                {user?.email}
              </Text>
              <FontAwesome name="lock" size={14} color={colors.textSecondary} />
            </View>
            <Text style={[styles.hint, { color: colors.textSecondary }]}>
              {t('editProfile.emailHint')}
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={[styles.label, { color: colors.text }]}>
              {t('editProfile.memberSince')}
            </Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })
                : '-'}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Save button */}
      <View
        style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}
      >
        <Pressable
          style={[
            styles.saveButton,
            {
              backgroundColor: hasChanges ? colors.buttonBackground : colors.border,
            },
          ]}
          onPress={handleSave}
          disabled={!hasChanges || isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color={colors.buttonText} />
          ) : (
            <Text
              style={[
                styles.saveButtonText,
                { color: hasChanges ? colors.buttonText : colors.textSecondary },
              ]}
            >
              {t('editProfile.save')}
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}