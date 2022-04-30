import AsyncStorage from '@react-native-async-storage/async-storage'

export async function getData(storageKey: string) {
  try {
    const jsonValue = await AsyncStorage.getItem(storageKey)
    return jsonValue != null ? JSON.parse(jsonValue) : null
  } catch (e) {
    console.log({ e }, 'error getData')
  }
}

export async function storeData(key: string, value: string) {
  try {
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    console.log({ e }, 'error storeData')
  }
}

export async function clearAsyncStorage() {
  await AsyncStorage.clear()
}

export async function logAsyncStorage() {
  const all = await AsyncStorage.getAllKeys()
  console.log(JSON.stringify(all, null, 2))
}
