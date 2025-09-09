import React, { useState, useEffect } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { COLOUR } from '../../styles';

type PropsType = { step: number; steps: number; height: number; colour: string; };
export default function ProgressBar({ step, steps, height, colour }: PropsType) {

    const animatedValue = React.useRef(new Animated.Value(-500)).current;
    const reactive = React.useRef(new Animated.Value(-500)).current;
    const [width, setWidth] = useState(0);

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: reactive,
            duration: 0,
            useNativeDriver: true,
        }).start();
        reactive.setValue(-width + (width * step) / steps);
    }, [step, width]);

    return (
        <View style={styles.container}>
            <View style={{
                height,
                backgroundColor: COLOUR.gray[200],
                borderRadius: height,
                overflow: 'hidden',
            }}>
                {step > 5 && (
                 <Animated.View
                    onLayout={e => {
                        const newWidth = e.nativeEvent.layout.width;
                        setWidth(newWidth);
                    }}
                    style={{
                        height,
                        borderRadius: height,
                        backgroundColor: colour,
                        width: '100%',
                        position: 'absolute',
                        transform: [{
                            translateX: animatedValue,
                        }]
                    }} 
                />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
});