import * as React from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity, StatusBar } from 'react-native'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Constants from 'expo-constants'
import * as Animatable from 'react-native-animatable'
import { useNavigation } from '@react-navigation/native'

const schema = yup.object({
    username: yup.string().required("Informe seu nome"),
    storename: yup.string().required("Informe o nome da loja"),
})

export default function Login(){
    const navigation = useNavigation();
    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    async function handleLogin(data) {
        try {
            // navigation.navigate('Collect', { fileName: data.storename });
            navigation.navigate('Collect');
        } catch (e) {
            console.log('Erro ao gravar ' + e);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerLogo}>
                <Animatable.Image
                    animation={"flipInY"}
                    source={require('../../assets/logo.png')}
                    style={{width: '100%', height: 300}}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Coletor de Preços</Text>
            </View>

            <Animatable.View delay={600} animation="fadeInUp" style={styles.containerForm}>
                <Text style={styles.label}>Usuário</Text>
                <Controller
                    control={control}
                    name='username'
                    render={({field: { onChange, onBlur, value }}) => (
                    <TextInput
                        style={[
                        styles.input,{
                            borderWidth: errors.username && 1,
                            borderColor: errors.username && '#ff375b',
                            marginTop: 5,
                            marginBottom: 5
                        }]}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        placeholder='Digite seu nome...'
                    />
                    )}
                />
                {errors.username && <Text style={styles.labelError}>{errors.username?.message}</Text>}

                {/* <Text style={styles.label}>Loja</Text>
                <Controller
                    control={control}
                    name="storename"
                    render={({field: { onChange, onBlur, value }}) => (
                    <TextInput
                        style={[
                        styles.input,{
                            borderWidth: errors.storename && 1,
                            borderColor: errors.storename && '#ff375b',
                            marginTop: 5,
                            marginBottom: 5
                        }]}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        placeholder='Digite o nome da loja...'
                    />
                    )}
                /> */}
                <Text style={styles.label}>Loja</Text>
                <Controller
                    control={control}
                    name="storename"
                    render={({field: { onChange, onBlur, value }}) => (
                    <TextInput
                        style={[
                        styles.input,{
                            borderWidth: errors.storename && 1,
                            borderColor: errors.storename && '#ff375b',
                            marginTop: 5,
                            marginBottom: 5
                        }]}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                        placeholder='Digite o nome da loja...'
                    />
                    )}
                />
                {errors.storename && <Text style={styles.labelError}>{errors.storename?.message}</Text>}

                <TouchableOpacity style={styles.button} onPress={handleSubmit(handleLogin)}>
                    <Text style={styles.buttonText}>Iniciar Coleta</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    )
}

const styles = StyleSheet.create({
    label: {
        color: 'white',
        marginLeft: 20,
    },
    button: {
        marginTop: 20,
        height: 50,
        margin: 12,
        backgroundColor: '#ff0245',
        borderRadius: 20,
    },
    buttonText:{
        color: 'white',
        fontWeight: 'bold',
        fontSize: 25,
        padding: 8,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        backgroundColor: '#0e101c',
    },
    containerLogo: {
        flex: 1.5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0e101c',
    },
    containerForm:{
        flex: 1,
        backgroundColor: '#a9a9a9',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingTop: '5%',
        paddingStart: '2%',
        paddingEnd: '2%',
    },
    input: {
        backgroundColor: 'white',
        height: 50,
        margin: 12,
        padding: 10,
        borderRadius: 20,
    },
    title:{
        fontSize: 40,
        marginBottom: 34,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    labelError:{
        alignItems: 'flex-start',
        color: '#ff375b',
        fontSize: 13,
        marginLeft: 20,
    },
})
