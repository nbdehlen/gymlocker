import React, { FunctionComponent } from 'react'
import { Modal, TouchableOpacity, View } from 'react-native'
import { Text, Div } from 'react-native-magnus'
import { ExerciseModel } from '../../data/entities/ExerciseModel'
import theme, { B } from '../../utils/theme'

type OwnProps = {
  exercise: ExerciseModel
  i: number
  modalVisible: number | null
  handleModal(i: number): void
}

type Props = OwnProps

export const WorkoutModal: FunctionComponent<Props> = ({
  exercise,
  i,
  modalVisible,
  handleModal,
}) => {
  return (
    <Modal visible={i === modalVisible} transparent={true} animationType="slide">
      <TouchableOpacity
        onPress={() => handleModal(i)}
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.6)',
        }}>
        <Div
          w={300}
          h={200}
          rounded={8}
          p={16}
          bg={theme.primary.color}
          borderWidth={1}
          borderColor={theme.placeholder_opacity}
          // elevation={5}
          shadow="md">
          <Text fontWeight="bold" fontSize={14} color={theme.light_1}>
            {exercise.exercise}
          </Text>
          <B.Spacer h={16} />

          <Div flexDir="row" borderBottomWidth={1} borderColor={theme.placeholder_opacity}>
            <Text fontSize={14} color={theme.light_1}>
              Main muscle:{' '}
            </Text>
            <Text fontSize={14} color={theme.light_1}>
              {exercise.muscles}
            </Text>
          </Div>
          <B.Spacer h={4} />
          <Div flexDir="row" borderBottomWidth={1} borderColor={theme.placeholder_opacity}>
            <Text fontSize={14} color={theme.light_1}>
              Assisiting muscles:{' '}
            </Text>
            <Text fontSize={14} color={theme.light_1}>
              {exercise.assistingMuscles}
            </Text>
          </Div>
          <B.Spacer h={4} />
          {/* <Icons.Check
                            width={20}
                            height={20}
                            fill={theme.primary.onColor}
                          /> */}
          <Div flexDir="row" borderBottomWidth={1} borderColor={theme.placeholder_opacity}>
            <Text fontSize={14} color={theme.light_1}>
              Unilateral movement:
            </Text>
          </Div>
          <Div flexDir="row" borderBottomWidth={1} borderColor={theme.placeholder_opacity}>
            <Text fontSize={14} color={theme.light_1}>
              Compound movement:
            </Text>
          </Div>
        </Div>
      </TouchableOpacity>
    </Modal>
  )
}

export default WorkoutModal
