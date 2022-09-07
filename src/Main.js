import React, { useEffect, useState } from "react";
import { Button, TextInput, View } from 'react-native';
import RNZebraBluetoothPrinter from 'react-native-zebra-bluetooth-printer';

const ZEBRA_PRINTER_NAME = 'XXXXJ103300669'
const ZEBRA_PRINTER_ADDRESS = '00:22:58:0E:6D:98'

function Main() {
    const [textInput, setTextInput] = useState('')
    const [zebraPrinter, setZebraPrinter] = useState({})

    const onChangeTextInput = (text) => {
        setTextInput(text)
    }

    async function print() {
        const zpl = "^XA^FX Top section with company logo, name and address.^CF0,60^FO50,50^GB100,100,100^FS^ FO75,75 ^ FR ^ GB100, 100, 100 ^ FS^ FO88, 88 ^ GB50, 50, 50 ^ FS ^XZ";

        RNZebraBluetoothPrinter.print(ZEBRA_PRINTER_ADDRESS, 'zpl').then((res) => {
            console.log("print: ", res);
        }).catch((error) => {
            console.log(error.message)
        });
    }

    const onPrintBtnPress = async () => {
        console.log('onPrintBtnPress', zebraPrinter.address)

        print();

        // const zpl = "^XA^FX Top section with company logo, name and address.^CF0,60^FO50,50^GB100,100,100^FS^ FO75,75 ^ FR ^ GB100, 100, 100 ^ FS^ FO88, 88 ^ GB50, 50, 50 ^ FS ^XZ";

        // await RNZebraBluetoothPrinter.print(zebraPrinter.address, zpl).then((res) => {
        //     console.log('print', res)
        // }).catch(err => {
        //     console.log('print err', err)
        // })

        // const zplArray = [zpl]

        // await RNZebraBluetoothPrinter.printBulk(zebraPrinter.address, zplArray).then((res) => {
        //     console.log('printBulk', res)
        // }).catch(err => {
        //     console.log('printBulk err', err)
        // })
    }

    const connectToZebraPrinter = async () => {
        const isEnabledBluetooth = await RNZebraBluetoothPrinter.isEnabledBluetooth().then((res) => {
            return res
        }).catch(err => {
            console.log('isEnabledBluetooth err', err)
        })

        if (isEnabledBluetooth) {
            const pairedDevices = await RNZebraBluetoothPrinter.pairedDevices().then((deviceArray) => {
                return deviceArray
            }).catch(err => {
                console.log('pairedDevices err', err)
            })

            if (pairedDevices.length) {
                const zebraPrinterPaired = pairedDevices.find(device => device.name === ZEBRA_PRINTER_NAME)

                if (zebraPrinterPaired) {
                    setZebraPrinter(zebraPrinterPaired)
                    const isConnectedZebraPrinter = await RNZebraBluetoothPrinter.connectDevice(zebraPrinterPaired.address).then((res) => {
                        return res
                    }).catch(err => {
                        console.log('connectDevice err', err)
                    })

                    if (isConnectedZebraPrinter) {
                        console.log('Connected to Zebra Printer', isConnectedZebraPrinter)
                    } else {
                        console.log('Could not connect to Zebra Printer', isConnectedZebraPrinter)
                    }
                } else {
                    console.log('Pair Zebra Printer with Bluetooth')
                }
            }
        } else {
            await RNZebraBluetoothPrinter.enableBluetooth().then((res) => {
                console.log('enableBluetooth', res)
            }).catch(err => {
                console.log('enableBluetooth err', err)
            })
        }
    }

    const onComponentLoad = async () => {
        // await connectToZebraPrinter()

        // RNZebraBluetoothPrinter.print(ZEBRA_PRINTER_ADDRESS, 'zpl').then((res) => {
        //     console.log("print: ", res);
        // }).catch((error) => {
        //     console.log(error.message)
        // });
    }

    // useEffect(() => {
    // console.log('textInput', textInput)
    // }, [textInput])

    useEffect(() => {
        onComponentLoad()

        // RNZebraBluetoothPrinter.isEnabledBluetooth().then((res) => {
        //     RNZebraBluetoothPrinter.connectDevice(ZEBRA_PRINTER_ADDRESS).then((res) => {
        //         const zpl = "^XA^FX Top section with company logo, name and address.^CF0,60^FO50,50^GB100,100,100^FS^ FO75,75 ^ FR ^ GB100, 100, 100 ^ FS^ FO88, 88 ^ GB50, 50, 50 ^ FS ^XZ";

        //         RNZebraBluetoothPrinter.print(ZEBRA_PRINTER_ADDRESS, zpl).then((res) => {
        //             console.log("print: ", res);
        //         }).catch((error) => {
        //             console.log(error.message)
        //         });
        //     }).catch(err => {
        //         console.log('connectDevice err', err)
        //     })
        // }).catch(err => {
        //     console.log('isEnabledBluetooth err', err)
        // })
    }, [])

    return (
        <View>
            <TextInput onChangeText={onChangeTextInput} />
            <Button title={"Print"} onPress={onPrintBtnPress} />
        </View>
    )
}

export default Main