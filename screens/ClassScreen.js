import { StyleSheet, Text, View, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';
import { colors } from '../themes/colors';

const ClassScreen = () => {
  const [bookedClasses, setBookedClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookedClasses = async () => {
    setLoading(true);
    try {
      const bookingsRef = collection(db, 'bookings');
      const bookingsSnapshot = await getDocs(bookingsRef);
      const bookings = [];
      bookingsSnapshot.forEach((doc) => {
        bookings.push(doc.data());
      });
      setBookedClasses(bookings);
    } catch (error) {
      console.error("Error fetching booked classes: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchBookedClasses();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchBookedClasses();
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      ) : (
        <ScrollView
          style={styles.bookedList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {bookedClasses.map((bookedClass, index) => (
            <View key={index} style={styles.classItem}>
              <Text style={styles.classTitle}>ID: {bookedClass.classId}</Text>
              <Text style={styles.classTitle}>Day: {bookedClass.dayOfWeek}</Text>
              <Text style={styles.classDetail}>Time: {bookedClass.time}</Text>
              <Text style={styles.classDetail}>Teacher: {bookedClass.teacher}</Text>
              <Text style={styles.classDetail}>Booking Date: {new Date(bookedClass.bookingDate).toLocaleDateString()}</Text>
              <Text style={styles.classDetail}>Email: {bookedClass.userEmail}</Text>
              <Text style={styles.classDetail}>Status: {bookedClass.status}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default ClassScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  bookedList: {
    flex: 1,
  },
  classItem: {
    backgroundColor: '#99CCFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  classTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6600',
    marginBottom: 8,
  },
  classDetail: {
    fontSize: 16,
    color: '#004085',
    marginBottom: 4,
  },
});
