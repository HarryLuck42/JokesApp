import {
  Animated,
  Appearance,
  Button,
  FlatList,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { Colors } from "@/constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import categoriesSlice from "@/redux/categories-slice";
import { useEffect, useRef } from "react";

import axios from "axios";
import { AnimatedCircularProgress } from "react-native-circular-progress";

const CategoryItem = (props) => {
  useEffect(() => {
    if (props.item.isOpen) {
      getListJokes(props.item.name);
    }
  }, [props.item.isOpen]);

  const dispatch = useDispatch();

  const actions = categoriesSlice.actions;

  const animatedController = useRef(new Animated.Value(0)).current;

  const getListJokes = () => {
    console.log("fetching jokes for " + props.item.name);
    dispatch(actions.fetchJokes(props.index));
    axios
      .get(
        `https://v2.jokeapi.dev/joke/${props.item.name}?type=single&amount=10`
      )
      .then((response) => {
        console.log(response.data);
        dispatch(
          actions.fetchJokesSuccess({
            jokes: response.data.jokes,
            index: props.index,
          })
        );
      })
      .catch((error) => {
        console.log(error);
        dispatch(actions.fetchJokesFailure(props.index));
      });
  };

  const toggleAnimation = {
    duration: 300,
    update: {
      duration: 300,
      property: LayoutAnimation.Properties.opacity,
      type: LayoutAnimation.Types.easeInEaseOut,
    },
    delete: {
      duration: 200,
      property: LayoutAnimation.Properties.opacity,
      type: LayoutAnimation.Types.easeInEaseOut,
    },
  };
  const toggleListItem = () => {
    const config = {
      duration: 300,
      toValue: props.item.isOpen ? 0 : 1,
      useNativeDriver: true,
    };
    Animated.timing(animatedController, config).start();
    LayoutAnimation.configureNext(toggleAnimation);
    dispatch(actions.openChild(props.index));
  };

  const arrowTransform = animatedController.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  });

  const colorScheme = Appearance.getColorScheme();

  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  const styles = createStyles(theme, colorScheme);

  const separatorComp = <View style={styles.separator} />;

  return (
    <View style={styles.column}>
      <View style={styles.row}>
        <View style={styles.menuTextRow}>
          <Text style={styles.menuItemTitle}>{props.item.name}</Text>
        </View>
        <View style={styles.buttonTop}>
          {props.index === 0 ? (
            <Text style={styles.topText}>Top</Text>
          ) : (
            <Button
              color={theme.primaryBackground}
              title={"Go Top"}
              onPress={() => {
                console.log("Viewing " + props.item);
                dispatch(
                  actions.goToTop({ item: props.item, index: props.index })
                );
              }}
            />
          )}
        </View>
        <View style={styles.arrowIcon}>
          {
            <TouchableOpacity
              key={props.index}
              onPress={() => {
                toggleListItem();
              }}
            >
              <Animated.View
                style={{ transform: [{ rotate: arrowTransform }] }}
              >
                <IconSymbol
                  name="chevron.right"
                  size={35}
                  weight="medium"
                  color={theme.icon}
                />
              </Animated.View>
            </TouchableOpacity>
          }
        </View>
      </View>
      {props.item.isOpen && props.item.isLoading ? (
        <View style={styles.loadingView}>
          <AnimatedCircularProgress
            size={20}
            width={2}
            fill={100}
            tintColor={theme.primary}
            onAnimationComplete={() => console.log("onAnimationComplete")}
            backgroundColor={theme.primaryBackground}
          />
          <Text style={{ marginTop: 16 }}>Loading...</Text>
        </View>
      ) : (
        props.item.isOpen && (
          <View style={[styles.list]}>
            <FlatList
              data={props.item.jokes}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.contentContainer}
              ItemSeparatorComponent={separatorComp}
              ListEmptyComponent={
                !props.item.isLoading && (
                  <View style={styles.loadingView}>
                    <Text>No items</Text>
                  </View>
                )
              }
              renderItem={({ item, index }) => {
                return <Text style={styles.jokeText}>{item.joke}</Text>;
              }}
            />
          </View>
        )
      )}
    </View>
  );
};

export default CategoryItem;

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    hidden: {
      height: 0,
    },
    list: {
      overflow: "hidden",
    },
    separator: {
      height: 1,
      maxWidth: 500,
      backgroundColor: theme.border,
      marginHorizontal: 16,
      marginBottom: 10,
    },
    contentContainer: {
      paddingTop: 10,
      paddingBottom: 20,
      paddingHorizontal: 12,
      backgroundColor: theme.background,
    },
    loadingView: {
      width: "100%",
      height: "100",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },
    column: {
      flexDirection: "column",
      width: "100%",
      maxWidth: 600,
      borderRadius: 16,
      elevation: 8,
      backgroundColor: theme.background,
      shadowOffset: { width: 1, height: 1 },
      shadowColor: "#333",
      shadowOpacity: 0.3,
      shadowRadius: 2,
    },
    row: {
      flexDirection: "row",
      width: "100%",
      maxWidth: 600,
      marginBottom: 10,
      overflow: "hidden",
      marginHorizontal: "auto",
      marginHorizontal: 4,
      marginVertical: 6,
    },
    menuTextRow: {
      width: "45%",
      paddingTop: 16,
      paddingLeft: 16,
      paddingBottom: 16,
      paddingRight: 16,
    },
    buttonTop: {
      width: "25%",
      maxWidth: 100,
      justifyContent: "center",
      alignItems: "center",
    },
    arrowIcon: {
      width: "25%",
      justifyContent: "center",
      alignItems: "flex-end",
    },
    menuItemTitle: {
      fontSize: 18,
      color: theme.text,
    },
    topText: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "bold",
    },
    jokeText: {
      fontSize: 18,
      fontWeight: "bold",
      marginVertical: 10,
      marginHorizontal: 16,
    },
  });
}
