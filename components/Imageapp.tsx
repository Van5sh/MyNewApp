import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  Dimensions,
  RefreshControl,
} from "react-native";
import SearchBar from "./SearchBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../constants/colors";
import { ImageProps } from "../interfaces/ImageProps";
import { Imageapp1 } from "../interfaces/ImageSearch";
import { API_KEY } from "../config";

const IMAGES_PER_PAGE = 16;
const windowWidth = Dimensions.get("window").width;
const imageWidth = (windowWidth - 48) / 2;

const fetchImages = async (searchQuery = "nature", page = 1) => {
  try {
    const API_URL = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      searchQuery
    )}&per_page=${IMAGES_PER_PAGE}&page=${page}`;
    const response = await fetch(API_URL, {
      headers: {
        Authorization: API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching images:", error);
    return null;
  }
};

const ImageApp: React.FC<Imageapp1> = ({ search }) => {
  const [images, setImages] = useState<ImageProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageProps>();
  const [searchText, setSearchText] = useState<string>(search);
  const [searchQuery, setSearchQuery] = useState(search);
  const [page, setPage] = useState(1);

  const loadImages = async (query = searchQuery, pageNumber = 1) => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchImages(query, pageNumber);

      if (data && data.photos && data.photos.length > 0) {
        setImages((prevImages) =>
          pageNumber === 1 ? data.photos : [...prevImages, ...data.photos]
        );
        console.log(`Loaded ${data.photos.length} images`);
      } else {
        setError("No images found");
      }
    } catch (err) {
      setError("Failed to load images");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages(search, 1);
  }, []);

  useEffect(() => {
    loadImages(searchQuery, 1);
  }, [searchQuery]);

  useEffect(() => {
    setSearchText(search);
    setSearchQuery(search);
    loadImages(search, 1);
  }, [search]);

  const handleSearch = () => {
    if (searchText.trim()) {
      setSearchQuery(searchText.trim());
      setPage(1);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadImages(searchQuery, nextPage);
  };

  const renderImageGrid = () => (
    <View style={styles.gridContainer}>
      {images.map((image: ImageProps) => (
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
          onPress={() => setSelectedImage(undefined)}
        >
          <Text style={styles.closeButtonText}>x</Text>
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

      <TouchableOpacity style={styles.button} onPress={handleLoadMore}>
        <Text style={styles.buttonText}>Load More Images</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  button: {
    justifyContent: "center",
    padding: 6,
    backgroundColor: Colors.white,
    borderRadius: 4,
    borderWidth: 5,
    marginHorizontal: 20,
    borderColor: Colors.purple,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.purple,
    fontSize: 16,
    fontWeight: "bold",
  },
  scrollContent: {
    padding: 16,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  imageWrapper: {
    width: imageWidth,
    height: imageWidth,
    marginBottom: 16,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#f0f0f0",
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  photographerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 4,
  },
  photographerText: {
    color: Colors.white,
    fontSize: 12,
  },
  selectedImageContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  selectedImage: {
    width: "90%",
    height: "70%",
  },
  closeButton: {
    position: "absolute",
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
    alignItems: "center",
  },
  photographerName: {
    color: Colors.white,
    fontSize: 16,
    marginBottom: 8,
  },
  dimensions: {
    color: "#ccc",
    fontSize: 14,
  },
  messageContainer: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },  
  errorText: {
    color: "red",
  },
});

export default ImageApp;
