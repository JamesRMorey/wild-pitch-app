import { StyleSheet } from "react-native";
import { normalise } from "../functions/helpers";


export const text = StyleSheet.create({
    p: {
        fontSize: normalise(12),
    },
    h1: {
        fontSize: normalise(24),
        fontWeight: 500
    },
    h2: {
        fontSize: normalise(21),
        fontWeight: 500
    },
    h3: {
        fontSize: normalise(18),
        fontWeight: 500
    },
    h4: {
        fontSize: normalise(15),
        fontWeight: 500
    },
    xxl: {
        fontSize: normalise(40),
    },
    xl: {
        fontSize: normalise(30),
    },
    lg: {
        fontSize: normalise(18),
    },
    md: {
        fontSize: normalise(14),
    },
    sm: {
        fontSize: normalise(12),
    },
    xs: {
        fontSize: normalise(10),
    },
    xxs: {
        fontSize: normalise(8),
    }
})