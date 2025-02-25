import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
} from "react-native";
import { Link } from "expo-router";

import minionsImg from "@/assets/images/minions.webp";

const app = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={minionsImg}
        resizeMode="contain"
        style={styles.image}
      >
        <Text style={styles.title}>Have a Fun!!</Text>

        <Link href="/menu" style={{ marginHorizontal: "auto" }} asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>List Jokes</Text>
          </Pressable>
        </Link>

        <Link href="/contact" style={{ marginHorizontal: "auto" }} asChild>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Contact Us</Text>
          </Pressable>
        </Link>
      </ImageBackground>
    </View>
  );
};

export default app;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  image: {
    width: "100%",
    height: "100%",
    flex: 1,
    justifyContent: "center",
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    marginBottom: 70,
  },
  link: {
    color: "white",
    fontSize: 42,
    fontWeight: "bold",
    textAlign: "center",
    textDecorationLine: "underline",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 4,
  },
  button: {
    height: 60,
    width: 150,
    borderRadius: 20,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.75)",
    padding: 6,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    padding: 4,
  },
});
