import { View, Text, StyleSheet } from 'react-native';
import { TEXT } from '../../styles';
import IconButton from '../../components/buttons/icon-button';
import { normalise } from '../../utils/helpers';


export default function Header({ title, onBack } : { title: string, onBack?: ()=>void }) {

    return (
        <View style={styles.container}>
            {onBack &&
            <View style={styles.back}>
                <IconButton
                    icon={'chevron-left'}
                    onPress={() => onBack()}
                    iconOnly={true}
                    small={true}
                />
            </View>
            }
            <Text style={styles.title}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: normalise(25),
        marginTop: normalise(10)
    },
    title: {
        ...TEXT.h4,
        textAlign: 'center',
    },
    back: {
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: [{ translateY: '-50%' }]
    }
})