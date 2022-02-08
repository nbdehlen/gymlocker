import AsyncStorage from '@react-native-async-storage/async-storage'

export const getData = async (storageKey: string) => {
  try {
    const jsonValue = await AsyncStorage.getItem(storageKey)
    return jsonValue != null ? JSON.parse(jsonValue) : null
  } catch (e) {
    console.log({ e }, 'error getData')
  }
}

export const storeData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    console.log({ e },'error storeData')
  }
}
