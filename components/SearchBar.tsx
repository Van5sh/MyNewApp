import React, { useState, useEffect } from 'react';
import { TextInput, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
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
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder="Search"
          style={styles.input}
          value={input}
          onChangeText={(text) => setInput(text)}
          onSubmitEditing={onSearchPress}
        />
        <TouchableOpacity onPress={onSearchPress} style={styles.iconWrapper}>
          <Icon name="search" size={20} color={Colors.purple} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    alignItems: 'center',
    marginVertical: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    backgroundColor: Colors.white,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.purple,
    paddingHorizontal: 10,
    height: 50,
    shadowColor: Colors.blue,
    shadowOpacity: 0.3,
    elevation: 7,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    paddingHorizontal: 10,
  },
  iconWrapper: {
    padding: 10,
  },
});

export default SearchBar;
