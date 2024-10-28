import { ActivityIndicator, StyleSheet, Text, View, TextInput, ScrollView, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import ClassItem from '../components/ClassItem'
import { collection, getDocs, query } from 'firebase/firestore';
import { db, dbName } from '../firebase.config';
import { colors } from '../themes/colors';
import RNPickerSelect from 'react-native-picker-select';

const HomeScreen = ({ route }) => {
   const [yogaClasses, setYogaClasses] = useState([]);
   const [loading, setLoading] = useState(true);
   const [bookedClasses, setBookedClasses] = useState([]);
   const [searchText, setSearchText] = useState('');
   const [filterType, setFilterType] = useState('All');
   const [filteredClasses, setFilteredClasses] = useState([]);
   const [refreshing, setRefreshing] = useState(false);

   const filterOptions = [
       { label: 'All', value: 'All' },
       { label: 'Time', value: 'Time' },
       { label: 'Day of Week', value: 'Day of Week' },
       { label: 'Teacher', value: 'Teacher' },
   ];

   const handleRefresh = async () => {
       setRefreshing(true);
       await fetchBookedClasses();
       await fetchData();
       setRefreshing(false);
   };

   const fetchData = async () => {
       setLoading(true);
       try {
           const q = query(collection(db, dbName));
           const querySnapshot = await getDocs(q);
           const documents = [];
           querySnapshot.forEach((doc) => {
               documents.push({
                   id: doc.id,
                   ...doc.data()
               });
           });
           setYogaClasses(documents);
           setFilteredClasses(documents);
       } catch (error) {
           console.error("Error fetching data: ", error);
       } finally {
           setLoading(false);
       }
   }

   const fetchBookedClasses = async () => {
       try {
           const bookingsRef = collection(db, 'bookings');
           const bookingsSnapshot = await getDocs(bookingsRef);
           const bookings = [];
           bookingsSnapshot.forEach((doc) => {
               bookings.push(doc.data());
           });
           setBookedClasses(bookings);
       } catch (error) {
           console.error("Error fetching bookings: ", error);
       }
   };

   useEffect(() => {
       fetchData();
       fetchBookedClasses();
   }, [route?.params?.refresh]);

   useEffect(() => {
       let result = [...yogaClasses];

       if (searchText) {
           const searchQuery = searchText.toLowerCase().trim();
           switch (filterType) {
               case 'Teacher':
                   result = result.filter(yogaClass =>
                       yogaClass.teacher && yogaClass.teacher.toLowerCase().includes(searchQuery)
                   );
                   break;

               case 'Time':
                   result = result.filter(yogaClass =>
                       yogaClass.time && yogaClass.time.toLowerCase().includes(searchQuery)
                   );
                   break;

               case 'Day of Week':
                   result = result.filter(yogaClass =>
                       yogaClass.dayOfWeek && yogaClass.dayOfWeek.toLowerCase().includes(searchQuery)
                   );
                   break;

               default: // case 'All'
                   result = result.filter(yogaClass => (
                       (yogaClass.teacher && yogaClass.teacher.toLowerCase().includes(searchQuery)) ||
                       (yogaClass.time && yogaClass.time.toLowerCase().includes(searchQuery)) ||
                       (yogaClass.dayOfWeek && yogaClass.dayOfWeek.toLowerCase().includes(searchQuery)) ||
                       String(yogaClass.id).toLowerCase().includes(searchQuery) ||
                       (yogaClass.description && yogaClass.description.toLowerCase().includes(searchQuery)) ||
                       (yogaClass.type && yogaClass.type.toLowerCase().includes(searchQuery)) ||
                       String(yogaClass.duration).includes(searchQuery) ||
                       String(yogaClass.capacity).includes(searchQuery) ||
                       String(yogaClass.price).includes(searchQuery)
                   ));
           }
       }

       setFilteredClasses(result);
   }, [searchText, filterType, yogaClasses]);

   return (
       <View style={styles.container}>
           <View style={styles.header}>
               <TextInput
                   style={styles.searchInput}
                   placeholder="Search classes..."
                   placeholderTextColor="#888"
                   value={searchText}
                   onChangeText={setSearchText}
               />
               <View style={styles.pickerContainer}>
                   <RNPickerSelect
                       onValueChange={(itemValue) => setFilterType(itemValue)}
                       items={filterOptions.map(option => ({
                           label: option.label,
                           value: option.value
                       }))}
                       value={filterType}
                       style={{
                           inputAndroid: styles.pickerInput,
                           inputIOS: styles.pickerInput,
                       }}
                   />
               </View>
           </View>

           <ScrollView style={styles.classesContainer}
               refreshControl={
                   <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
               }
           >
               {
                    filteredClasses.map((yogaClass) => (
                        <ClassItem
                            key={yogaClass.id}
                            onPress={() => onPress(yogaClass)}
                            yogaClass={yogaClass}
                            bookedClasses={bookedClasses}
                            style={styles.classItem}
                        />
                    ))
                }
           </ScrollView>
       </View>
   )
}

export default HomeScreen;

const styles = StyleSheet.create({
   container: {
       flex: 1,
       backgroundColor: '#f8f9fa', // Màu nền sáng hơn
   },
   header: {
       padding: 16,
       flexDirection: 'row',
       alignItems: 'center',
       borderBottomWidth: 1,
       borderBottomColor: '#ddd',
       backgroundColor: '#007bff', // Màu nền nổi bật cho header
   },
   searchInput: {
       flex: 1,
       height: 40,
       borderWidth: 1,
       borderColor: '#007bff', // Đổi màu viền
       borderRadius: 8,
       paddingHorizontal: 12,
       marginRight: 8,
       backgroundColor: '#ffffff', // Màu nền sáng cho input
   },
   pickerContainer: {
       width: 120,
       borderWidth: 1,
       borderColor: '#007bff', // Đổi màu viền
       borderRadius: 8,
       overflow: 'hidden',
       backgroundColor: '#ffffff', // Màu nền sáng cho picker
   },
   pickerInput: {
       height: 40,
       borderWidth: 1,
       borderColor: '#ddd',
       borderRadius: 8,
       paddingHorizontal: 12,
       color: '#333', // Màu chữ tối cho picker
   },
   classesContainer: {
       flex: 1,
       padding: 16,
   },
   classItem: {
       backgroundColor: '#ffffff', // Màu nền sáng cho mỗi item
       padding: 16,
       borderRadius: 8,
       marginVertical: 8,
       shadowColor: '#000',
       shadowOffset: {
           width: 0,
           height: 2,
       },
       shadowOpacity: 0.2,
       color: '#004085',
       shadowRadius: 2,
       elevation: 2, // Để tạo hiệu ứng đổ bóng
   },
});
