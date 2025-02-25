
import {
  StyleSheet, SafeAreaView, View, Text, Appearance, Image
} from 'react-native';
import { Link } from 'expo-router';

import { Colors } from '@/constants/Colors';

import myPhoto from "@/assets/images/my-photo.webp"

export default function ContactScreen() {
  const colorScheme = Appearance.getColorScheme();

  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;

  const imgColor = colorScheme === 'dark' ? 'papayawhip' : '#333';

  const styles = createStyles(theme, colorScheme);

  return (

    <SafeAreaView style={styles.container}>

      <View style={styles.imgContainer}>
        <Image
                source={myPhoto}
                resizeMode="cover"
                style={styles.image}
              />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Hariyanto Lukman</Text>

        <View style={styles.textView}>
          <Text style={styles.text}>
            <Text>Lulusan Teknik Komputer UNDIP 2017</Text>{'\n'}
            <Text>Subang, 30 Desember 1994</Text>
          </Text>
        </View>

        <View style={styles.textView}>
          <Text style={styles.text}>
            Phone:{'\n'}
            <Link href="tel:08569174562" style={styles.link}>085691745672</Link>{'\n'}
            or{' '}
            <Link href="sms:08569174562" style={styles.link}>Click Here to Text!</Link>
          </Text>
        </View>

        <View style={styles.textView}>
          <Text style={styles.text}>
            Email:{'\n'}
            <Text>hariyantosubang@gmail.com</Text>{'\n'}
          </Text>
        </View>

      </View>

    </SafeAreaView>
  );
}

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.background,
      paddingTop: 0,
      flexGrow: 1
    },
    imgContainer: {
      backgroundColor: colorScheme === 'dark' ? '#353636' : '#D0D0D0',
      height: 250,
    },
    textContainer: {
      backgroundColor: theme.background,
      padding: 12,
    },
    title: {
      color: theme.text,
      fontSize: 24,
      fontWeight: 'bold',
      lineHeight: 32,
      marginBottom: 10,
    },
    textView: {
      marginBottom: 10,
    },
    text: {
      color: theme.text,
      fontSize: 16,
      lineHeight: 24,
    },
    link: {
      textDecorationLine: 'underline',
    },
    image: {
        width: '100%',
        height: '100%',
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
      },
  });
}