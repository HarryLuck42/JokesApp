import {
  StyleSheet,
  Appearance,
  Platform,
  SafeAreaView,
  ScrollView,
  FlatList,
  View,
  Text,
  RefreshControl,
} from "react-native";

import { Colors } from "@/constants/Colors";
import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import categoriesSlice from "../../redux/categories-slice";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Contraints } from "@/constants/Contraints";
import CategoryItem from "@/components/ui/CategoryItem";

const categoryScreen = () => {
  const list = useSelector((state) => state.categories.list);
  const isLoading = useSelector((state) => state.categories.loading);
  const refresh = useSelector((state) => state.categories.refresh);
  const dispatch = useDispatch();
  const actions = categoriesSlice.actions;

  useEffect(() => {
    fetchCategories();
  }, [refresh]);

  useEffect(() => {
    saveCategories(list);
  }, [list]);

  const fetchCategories = async () => {
    dispatch(actions.fetchCategories());

    const categories = await getCategories();
    if (categories) {
      console.log(categories);
      dispatch(actions.fetchCategoriesSuccess(categories));
    }
    axios
      .get("https://v2.jokeapi.dev/categories", {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        var newCategories = [];

        if (categories) {
          response.data.categories.forEach((item) => {
            if (!categories.includes(item)) {
              newCategories.push({
                name: item,
                isOpen: false,
                isLoading: false,
                jokes: [],
              });
            }
          });
          if (
            categories &&
            response.data.categories.length > categories.length
          ) {
            dispatch(
              actions.addList(
                newCategories.filter((item) => !categories.includes(item))
              )
            );
          }
          return;
        } else {
          response.data.categories.forEach((item) => {
            newCategories.push({
              name: item,
              isOpen: false,
              isLoading: false,
              jokes: [],
            });
          });
          console.log(response.data);
          dispatch(actions.fetchCategoriesSuccess(newCategories));
        }
      })
      .catch((error) => {
        console.log(error);
        dispatch(actions.fetchCategoriesFailure(error.message));
      });
  };

  const saveCategories = async (categories) => {
    try {
      await AsyncStorage.setItem(
        Contraints.categoriesKey,
        JSON.stringify(categories)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const getCategories = async () => {
    try {
      const value = await AsyncStorage.getItem(Contraints.categoriesKey);
      return JSON.parse(value);
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const colorScheme = Appearance.getColorScheme();

  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;

  const styles = createStyles(theme, colorScheme);

  const Container = Platform.OS === "web" ? ScrollView : SafeAreaView;

  const separatorComp = <View style={styles.separator} />;

  return (
    <Container
      style={{
        backgroundColor: theme.background,
        width: "100%",
        height: "100%",
      }}
    >
      {isLoading ? (
        <View style={styles.loadingView}>
          <AnimatedCircularProgress
            size={120}
            width={15}
            fill={100}
            tintColor={theme.primary}
            onAnimationComplete={() => console.log("onAnimationComplete")}
            backgroundColor={theme.primaryBackground}
          />
          <Text style={{ marginTop: 16 }}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.name}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          ItemSeparatorComponent={separatorComp}
          refreshControl={
            <RefreshControl
              colors={[theme.primary, theme.primaryBackground]}
              refreshing={isLoading}
              onRefresh={() => {
                dispatch(actions.refreshCategories());
              }}
            />
          }
          ListEmptyComponent={<Text>No items</Text>}
          renderItem={({ item, index }) => {
            return <CategoryItem item={item} index={index} />;
          }}
        />
      )}
    </Container>
  );
};

export default categoryScreen;

function createStyles(theme, colorScheme) {
  return StyleSheet.create({
    contentContainer: {
      paddingTop: 10,
      paddingBottom: 20,
      paddingHorizontal: 12,
      backgroundColor: theme.background,
    },
    loadingView: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.background,
    },
    separator: {
      height: 1,
      width: "50%",
      maxWidth: 300,
      marginHorizontal: "auto",
      marginBottom: 10,
    },
    row: {
      flexDirection: "row",
      width: "100%",
      maxWidth: 600,
      marginBottom: 10,
      borderStyle: "solid",
      overflow: "hidden",
      marginHorizontal: "auto",
      borderRadius: 16,
      elevation: 3,
      backgroundColor: theme.background,
      shadowOffset: { width: 1, height: 1 },
      shadowColor: "#333",
      shadowOpacity: 0.3,
      shadowRadius: 2,
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
    menuImage: {
      width: 100,
      height: 100,
    },
  });
}
