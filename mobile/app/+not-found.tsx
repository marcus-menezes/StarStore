import { Link, Stack } from 'expo-router';

import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { t } from '@/i18n';
import { styles } from './+not-found.styles';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: t('notFound.title') }} />
      <View style={styles.container}>
        <Text style={styles.title}>{t('notFound.message')}</Text>

        <Link href="/" style={styles.link}>
          <Text style={[styles.linkText, { color: Colors.accent }]}>{t('notFound.goHome')}</Text>
        </Link>
      </View>
    </>
  );
}