import React, { useRef, useState, useEffect } from 'react';
import {
View,
StyleSheet,
ScrollView,
Image,
Dimensions,
Text,
} from 'react-native';

const { width } = Dimensions.get('window');

const bannerImages = [
require('../../assets/images/banner.png'),
require('../../assets/images/h2.jpeg'),
require('../../assets/images/h3.jpeg'),
require('../../assets/images/h4.jpeg'),
];


const Home = () => {
const scrollRef = useRef();
const [currentIndex, setCurrentIndex] = useState(0);
const timerRef = useRef(null);
const userScrolling = useRef(false);

useEffect(() => {
startAutoScroll();
return () => stopAutoScroll();
}, [currentIndex]);

const startAutoScroll = () => {
stopAutoScroll();
timerRef.current = setInterval(() => {
if (!userScrolling.current) {
const nextIndex = (currentIndex + 1) % bannerImages.length;
scrollRef.current?.scrollTo({
x: nextIndex * width,
animated: true,
});
setCurrentIndex(nextIndex);
}
}, 3000);
};

const stopAutoScroll = () => {
if (timerRef.current) {
clearInterval(timerRef.current);
timerRef.current = null;
}
};

const handleScroll = (event) => {
const slide = Math.round(event.nativeEvent.contentOffset.x / width);
setCurrentIndex(slide);
};

return (
<View style={styles.container}>
<ScrollView
ref={scrollRef}
horizontal
pagingEnabled
showsHorizontalScrollIndicator={false}
onScroll={handleScroll}
scrollEventThrottle={16}
onTouchStart={() => {
userScrolling.current = true;
stopAutoScroll();
}}
onTouchEnd={() => {
userScrolling.current = false;
startAutoScroll();
}}
>
{bannerImages.map((img, index) => (
<Image key={index} source={img} style={styles.banner} />
))}
</ScrollView>
<View style={styles.dotsContainer}>
{bannerImages.map((_, index) => (
<Text
key={index}
style={currentIndex === index ? styles.dotActive : styles.dot}
>
●
</Text>
))}
</View>
</View>
);
};

const styles = StyleSheet.create({
container: {
margin:20,
},
banner: {
width: width,
height: 180,
resizeMode: 'stretch',
},
dotsContainer: {
flexDirection: 'row',
justifyContent: 'center',
marginTop: 6,
},
dot: {
color: '#bbb',
fontSize: 12,
marginHorizontal: 4,
},
dotActive: {
color: '#c00',
fontSize: 12,
marginHorizontal: 4,
},
});

export default Home;