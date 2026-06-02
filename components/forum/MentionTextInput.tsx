/**
 * MentionTextInput
 *
 * TextInput com suporte a @menções. Ao digitar "@" seguido de letras, exibe uma
 * lista de usuários sugeridos (via `userService.searchUsers`). Ao tocar em um
 * nome, insere "@nomeDoUsuário" no texto e fecha o dropdown.
 *
 * Formato salvo: texto livre com "@nomeUsuário" inline.
 */

import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { searchUsers, type UserSearchResult } from '@/services/userService';

const androidNoPad =
  Platform.OS === 'android' ? { includeFontPadding: false as const } : {};

interface MentionTextInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value: string;
  onChangeText: (text: string) => void;
  /** Max height of the suggestions dropdown (default 180) */
  dropdownMaxHeight?: number;
  inputStyle?: TextInputProps['style'];
}

export function MentionTextInput({
  value,
  onChangeText,
  dropdownMaxHeight = 180,
  inputStyle,
  ...rest
}: MentionTextInputProps) {
  const [suggestions, setSuggestions] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  /** Current @-query being typed (without the @), or null when not in mention mode */
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  /** Cursor position of the "@" character that started the current mention */
  const mentionStartRef = useRef<number>(-1);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // When mentionQuery changes, fetch suggestions
  useEffect(() => {
    if (mentionQuery === null) {
      setSuggestions([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!mentionQuery) { setSuggestions([]); return; }
      setLoading(true);
      try {
        const results = await searchUsers(mentionQuery);
        setSuggestions(results);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [mentionQuery]);

  function handleChangeText(text: string) {
    onChangeText(text);

    // Detect an active @mention by scanning backwards from the cursor
    // TextInput doesn't give cursor position on change, so we scan the end of text
    const atIndex = text.lastIndexOf('@');
    if (atIndex === -1) {
      setMentionQuery(null);
      mentionStartRef.current = -1;
      return;
    }

    const afterAt = text.slice(atIndex + 1);
    // Mention is active if there's no space after the @
    if (/^\S*$/.test(afterAt)) {
      mentionStartRef.current = atIndex;
      setMentionQuery(afterAt);
    } else {
      setMentionQuery(null);
      mentionStartRef.current = -1;
    }
  }

  function handleSelectUser(user: UserSearchResult) {
    const start = mentionStartRef.current;
    if (start === -1) return;
    // Replace spaces with underscores so the mention is a single token
    // (names with spaces like "João Silva" → "@João_Silva" which the TextWithMentions
    // regex /@\S+/g can highlight correctly as one unit)
    const handle = user.name.replace(/\s+/g, '_');
    const before = value.slice(0, start);
    const after = value.slice(start + 1 + (mentionQuery?.length ?? 0));
    const newText = `${before}@${handle}${after.startsWith(' ') ? after : ` ${after}`}`;
    onChangeText(newText.trimEnd() + ' ');
    setMentionQuery(null);
    setSuggestions([]);
    mentionStartRef.current = -1;
  }

  const showDropdown = mentionQuery !== null && (loading || suggestions.length > 0);

  return (
    <View>
      <TextInput
        value={value}
        onChangeText={handleChangeText}
        style={inputStyle}
        {...rest}
      />

      {showDropdown && (
        <View
          style={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            right: 0,
            marginBottom: 4,
            backgroundColor: '#FFFFFF',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#E5E7EB',
            maxHeight: dropdownMaxHeight,
            overflow: 'hidden',
            zIndex: 999,
            ...(Platform.OS === 'web'
              ? { boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }
              : {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.12,
                  shadowRadius: 6,
                  elevation: 6,
                }),
          }}>
          {loading && suggestions.length === 0 ? (
            <View style={{ padding: 12, alignItems: 'center' }}>
              <ActivityIndicator size="small" color="#432DD7" />
            </View>
          ) : (
            <ScrollView keyboardShouldPersistTaps="always" bounces={false}>
              {suggestions.map((user) => (
                <Pressable
                  key={user.id}
                  onPress={() => handleSelectUser(user)}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    gap: 8,
                    backgroundColor: pressed ? '#F3F4F6' : '#FFFFFF',
                  })}>
                  {/* Avatar initials */}
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: '#432DD7',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                    <Text
                      {...androidNoPad}
                      style={{ color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 12 }}>
                      {user.name
                        .split(' ')
                        .slice(0, 2)
                        .map((w) => w[0])
                        .join('')
                        .toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text
                      {...androidNoPad}
                      numberOfLines={1}
                      style={{
                        fontFamily: 'Inter_600SemiBold',
                        fontSize: 13,
                        color: '#1E2939',
                      }}>
                      {user.name}
                    </Text>
                    {user.role ? (
                      <Text
                        {...androidNoPad}
                        style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: '#6B7280' }}>
                        {user.role}
                      </Text>
                    ) : null}
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
}
