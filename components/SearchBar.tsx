import React, { useState, useEffect } from 'react';
import { TextInput, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/colors';
import Icon from 'react-native-vector-icons/FontAwesome';

interface SearchBarProps{
  searchText: string; 
  setSearchText: (text: string) => void; 
  handleSearch: () => void;
}

const SearchBar:React.FC<SearchBarProps> = ({
  searchText,
  setSearchText,
  handleSearch,
}) => {
  const [input, setInput] = useState(searchText); 

  const search = async (text: string) => {
    setSearchText(text); 
  };

  useEffect(() => {
    setInput(searchText); 
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search"
        style={styles.box}
        value={input} 
        onChangeText={(text) => {
          setInput(text); 
          search(text); 
        }}
      />
      <TouchableOpacity onPress={() => search(input)} style={styles.searchIcon}>
       <Icon name="search" size={20} color={Colors.purple} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: Dimensions.get('window').width,
    alignItems: 'center',
    marginVertical: '6%',
  },
  searchIcon: {
    position: 'absolute', 
    right: '10%', 
    top: '1%',
  },
  box: {
    width: '80%',
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
  icon: {
    position: 'absolute', 
    right:"14%", 
    top: "1%", 
  },

});

export default SearchBar;
