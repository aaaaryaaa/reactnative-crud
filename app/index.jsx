import { Pressable, Text, TextInput, View, StyleSheet, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext, useEffect } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { StatusBar } from "expo-status-bar"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter"

import  Animated, { LinearTransition } from 'react-native-reanimated'

import AsyncStorage from "@react-native-async-storage/async-storage"

import FontAwesome from '@expo/vector-icons/FontAwesome';

import { data } from "@/data/todos"

export default function Index() {
  const [todos, setTodos] = useState([]) //data.sort((a, b) => b.id - a.id)
  const [text, setText] = useState('')
  const { colorScheme, setColorScheme, theme } = useContext(ThemeContext)

  const [loaded, error] = useFonts({
    Inter_500Medium
  })

  useEffect(() => {
    const fetchData = async () => {
      try{
        const jsonValue = await AsyncStorage.getItem("TodoApp")
        const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null

        if(storageTodos && storageTodos.length) {
          setTodos(storageTodos.sort((a, b) => b.id - a.id))
        } else {
          setTodos(data.sort((a, b) => b.id - a.id))
        }
      } catch(e) {
        console.error(e)
      }
    }

    fetchData()
  }, [data])

  useEffect(() => {
    const storeData = async() => {
      try {
        const jsonValue = JSON.stringify(todos)
        await AsyncStorage.setItem("TodoApp", jsonValue)
      } catch(e) {
        console.error(e)
      }
    }

    storeData()
  }, [todos])

  if(!loaded && !error){
    return null
  }

  const styles = createStyles(theme, colorScheme)

  const addTodo = () => {
    // console.log('current text val: ', text)
    if (true){
      const newId = todos.length > 0 ? todos[0].id + 1 : 1;
      setTodos([{id: newId, title: text.toString(), completed: false}, ...todos])
      setText('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? {...todo, completed: !todo.completed} : todo
    ))
  }

  const removeTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !==id))
  }

  const renderItem = ({ item }) => (
    <View style={styles.todoItem}>
      <Text
        style={[styles.todoText, item.completed && styles.completedText]}
        onPress={() => {toggleTodo(item.id)}}
      >
        {item.title}
      </Text>
      <Pressable onPress={() => removeTodo(item.id)}>
        <MaterialCommunityIcons name="delete-circle" size={36} color="red" selectable={undefined} />
      </Pressable>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Add new ToDo here!"
          placeholderTextColor="gray"
          value={text}
          onChangeText={setText}
        />
        <Pressable onPress={addTodo} style={styles.addButton}>
          <Text style={styles.addButtonText}>ADD</Text>
        </Pressable>

        <Pressable
          onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
          style={{marginLeft: 10}}
        >
          <FontAwesome 
            name={colorScheme === 'dark' ? 'sun-o' : 'moon-o'} 
            size={36} 
            width={36} 
            color={theme.text}
            selectable={undefined} 
          />
        </Pressable>
      </View>
      
      <Animated.FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={todo => todo.id}
        contentContainerStyle={{ flexGrow: 1 }}
        itemLayoutAnimation={LinearTransition}
        keyboardDismissMode='on-drag'
      />

      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      backgroundColor: theme.background
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      padding: 10,
      width: '100%',
      maxWidth: 1024,
      marginHorizontal: 'auto',
      pointerEvents: 'auto'
    },
    input: {
      flex: 1,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      padding: 10,
      marginRight: 10,
      fontSize: 18,
      fontFamily: 'Inter_500Medium',
      minWidth: 0,
      color: theme.text
    },
    addButton: {
      backgroundColor: theme.button,
      borderRadius: 5,
      padding: 10
    },
    addButtonText: {
      fontSize: 18,
      color: colorScheme === 'dark' ? 'black' : 'white'
    },
    todoItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 4,
      padding: 10,
      width: '100%',
      maxWidth: 1024,
      borderBottomWidth: 1,
      borderBottomColor: 'gray',
      pointerEvents: 'auto'
    },
    todoText: {
      color: theme.text,
      flex: 1,
      fontSize: 18,
      fontFamily: 'Inter_500Medium'
    },
    completedText: {
      textDecorationLine: 'line-through',
      color: 'gray'
    }
  })
}
