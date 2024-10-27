import React, { useState, useEffect } from 'react';
import { TextInput, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome';

interface SearchBarProps {
  searchText: string;
  setSearchText: (text: string) => void;
  handleSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchText,
  setSearchText,
  handleSearch,
}) => {
  const [input, setInput] = useState(searchText);

  useEffect(() => {
    setInput(searchText);
  }, [searchText]);

  const onSearchPress = () => {
    setSearchText(input);
    handleSearch();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search"
        style={styles.box}
        value={input}
        onChangeText={(text) => {
          setInput(text);
        }}
        onSubmitEditing={onSearchPress}
      />
      <TouchableOpacity onPress={onSearchPress} style={styles.searchIcon}>
        <Icon name="search" size={20} color={Colors.purple} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    alignItems: 'center',
    marginVertical: '6%',
    marginBottom: '12%',
  },
  searchIcon: {
    position: 'absolute',
    right: '10%',
    top: '1%',
  },
  box: {
    width: Dimensions.get('window').width * 0.7,
    fontSize: 15,
    borderWidth: 1,
    borderColor: Colors.purple,
    borderRadius: 25,
    paddingHorizontal: '2%',
    height: 35,
    backgroundColor: Colors.white,
    shadowColor: Colors.blue,
    shadowOpacity: 0.3,
    elevation: 7,
  },
});

export default SearchBar;
