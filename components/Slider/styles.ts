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
    width: 171,
    height: 171,
    borderRadius: 85.5,
    overflow: "hidden",
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  image: {
    width: "80%",
    height: "80%",
    borderRadius: 85.5,
  },
  mainText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 2,
    fontWeight: 'bold',
    color: '#fff',
  },
  subText: {
    fontSize: 12,
    textAlign: "center",
    color: '#fff',
  },
});