import { StyleSheet } from "react-native";
import { hp } from "@/app/helpers/common";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  slide: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "nowrap", // Prevent wrapping
  },
  textContainer: {
    marginRight: 10, // Reduced gap
    padding: 18,
    backgroundColor: "#000",
    borderRadius: 32,
    borderColor: "#3A93FA",
    borderWidth: 2,
    // Removed fixed width and height
    justifyContent: 'center', // Center the text vertically
    alignItems: 'center', // Center the text horizontally
  },
  text: {
    fontSize: hp(1.8),
    color: "#fff",
    fontWeight: "bold"
  },
});