import { StyleSheet } from "react-native";
import { hp } from "@/app/helpers/common";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    overflow: "hidden",
  },
  slide: {
    flexDirection: "row",
  },
  box: {
    width: 191, // Set the width to 191
    height: 258, // Set the height to 258
    marginRight: 32, // Adjust the margin as needed
    alignItems: "center",
    justifyContent: "center", // Center content vertically
    backgroundColor: "#000", // Add background color to make the box visible
    padding: 5, // Add padding to the box
    borderColor: '#3A93FA',
    borderWidth: 2,
    borderRadius: 13
  },
  imageContainer: {
    width: 171, // Adjust the container size as needed
    height: 171, // Adjust the container size as needed
    borderRadius: 85.5, // Half of the width and height to make it circular
    overflow: "hidden", // Ensure the image is contained within the circle
    marginBottom: 0, // Reduce the space between image and text
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // Background color for the circle
  },
  image: {
    width: "80%", // Make the image fill the container
    height: "80%", // Make the image fill the container
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center", // Center the image horizontally
  },
  imageBackground: {
    borderRadius: 85.5, // Ensure the image itself is rounded
  },
  mainText: {
    fontSize: hp(2), // Adjust the text size as needed
    textAlign: "center",
    marginBottom: 2, // Reduce the space between main text and sub text
    fontWeight: 'bold',
    color: '#fff',
    alignSelf: "center"
  },
  subText: {
    fontSize: hp(1.5), // Adjust the text size as needed
    textAlign: "center",
    color: '#fff',
    alignSelf: "center"
  },
});