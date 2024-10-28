import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CustomButton from './CardButton';
import { useCart } from '../context/CartContext';

const ClassItem = ({ yogaClass, onPress, bookedClasses }) => {
    const { addToCart, cartItems } = useCart();
    const isInCart = cartItems.some(item => item.id === yogaClass.id);
    const isBooked = bookedClasses.some(booking =>
        booking.classId === yogaClass.id
    );
    return (
        <View style={styles.card}>
            <View style={styles.container}>
                <Text style={styles.title}>{yogaClass.id}</Text>
                <Text style={styles.subTitle}>Yoga class: {yogaClass.id}</Text>

                <View style={styles.row}>
                    <Text style={styles.info}>Day of week: {yogaClass.dayOfWeek}</Text>
                    <Text style={styles.info}>Teacher: {yogaClass.teacher}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.info}>Type: {yogaClass.type}</Text>
                    <Text style={styles.info}>Time: {yogaClass.time}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.info}>Duration: {yogaClass.duration} minutes</Text>
                    <Text style={styles.info}>Capacity: {yogaClass.capacity}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.info}>Price: ${yogaClass.price}</Text>
                </View>

                <View style={styles.row}>
                    <Text style={styles.info}>Description: {yogaClass.description}</Text>
                    <CustomButton
                        title={isBooked ? 'Booked' : isInCart ? 'Added to Cart' : 'Add to Cart'}
                        icon={isBooked ? "save" : "cart"}
                        onPress={() => addToCart(yogaClass)}
                        disable={isInCart || isBooked}
                        style={[
                            isBooked ? styles.bookedButton : isInCart ? styles.addedButton : styles.defaultButton,
                            isBooked ? { backgroundColor: '#4CAF50' } : null // Màu nền cho nút "Booked"
                        ]}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFCCCC',
        margin: 10,
        borderRadius: 10,
        elevation: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    container: {
        flexDirection: 'column',
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#004085',
    },
    subTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 8,
        color: '#004085',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    info: {
        fontSize: 12,
        color: '#004085',
    },
    bookedButton: {
        backgroundColor: '#004085', 
    },

    addedButton: {
        backgroundColor: '#FFC107', // Màu nền cho nút "Added to Cart"
    },
    defaultButton: {
        backgroundColor: '#007bff', // Màu nền cho nút mặc định
    },
});

export default ClassItem;
