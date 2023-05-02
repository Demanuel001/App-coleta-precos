import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, PermissionsAndroid, Alert } from "react-native";
import { useForm, Controller } from 'react-hook-form';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BarCodeScanner } from 'expo-barcode-scanner';

import AsyncStorage from '@react-native-async-storage/async-storage';

import api from "../../services/api";

export default function Collect(){
    // Criando estado para armazenar os dados do código de barras
    const [scanned, setScanned] = useState(false);
    const [barCode, setBarCode] = useState('');
    const [price, setPrice] = useState('');
    const {control, handleSubmit, formState: { errors }} = useForm();
    const [previousPrice, setPreviousPrice ] = useState('');
    const [previousBarCode, setPreviousBarCode] = useState('');
    // Cria estado para permissões de uso
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    // Pedindo permissões de uso
    const requestPermissions = async () => {
        try {
            const cameraPermission = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
            );
            setHasCameraPermission(
                cameraPermission === PermissionsAndroid.RESULTS.GRANTED,
            );
        
        } catch (err) {
            console.log(err);
        }
    };
    useEffect(() => {
        requestPermissions();
    }, []);
    const handlePermissions = () => {
        requestPermissions();
    };
    // Verifica se as permissões foram concedidas
    if (hasCameraPermission === null || hasCameraPermission === false) {
        return(
            <View style={styles.container}>
                <Text style={styles.mainText}>O app precisa de acesso a camera.</Text>
                <TouchableOpacity style={styles.button} onPress={handlePermissions}>
                    <Text style={styles.buttonText}>Permitir</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Recebe os dados e define o estado
    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setBarCode(data);
    };

    const adicionarObjeto = async (novoObjeto) => {
        try {

            let arrayJson = [];
            // Recuperar a string JSON armazenada na chave.
            const jsonAntigo = await AsyncStorage.getItem('1');
            if( jsonAntigo !== null ){
                arrayJson = JSON.parse(jsonAntigo);
            }

            arrayJson.push(novoObjeto);

            console.log(arrayJson);

            await AsyncStorage.setItem('1', JSON.stringify(arrayJson));
        } catch (error) {
            console.error('Erro ao adicionar objeto:', error);
        }
        setScanned(false);
        setPreviousBarCode(barCode);
        setPreviousPrice(price);
        setBarCode('');
        setPrice('');
    };

    const handleDeletePress = async () => {
        try {
            Alert.alert(
                'Excluir Coleta',
                'Tem certeza que deseja excluir todos os dados?',
                [
                    {
                        text: 'Cancelar',
                        style: 'cancel'
                    },
                    {
                        text: 'OK',
                        onPress: async () => {
                            try {
                                await AsyncStorage.removeItem('1');
                                console.log('Item excluído com sucesso.');
                            } catch (e) {
                                console.log('Erro ao excluir item:', e);
                            }
                        }
                    }
                ]
            );
        } catch (e) {
          console.log('Erro ao exibir alerta:', e);
        }
    };

    const handleSharePress = async () => {
        try {
            // Recupera os dados armazenados no AsyncStorage
            const dados = await AsyncStorage.getItem('1');
        
            const dadosJson = JSON.parse(dados); // converte para JSON
        
            api.post('/coleta', dadosJson) // envia os dados convertidos para o servidor
            .then(function (res){
                console.log(res);
            })
            .catch(function (err) {
                console.log("Erro:"+err);
            });
      
        } catch (erro) {
            console.log('Erro:', erro.message);
        }
    };

    return(
        <View style={styles.container}>
            <TouchableOpacity
                onPress={handleSharePress}
                style={{
                    position: 'absolute',
                    top: 50,
                    right: 20,
                    padding: 15,
                    borderRadius: 25,
                    backgroundColor: '#363636',
                }}
                >
                <Icon name="share" size={20} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleDeletePress}
                style={{
                    position: 'absolute',
                    top: 50,
                    left: 20,
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: '#363636',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                >
            <Icon name="trash-o" size={25} color="#fff" />
            </TouchableOpacity>

            <View style={styles.barCodeBox}>
                <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={{ height: 700, width: 400 }}
                />
            </View>

            {scanned && ( // adiciona a condição para renderizar o TextInput somente se scanned for true
                <Controller
                    control={control}
                    name="price"
                    rules={{ required: true }}
                    defaultValue=""
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            style={styles.inputPrice}
                            onChangeText={(text) => setPrice(text)} // atualiza o valor do preço no estado
                            onBlur={onBlur}
                            value={price} // exibe o valor do preço do estado
                            placeholder="Valor do produto..."
                            placeholderTextColor={colors.lightGray}
                            keyboardType="numeric"
                        />
                    )}
                />
            )}
            <Text style={styles.mainText}>{`Código: ${previousBarCode} - Preço: ${previousPrice}`}</Text>
            {scanned && (

                <TouchableOpacity
                    style={[styles.saveButton, !price && styles.disabledButton]} 
                    // onPress={() => handleSubmit(handleSaveButtonPress({ price }))}
                    onPress={() => handleSubmit(adicionarObjeto({ codbar: barCode, price: price, idloja: 1 }))}
                    disabled={!price}>
                    <Icon name="save" size={20} color={colors.white} />
                    <Text style={styles.saveButtonText}>Gravar dados</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#1E1E1E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainText:{
        color: 'white',
        fontSize: 18,
        margin: 20,
    },
    barCodeBox:{
        alignItems: 'center',
        justifyContent: 'center',
        height: 350,
        width: 350,
        overflow: 'hidden',
        borderRadius: 30,
    },
    button: {
        marginTop: 100,
        height: 60,
        width: '90%',
        backgroundColor: '#ff0245',
        borderRadius: 20,
    },
    buttonText:{
        color: 'white',
        fontWeight: 'bold',
        fontSize: 25,
        padding: 10,
        textAlign: 'center',
    },
    inputPrice: {
        marginTop: 40,
        height: 50,
        width: '92%',
        backgroundColor: '#363636',
        borderRadius: 8,
        paddingHorizontal: 10,
        color: '#FFFFFF',
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0E6EB8',
        borderRadius: 8,
        width: '50%',
        height: 40,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginTop: 100,
    },
    saveButtonText: {
        color: '#FFFFFF',
        marginLeft: 5,
        fontWeight: 'bold',
    },
    disabledButton: {
        backgroundColor: '#363636',
        opacity: 0.6,
    },
});

const colors = {
    darkGray: '#1E1E1E',
    gray: '#363636',
    lightGray: '#9E9E9E',
    blue: '#0E6EB8',
    white: '#FFFFFF',
}