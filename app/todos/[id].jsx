import { LocalSearchParams, useLocalSearchParams } from "expo-router"
import { Text, View, Pressable, TextInput, StyleSheet } from "react-native"

import { SafeAreaView } from "react-native-safe-area-context"
import { useState, useEffect, useContext } from "react"
import { ThemeContext } from "@/context/ThemeContext"
import { StatusBar } from "expo-status-bar"
import { Inter_500Medium } from "@expo-google-fonts/inter"
import { Octicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"

export default function EditScreen() {
    const { id } = useLocalSearchParams()
    const router = useRouter()
    const [todo, setTodo] = useState({})
    const { colorScheme, setColorScheme, theme } = useContext(ThemeContext)

    const [loaded, error] = useState({
        Inter_500Medium,
    })

    useEffect(() => {
        const fetchData = async (id) => {
            try {
                const jsonValue = await AsyncStorage.getItem("TodoApp")
                const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null

                if(storageTodos && storageTodos.length) {
                    const myTodo = storageTodos.find(todo => todo.id.toString() === id)
                    setTodo(myTodo)
                }
            } catch(e) {
                console.error(e)
            }
        }

        fetchData(id)
    }, [])

    if(!loaded && !error){
        return null
    }

    const handleSave = async () => {
        try {
            const savedTodo = {...todo, title: todo.title}

            const jsonValue = await AsyncStorage.getItem("TodoApp")
            const storageTodos = jsonValue != null ? JSON.parse(jsonValue) : null

            if(storageTodos && storageTodos.length) {
                const otherTodos = storageTodos.filter(todo => todo.id !== savedTodo.id)
                const allTodos = [...otherTodos, savedTodo]
                await AsyncStorage.setItem("TodoApp", JSON.stringify(allTodos))
            } else {
                await AsyncStorage.setItem("TodoApp", JSON.stringify([savedTodo]))
            }
        } catch(e) {
            console.error(e)
        }

        router.push('/')
    }

    const styles = createStyles(theme, colorScheme)

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Edit Todo"
                    placeholderTextColor="gray"
                    value={todo?.title || ''}
                    onChangeText={(text) => setTodo( prev => ({ ...todo, title: text}))}
                />
                <Pressable
                    onPress={() => setColorScheme(colorScheme === 'light' ? 'dark' : 'light')}
                    style={{marginLeft: 10}}
                    >
                    <Octicons 
                        name={colorScheme === 'dark' ? 'sun' : 'moon'} 
                        size={36} 
                        width={36} 
                        color={theme.text}
                        selectable={undefined} 
                    />
                </Pressable>
            </View>
            <View style={styles.inputContainer}>
                <Pressable
                    onPress={handleSave}
                    style={styles.saveButton}
                >
                    <Text style={styles.saveButtonText}>Save</Text>
                </Pressable>
                <Pressable
                    onPress={() => router.push('/')}
                    style={[styles.saveButton, { backgroundColor: 'red'}]}
                >
                    <Text style={[styles.saveButtonText, { color: 'white' }]}>Cancel</Text>
                </Pressable>
            </View>

            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </SafeAreaView>
    )
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
            padding: 10,
            gap: 6,
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
        saveButton: {
            backgroundColor: colorScheme === 'dark' ? 'white' : 'black',
            borderRadius: 5,
            padding: 10
        },
        saveButtonText: {
            fontSize: 18,
            color: colorScheme === 'dark' ? 'black' : 'white'
        }
    })
}