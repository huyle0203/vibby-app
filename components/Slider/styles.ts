import { hp, wp } from "@/app/helpers/common";
import { StyleSheet, Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BOX_WIDTH = 191;
const BOX_HEIGHT = 258;
const BOX_MARGIN = 32;

export const styles = StyleSheet.create({
  container: {
    height: BOX_HEIGHT,
    overflow: "hidden",
    width: SCREEN_WIDTH,
  },
  slide: {
    flexDirection: "row",
  },
  box: {
    width: BOX_WIDTH,
    height: BOX_HEIGHT,
    marginRight: BOX_MARGIN,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000",
    padding: 5,
    borderColor: '#3A93FA',
    borderWidth: 2,
    borderRadius: 13
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#3A93FA',
    marginBottom: 10
  },
  image: {
    width: "97%",
    height: "97%",
    borderRadius: 80,
  },
  mainText: {
    fontSize: hp(2.5),
    textAlign: "center",
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#fff',
  },
  subText: {
    fontSize: hp(1.5),
    fontWeight: '500',
    textAlign: "center",
    color: '#fff',
  },
});