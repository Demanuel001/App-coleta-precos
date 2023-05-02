import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Login from '../screens/Login'
import Collect from '../screens/Collect'

const Stack = createNativeStackNavigator();

export default function Routes(){
    return(
        <Stack.Navigator>
            <Stack.Screen
                name='Login'
                component={Login}
                options={{headerShown: false}}
            />

            <Stack.Screen
                name='Collect'
                component={Collect}
                options={{headerShown: false}}
            />
        </Stack.Navigator>
    )
};