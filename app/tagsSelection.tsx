import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform, Dimensions, TextInput, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import ScreenWrapper from '@/components/ScreenWrapper';
import BackButton from '@/components/Buttons/BackButton';
import NextButton from '@/components/Buttons/NextButton';
import { useRouter } from 'expo-router';
import { hp, wp } from './helpers/common';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { updateUserTags } from '@/services/userService';

const { width, height } = Dimensions.get('window')

const categories = [
  {
    title: 'Hobbies',
    tags: [
      { name: 'sleeping', emoji: '😴' },
      { name: 'baking', emoji: '🍰' },
      { name: 'calligraphy', emoji: '✒️' },
      { name: 'dancing', emoji: '💃' },
      { name: 'embroidery', emoji: '🧵' },
      { name: 'fishing', emoji: '🎣' },
      { name: 'gardening', emoji: '🌱' },
      { name: 'hiking', emoji: '🥾' },
      { name: 'ice skating', emoji: '⛸️' },
      { name: 'joking', emoji: '😂' },
      { name: 'kiting', emoji: '🪁' },
      { name: 'languages', emoji: '🗣️' },
      { name: 'painting', emoji: '🎨' },
      { name: 'photography', emoji: '📷' },
      { name: 'reading', emoji: '📚' },
      { name: 'singing', emoji: '🎤' },
      { name: 'swimming', emoji: '🏊' },
      { name: 'traveling', emoji: '✈️' },
      { name: 'writing', emoji: '✍️' },
      { name: 'yoga', emoji: '🧘' },
      { name: 'cooking', emoji: '👨‍🍳' },
      { name: 'drawing', emoji: '✏️' },
      { name: 'knitting', emoji: '🧶' },
      { name: 'meditation', emoji: '🧘‍♀️' },
    ],
  },
  {
    title: 'Music Taste',
    tags: [
      { name: 'pop', emoji: '🎵' },
      { name: 'rock', emoji: '🎸' },
      { name: 'hip-hop', emoji: '🎤' },
      { name: 'jazz', emoji: '🎷' },
      { name: 'classical', emoji: '🎻' },
      { name: 'country', emoji: '🤠' },
      { name: 'electronic', emoji: '🎛️' },
      { name: 'R&B', emoji: '🎶' },
      { name: 'indie', emoji: '🎹' },
      { name: 'metal', emoji: '🤘' },
      { name: 'folk', emoji: '🪕' },
      { name: 'blues', emoji: '🎺' },
      { name: 'reggae', emoji: '🇯🇲' },
      { name: 'punk', emoji: '🔊' },
      { name: 'soul', emoji: '💖' },
      { name: 'alternative', emoji: '🎼' },
      { name: 'EDM', emoji: '💿' },
      { name: 'Latin', emoji: '💃' },
      { name: 'K-pop', emoji: '🇰🇷' },
      { name: 'J-pop', emoji: '🇯🇵' },
      { name: 'gospel', emoji: '🙏' },
      { name: 'funk', emoji: '🕺' },
      { name: 'disco', emoji: '🪩' },
      { name: 'ambient', emoji: '🌙' },
    ],
  },
  {
    title: 'Pets',
    tags: [
      { name: 'cats', emoji: '🐱' },
      { name: 'dogs', emoji: '🐶' },
      { name: 'birds', emoji: '🐦' },
      { name: 'ponies', emoji: '🐴' },
      { name: 'reptiles', emoji: '🦎' },
      { name: 'rabbits', emoji: '🐰' },
      { name: 'lizards', emoji: '🦎' },
      { name: 'snakes', emoji: '🐍' },
      { name: 'foxes', emoji: '🦊' },
      { name: 'mice', emoji: '🐭' },
      { name: 'fish', emoji: '🐠' },
      { name: 'penguins', emoji: '🐧' },
      { name: 'hamsters', emoji: '🐹' },
      { name: 'guinea pigs', emoji: '🐹' },
      { name: 'ferrets', emoji: '🐾' },
      { name: 'turtles', emoji: '🐢' },
      { name: 'hedgehogs', emoji: '🦔' },
      { name: 'parrots', emoji: '🦜' },
      { name: 'gerbils', emoji: '🐁' },
      { name: 'chinchillas', emoji: '🐭' },
      { name: 'iguanas', emoji: '🦎' },
      { name: 'bearded dragons', emoji: '🦎' },
      { name: 'axolotls', emoji: '🦎' },
      { name: 'sugar gliders', emoji: '🐿️' },
    ],
  },
  {
    title: 'Values & traits',
    tags: [
      { name: 'kind', emoji: '😊' },
      { name: 'honest', emoji: '🤥' },
      { name: 'creative', emoji: '🎨' },
      { name: 'ambitious', emoji: '🚀' },
      { name: 'loyal', emoji: '🤝' },
      { name: 'patient', emoji: '⏳' },
      { name: 'confident', emoji: '💪' },
      { name: 'humble', emoji: '🙏' },
      { name: 'optimistic', emoji: '😃' },
      { name: 'adventurous', emoji: '🏔️' },
      { name: 'compassionate', emoji: '❤️' },
      { name: 'determined', emoji: '🎯' },
      { name: 'empathetic', emoji: '🤗' },
      { name: 'resilient', emoji: '🌱' },
      { name: 'curious', emoji: '🧐' },
      { name: 'adaptable', emoji: '🦎' },
      { name: 'reliable', emoji: '🤞' },
      { name: 'open-minded', emoji: '🧠' },
      { name: 'passionate', emoji: '🔥' },
      { name: 'respectful', emoji: '🙌' },
      { name: 'authentic', emoji: '💯' },
      { name: 'generous', emoji: '🎁' },
      { name: 'courageous', emoji: '🦁' },
      { name: 'thoughtful', emoji: '💭' },
    ],
  },
];

const MIN_TAGS = 1;
const MAX_TAGS = 12;
const INITIAL_VISIBLE_TAGS = 12;

export default function TagSelectionScreen() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, setUserData } = useAuth();

  useEffect(() => {
    if (user?.tags) {
      setSelectedTags(user.tags);
    }
  }, [user]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = categories.map(category => ({
        ...category,
        tags: category.tags.filter(tag => 
          tag.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(category => category.tags.length > 0);
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchQuery]);

  const toggleTag = (tagName: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tagName)) {
        return prev.filter(t => t !== tagName);
      } else if (prev.length < MAX_TAGS) {
        return [...prev, tagName];
      }
      Alert.alert('Maximum Tags', `You can select up to ${MAX_TAGS} tags.`);
      return prev;
    });
  };

  const addCustomTag = () => {
    if (searchQuery && !selectedTags.includes(searchQuery)) {
      if (selectedTags.length < MAX_TAGS) {
        setSelectedTags(prev => [...prev, searchQuery]);
        setSearchQuery('');
      } else {
        Alert.alert('Maximum Tags', `You can select up to ${MAX_TAGS} tags.`);
      }
    }
  };

  const toggleCategoryExpansion = (categoryTitle: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryTitle)
        ? prev.filter(title => title !== categoryTitle)
        : [...prev, categoryTitle]
    );
  };

  const handleNext = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'User ID is missing. Please try logging in again.');
      return;
    }

    if (selectedTags.length < MIN_TAGS) {
      Alert.alert('Not Enough Tags', `Please select at least ${MIN_TAGS} tag.`);
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateUserTags(user.id, selectedTags);
      if (result.success) {
        setUserData({ tags: selectedTags });
        router.push('/imagesSelection');
      } else {
        throw new Error(result.msg || 'Failed to update tags');
      }
    } catch (error) {
      console.error('Error updating tags:', error);
      Alert.alert('Error', (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <StatusBar style="light" />
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Choose your tags</Text>
          <Text style={styles.subtitle}>Pick what describes you and {'\n'} helps others find you!</Text>
          
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#fff" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search or add custom tags"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={addCustomTag}
            />
          </View>

          <Text style={[
            styles.tagCount,
            selectedTags.length === MAX_TAGS && styles.tagCountMax
          ]}>
            {selectedTags.length}/{MAX_TAGS} tags chosen
          </Text>

          {selectedTags.length > 0 && (
            <View style={styles.selectedTagsContainer}>
              {selectedTags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.selectedTag}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={styles.selectedTagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {filteredCategories.map((category, index) => (
            <View key={index} style={styles.categoryContainer}>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <View style={styles.tagsContainer}>
                {category.tags.slice(0, expandedCategories.includes(category.title) ? undefined : INITIAL_VISIBLE_TAGS).map((tag, tagIndex) => (
                  <TouchableOpacity
                    key={tagIndex}
                    style={[
                      styles.tag,
                      selectedTags.includes(tag.name) && styles.selectedTag
                    ]}
                    onPress={() => toggleTag(tag.name)}
                  >
                    <Text style={styles.tagText}>{tag.emoji} {tag.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              {category.tags.length > INITIAL_VISIBLE_TAGS && (
                <TouchableOpacity onPress={() => toggleCategoryExpansion(category.title)}>
                  <Text style={styles.showMore}>
                    {expandedCategories.includes(category.title) ? 'Show less' : 'Show more'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
        
        <View style={styles.footer}>
          <BackButton router={router} />
          <View style={styles.progressBar}>
            <View style={styles.progress} />
          </View>
          <NextButton onPress={handleNext} disabled={isLoading || selectedTags.length < MIN_TAGS} />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: hp(4),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: hp(2),
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.7,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#fff',
    fontSize: 16,
  },
  tagCount: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  tagCountMax: {
    color: '#ff4d4d',
  },
  selectedTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  selectedTag: {
    backgroundColor: '#3498db',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedTagText: {
    color: '#fff',
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'transparent',
    borderColor: '#3498db',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    margin: 4,
  },
  tagText: {
    color: '#fff',
  },
  showMore: {
    color: '#3498db',
    marginTop: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#333',
    marginHorizontal: 10,
  },
  progress: {
    width: '75%',
    height: '100%',
    backgroundColor: '#3498db',
  },
});