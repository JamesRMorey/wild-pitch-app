import { View, Text, StyleSheet } from 'react-native';
import { TEXT } from '../../styles';
import IconButton from '../buttons/icon-button';
import { normalise } from '../../functions/helpers';


export default function Header({ title, onBack } : { title: string, onBack?: ()=>void }) {

    return (
        <View style={styles.container}>
            {onBack &&
            <IconButton
                icon={'chevron-back-outline'}
                onPress={() => onBack()}
                iconOnly={true}
                small={true}
            />
            }
            <Text style={styles.title}>{title}</Text>
            {onBack &&
            <View style={styles.spacer}></View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: normalise(15)
    },
    title: {
        ...TEXT.h4,
        textAlign: 'center'
    },
    spacer: {
        width: normalise(20)
    }
})