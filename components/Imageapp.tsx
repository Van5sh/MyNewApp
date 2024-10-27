import React, { useEffect, useState, memo } from "react";
import { 
  View, 
  ScrollView, 
  Button, 
  Image, 
  StyleSheet, 
  Text,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  TextInput
} from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from "react-native-safe-area-context";

interface Imageapp1 {
  search: string;
}

// Configuration and API setup
const API_KEY = "P7tzxzn5lze9AKS6nfBGPEEN3Ozpp68L3AwngcO9xVujZyIDFtmDSOK1";
const IMAGES_PER_PAGE = 15;
const windowWidth = Dimensions.get('window').width;
const imageWidth = (windowWidth - 48) / 2;

const Colors = {
  purple: '#800080',
  white: '#FFFFFF',
  blue: '#0000FF'
};

const fetchImages = async (searchQuery = 'nature', page = 1) => {
  try {
    const API_URL = `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=${IMAGES_PER_PAGE}&page=${page}`;
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': API_KEY
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching images:', error);
    return null;
  }
};

const SearchBar = memo(({ searchText, setSearchText, handleSearch }) => (
  <View style={styles.searchContainer}>
    <TextInput
      placeholder="Search images..."
      style={styles.searchBox}
      value={searchText}
      onChangeText={(text) => setSearchText(text)}
      onSubmitEditing={handleSearch}
      returnKeyType="search"
      autoCorrect={false}
      autoCapitalize="none"
    />
    <TouchableOpacity 
      onPress={handleSearch} 
      style={styles.searchIconContainer}
      activeOpacity={0.7}
    >
      <Icon name="search" size={20} color={Colors.purple} style={styles.searchIcon} />
    </TouchableOpacity>
  </View>
));

const ImageApp: React.FC<Imageapp1> = ({ search }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchText, setSearchText] = useState(search);
  const [searchQuery, setSearchQuery] = useState(search);
  const [page, setPage] = useState(1);

  const loadImages = async (query = searchQuery, pageNumber = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await fetchImages(query, pageNumber);
      
      if (data && data.photos && data.photos.length > 0) {
        setImages((prevImages) => pageNumber === 1 ? data.photos : [...prevImages, ...data.photos]);
        console.log(`Loaded ${data.photos.length} images`);
      } else {
        setError('No images found');
      }
    } catch (err) {
      setError('Failed to load images');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load when component mounts
  useEffect(() => {
    loadImages(search, 1);
  }, []);

  // Handle search query changes
  useEffect(() => {
    loadImages(searchQuery, 1);
  }, [searchQuery]);

  // Handle prop changes
  useEffect(() => {
    setSearchText(search);
    setSearchQuery(search);
    loadImages(search, 1);
  }, [search]);

  const handleSearch = () => {
    if (searchText.trim()) {
      setSearchQuery(searchText.trim());
      setPage(1); // Reset page to 1 for a new search
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadImages(searchQuery, nextPage);
  };

  const renderImageGrid = () => (
    <View style={styles.gridContainer}>
      {images.map((image) => (
        <TouchableOpacity 
          key={image.id} 
          style={styles.imageWrapper}
          onPress={() => setSelectedImage(image)}
        >
          <Image
            source={{ uri: image.src.medium }}
            style={styles.gridImage}
            resizeMode="cover"
          />
          <View style={styles.photographerOverlay}>
            <Text style={styles.photographerText} numberOfLines={1}>
              {image.photographer}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderSelectedImage = () => {
    if (!selectedImage) return null;

    return (
      <View style={styles.selectedImageContainer}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => setSelectedImage(null)}
        >
          <Text style={styles.closeButtonText}>×</Text>
        </TouchableOpacity>
        <Image
          source={{ uri: selectedImage.src.large }}
          style={styles.selectedImage}
          resizeMode="contain"
        />
        <View style={styles.imageInfo}>
          <Text style={styles.photographerName}>
            Photographer: {selectedImage.photographer}
          </Text>
          <Text style={styles.dimensions}>
            {selectedImage.width} × {selectedImage.height}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar 
        searchText={searchText}
        setSearchText={setSearchText}
        handleSearch={handleSearch}
      />
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => {
              setPage(1);
              loadImages(searchQuery, 1);
            }}
          />
        }
      >
        {error && (
          <View style={styles.messageContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        {!loading && !error && renderImageGrid()}
      </ScrollView>
      
      {selectedImage && renderSelectedImage()}
      
      <Button
        title="Load More Images"
        onPress={handleLoadMore}
        disabled={loading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  searchContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: '6%',
    position: 'relative',
  },
  searchBox: {
    width: '80%',
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.purple,
    borderRadius: 25,
    paddingHorizontal: '8%',
    height: 35,
    backgroundColor: Colors.white,
    shadowColor: Colors.blue,
    shadowOpacity: 0.3,
    elevation: 7,
  },
  searchIconContainer: {
    position: 'absolute',
    right: '14%',
    top: 8,
    zIndex: 1,
    padding: 5,
  },
  scrollContent: {
    padding: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  imageWrapper: {
    width: imageWidth,
    height: imageWidth,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  photographerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 4,
  },
  photographerText: {
    color: Colors.white,
    fontSize: 12,
  },
  selectedImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  selectedImage: {
    width: '90%',
    height: '70%',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1001,
  },
  closeButtonText: {
    color: Colors.white,
    fontSize: 40,
  },
  imageInfo: {
    padding: 16,
    alignItems: 'center',
  },
  photographerName: {
    color: Colors.white,
    fontSize: 16,
    marginBottom: 8,
  },
  dimensions: {
    color: '#ccc',
    fontSize: 14,
  },
  messageContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
  },
});

export default ImageApp;