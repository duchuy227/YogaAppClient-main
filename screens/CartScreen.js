import { useCart } from '../context/CartContext';
import { Text, TouchableOpacity, StyleSheet, View, TextInput, ScrollView, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { colors } from '../themes/colors';
import { useState } from 'react';
import Ionicons from "@expo/vector-icons/Ionicons";
import { addDoc, collection, doc, runTransaction, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
    const { cartItems, removeFromCart, clearCart } = useCart();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();

    const handleCheckout = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email');
            return;
        }

        setIsLoading(true);
        try {
            for (const classItem of cartItems) {
                // Get reference to the yoga class document
                const classRef = doc(db, 'yoga_classes', classItem.id.toString());

                // Run the transaction
                await runTransaction(db, async (transaction) => {
                    const classDoc = await transaction.get(classRef);

                    if (!classDoc.exists()) {
                        throw new Error('Class does not exist!');
                    }

                    const classData = classDoc.data();

                    // Check if there's still capacity available
                    if (classData.capacity <= 0) {
                        throw new Error(`Class ${classItem.dayOfWeek} ${classItem.time} is full!`);
                    }

                    // Update the capacity
                    transaction.update(classRef, {
                        capacity: classData.capacity - 1
                    });

                    // Add the booking
                    const bookingRef = collection(db, 'bookings');
                    transaction.set(doc(bookingRef), {
                        classId: classItem.id,
                        userEmail: email,
                        bookingDate: new Date().toISOString(),
                        status: 'success',
                        dayOfWeek: classItem.dayOfWeek,
                        time: classItem.time,
                        teacher: classItem.teacher
                    });
                });
            }

            clearCart();
            setEmail('');
            Alert.alert('Success', 'Classes booked successfully!', [
                {
                    text: 'OK',
                    onPress: () => {
                        navigation.navigate('Home', { refresh: true });
                    }
                }
            ]);
        } catch (error) {
            console.error('Booking error:', error);
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 20}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    <ScrollView style={styles.cartList}>
                        {cartItems.map((item) => (
                            <View key={item.id} style={styles.cartItem}>
                                <View style={styles.row}>
                                    <Text style={styles.title}>Day:</Text>
                                    <Text style={styles.content}>{item.dayOfWeek}</Text>
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.title}>Time:</Text>
                                    <Text style={styles.content}>{item.time}</Text>
                                </View>

                                <View style={styles.row}>
                                    <Text style={styles.title}>Teacher:</Text>
                                    <Text style={styles.content}>{item.teacher}</Text>
                                </View>

                                <TouchableOpacity
                                    onPress={() => removeFromCart(item.id)}
                                    style={styles.removeButton}
                                    disabled={isLoading}
                                >
                                    <Ionicons
                                        name="trash-outline"
                                        size={20}
                                        color="white"
                                    />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                    <View style={styles.checkoutContainer}>
                        <TextInput
                            style={styles.emailInput}
                            placeholder="Enter your email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            editable={!isLoading}
                        />
                        <TouchableOpacity
                            style={[
                                styles.checkoutButton,
                                (!cartItems.length || isLoading) && styles.checkoutButtonDisabled
                            ]}
                            onPress={handleCheckout}
                            disabled={!cartItems.length || isLoading}
                        >
                            <Text style={styles.checkoutButtonText}>
                                {isLoading ? 'Booking...' : `Book Classes (${cartItems.length})`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    cartList: {
        flex: 1,
        padding: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 4,
        marginBottom: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
    },
    content: {
        fontSize: 18,
    },
    cartItem: {
        padding: 16,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
        marginBottom: 12,
    },
    removeButton: {
        backgroundColor: colors.red,
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 'auto',
    },
    removeButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    checkoutContainer: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    emailInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 12,
    },
    checkoutButton: {
        backgroundColor: colors.primary.DEFAULT,
        padding: 16,
        borderRadius: 8,
    },
    checkoutButtonDisabled: {
        backgroundColor: colors.grey,
    },
    checkoutButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

export default CartScreen;