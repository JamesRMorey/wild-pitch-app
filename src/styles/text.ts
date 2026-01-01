import { StyleSheet } from "react-native";
import { normalise } from "../utils/helpers";


export const text = StyleSheet.create({
    p: {
        fontSize: normalise(12),
    },
    h1: {
        fontSize: normalise(24),
        fontWeight: 600
    },
    h2: {
        fontSize: normalise(21),
        fontWeight: 600
    },
    h3: {
        fontSize: normalise(18),
        fontWeight: 600
    },
    h4: {
        fontSize: normalise(15),
        fontWeight: 600
    },
    label: {
        fontSize: normalise(15),
        fontWeight: 500,
        marginBottom: normalise(5)
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
    },
    bold: {
        fontWeight: 800
    },
    semiBold: {
        fontWeight: 700
    },
    medium: {
        fontWeight: 600
    },
    thin: {
        fontWeight: 300
    },
    center: {
        textAlign: 'center'
    }
})