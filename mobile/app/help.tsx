import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { t } from '@/i18n';
import { styles } from '@/styles/help.styles';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'help.faq.q1',
    answer: 'help.faq.a1',
  },
  {
    question: 'help.faq.q2',
    answer: 'help.faq.a2',
  },
  {
    question: 'help.faq.q3',
    answer: 'help.faq.a3',
  },
  {
    question: 'help.faq.q4',
    answer: 'help.faq.a4',
  },
  {
    question: 'help.faq.q5',
    answer: 'help.faq.a5',
  },
];

interface ContactOption {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  labelKey: string;
  subtitleKey: string;
  action: () => void;
}

function AccordionItem({
  item,
  isOpen,
  onToggle,
  colors,
}: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  colors: typeof Colors.light;
}) {
  return (
    <Pressable
      style={[styles.faqItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={onToggle}
    >
      <View style={styles.faqHeader}>
        <Text
          style={[styles.faqQuestion, { color: colors.text }]}
          numberOfLines={isOpen ? undefined : 2}
        >
          {t(item.question as Parameters<typeof t>[0])}
        </Text>
        <FontAwesome
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={12}
          color={colors.textSecondary}
        />
      </View>
      {isOpen && (
        <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
          {t(item.answer as Parameters<typeof t>[0])}
        </Text>
      )}
    </Pressable>
  );
}

export default function HelpScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const contactOptions: ContactOption[] = [
    {
      icon: 'envelope',
      labelKey: 'help.contact.email',
      subtitleKey: 'help.contact.emailValue',
      action: () => Linking.openURL('mailto:suporte@starstore.com.br'),
    },
    {
      icon: 'whatsapp',
      labelKey: 'help.contact.whatsapp',
      subtitleKey: 'help.contact.whatsappValue',
      action: () => Linking.openURL('https://wa.me/5511999999999'),
    },
    {
      icon: 'clock-o',
      labelKey: 'help.contact.hours',
      subtitleKey: 'help.contact.hoursValue',
      action: () => {},
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={[styles.hero, { backgroundColor: colors.surface }]}>
          <FontAwesome
            name="life-ring"
            size={48}
            color={colorScheme === 'dark' ? Colors.primary : colors.text}
          />
          <Text style={[styles.heroTitle, { color: colors.text }]}>{t('help.title')}</Text>
          <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
            {t('help.subtitle')}
          </Text>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('help.faqTitle')}</Text>
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem
              key={item.question}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              colors={colors}
            />
          ))}
        </View>

        {/* Contact Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('help.contactTitle')}
          </Text>
          {contactOptions.map((option) => (
            <Pressable
              key={option.labelKey}
              style={[
                styles.contactItem,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={option.action}
            >
              <View
                style={[
                  styles.contactIcon,
                  {
                    backgroundColor:
                      colorScheme === 'dark' ? Colors.dark.surfaceElevated : '#F0F0F0',
                  },
                ]}
              >
                <FontAwesome
                  name={option.icon}
                  size={20}
                  color={colorScheme === 'dark' ? Colors.primary : colors.text}
                />
              </View>
              <View style={styles.contactText}>
                <Text style={[styles.contactLabel, { color: colors.text }]}>
                  {t(option.labelKey as Parameters<typeof t>[0])}
                </Text>
                <Text style={[styles.contactSubtitle, { color: colors.textSecondary }]}>
                  {t(option.subtitleKey as Parameters<typeof t>[0])}
                </Text>
              </View>
              {option.icon !== 'clock-o' && (
                <FontAwesome name="external-link" size={14} color={colors.textSecondary} />
              )}
            </Pressable>
          ))}
        </View>

        {/* App version */}
        <Text style={[styles.version, { color: colors.textSecondary }]}>StarStore v1.0.0</Text>
      </ScrollView>
    </View>
  );
}
