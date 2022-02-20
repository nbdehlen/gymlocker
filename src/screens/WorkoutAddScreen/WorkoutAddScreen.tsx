import React, { FunctionComponent, useLayoutEffect } from 'react'
import { useNavigation } from '@react-navigation/core'
import { Keyboard } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { Div, Text, Button, Icon } from 'react-native-magnus'
import theme, { B } from '../../utils/theme'

type OwnProps = {}

type Props = OwnProps

export const WorkoutAddScreen: FunctionComponent<Props> = () => {
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Div mr={20} flexDir="row">
          <Text color={theme.primary.onColor} fontSize={14}>
            SAVE
          </Text>
          <B.Spacer w={8} />
          <Icon name="ios-save-outline" fontFamily="Ionicons" color={theme.primary.onColor} fontSize={18} />
        </Div>
      ),
      headerTitle: () => null
      //   <Div justifyContent="center" alignItems="center">
      //     <Text color="yellow" fontSize={16}>
      //       Clear
      //     </Text>
      //   </Div>
      // ),
    })
  }, [navigation])

  return (
    <TouchableWithoutFeedback
      onPress={Keyboard.dismiss}
      containerStyle={{
        flex: 1,
        flexDirection: 'row',
        backgroundColor: theme.primary.color,
        justifyContent: 'center',
        width: '100%'
      }}
      style={{ width: '100%' }}
    >
      <Button
        borderColor="rgba(60, 161, 242, 0.6)"
        borderWidth={1}
        bg="transparent"
        alignSelf="center"
        w="30%"
        rounded={4}
        onPress={() => { }}
      >
        <Text color={theme.primary.onColor} fontSize={16}>
          Add set
        </Text>
      </Button>
    </TouchableWithoutFeedback>
  )
}

export default WorkoutAddScreen
