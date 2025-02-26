import React from "react";
import {
  Appearance,
  Button,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { useDispatch, useSelector } from "react-redux";
import categoriesSlice from "@/redux/categories-slice";
import { useEffect } from "react";

import axios from "axios";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Fonts } from "@/constants/Fonts";
import { IconSymbol } from "./IconSymbol";

const CategoryItem = (props) => {
  const dispatch = useDispatch();

  const actions = categoriesSlice.actions;

  useEffect(() => {
    if (props.item.isOpen) {
      if (props.item.jokes.length == 0) {
        getListJokes();
      }
    }
  }, [props.item.isOpen]);

  const showDialog = (value) => dispatch(actions.showDialog(value));

  const hideDialog = () => dispatch(actions.showDialog(null));

  const getListJokes = () => {
    const isReload = props.item.jokes.length == 0;
    if (isReload) {
      dispatch(actions.fetchJokes(props.index));
    }

    axios
      .get(
        `https://v2.jokeapi.dev/joke/${props.item.name}?type=single&amount=2`
      )
      .then((response) => {
        console.log(`hasil api:`);
        console.log(response.data.jokes);
        if (isReload) {
          dispatch(
            actions.fetchJokesSuccess({
              jokes: response.data.jokes,
              index: props.index,
            })
          );
        } else {
          dispatch(
            actions.addJokes({
              jokes: response.data.jokes,
              index: props.index,
            })
          );
        }
      })
      .catch((error) => {
        dispatch(actions.fetchJokesFailure(props.index));
      });
  };

  const rotate = useSharedValue(props.item.isOpen ? 90 : 270);
  const rotateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotate.value}deg` }],
    };
  });

  const colorScheme = Appearance.getColorScheme();

  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  const styles = createStyles(theme, colorScheme);

  const detail = useSelector((state) => state.categories.detail);

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
                dispatch(actions.openChild(props.index));
                if (props.item.isOpen) {
                  rotate.value = withTiming(270, { duration: 300 });
                } else {
                  rotate.value = withTiming(90, { duration: 300 });
                }
              }}
            >
              <Animated.View style={rotateStyle}>
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
                console.log(`joke item: ${item.joke}`);
                return (
                  <Pressable
                    onPress={() => {
                      showDialog(item.joke);
                    }}
                  >
                    <View>
                      <Text style={styles.jokeText}>{item.joke}</Text>
                    </View>
                  </Pressable>
                );
              }}
            />
            {props.item.jokes.length < 5 && (
              <View style={styles.buttonAddView}>
                <Button
                  color={theme.primaryBackground}
                  title={"Add more data"}
                  onPress={() => {
                    getListJokes();
                  }}
                />
              </View>
            )}

            <Modal
              visible={detail != null}
              animationType="fade"
              transparent={true}
            >
              <View style={styles.centerDialog}>
                <View style={styles.modalView}>
                  <Text style={styles.modalTitle}>Detail</Text>
                  <Text style={styles.modalText}>{detail}</Text>
                  <View style={styles.buttonOkView}>
                    <TouchableOpacity onPress={hideDialog}>
                      <Text style={styles.buttonOkText}>OK</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        )
      )}
    </View>
  );
};

export default CategoryItem;

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    buttonAddView: {
      marginVertical: 10,
      marginHorizontal: 16,
    },
    centerDialog: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalView: {
      width: "80%",
      backgroundColor: theme.background,
      padding: 16,
      borderRadius: 20,
      shadowColor: "#333",
      elevation: 16,
    },
    modalTitle: {
      fontSize: 26,
      marginBottom: 10,
      width: "100%",
      textAlign: "center",
      color: theme.primaryBackground,
      fontFamily: Fonts.bold,
    },
    modalText: {
      fontSize: 20,
      marginBottom: 10,
      color: theme.icon,
      fontFamily: Fonts.mediumItalic,
    },
    buttonOkView: {
      alignItems: "flex-end",
      paddingHorizontal: 10,
    },
    buttonOkText: {
      fontSize: 20,
      fontFamily: Fonts.bold,
      color: theme.primaryBackground,
    },
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
      fontSize: 20,
      fontFamily: Fonts.regular,
      color: theme.text,
    },
    topText: {
      color: theme.text,
      fontSize: 18,
      fontFamily: Fonts.medium,
    },
    jokeText: {
      fontSize: 18,
      fontFamily: Fonts.bold,
      marginVertical: 10,
      marginHorizontal: 16,
    },
  });
}
