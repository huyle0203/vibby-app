import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const categories = [
  {
    title: 'Hobbies',
    tags: ['sleeping', 'baking', 'caligraphy', 'dancing', 'embroidery', 'fishing', 'gardening', 'hiking', 'ice skating', 'joking', 'kiting', 'languages'],
  },
  {
    title: 'Pets',
    tags: ['cats', 'dogs', 'birds', 'ponies', 'reptiles', 'rabbits', 'lizards', 'snakes', 'foxes', 'mice', 'fish', 'penguins'],
  },
  {
    title: 'Values & traits',
    tags: ['kind', 'honest', 'creative', 'ambitious', 'loyal', 'patient', 'confident', 'humble', 'optimistic', 'adventurous', 'compassionate', 'determined'],
  },
];

export default function TagSelectionScreen() {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Choose your tags</Text>
        <Text style={styles.subtitle}>Pick what describes you and helps others find you!</Text>
        
        {categories.map((category, index) => (
          <View key={index} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <View style={styles.tagsContainer}>
              {category.tags.map((tag, tagIndex) => (
                <TouchableOpacity
                  key={tagIndex}
                  style={[
                    styles.tag,
                    selectedTags.includes(tag) && styles.selectedTag
                  ]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={styles.tagText}>🐱 {tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity>
              <Text style={styles.showMore}>Show more</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <View style={styles.progressBar}>
          <View style={styles.progress} />
        </View>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerButtonText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </View>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
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
  selectedTag: {
    backgroundColor: '#3498db',
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
  footerButton: {
    backgroundColor: '#3498db',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#333',
    marginHorizontal: 10,
  },
  progress: {
    width: '50%',
    height: '100%',
    backgroundColor: '#3498db',
  },
});