import { Dimensions } from "react-native";
const { width: deviceWidth, height: deviceHeight } = Dimensions.get('window');
export const hp = (percentage: number) => { // Added type annotation
return (percentage * deviceHeight) / 100;
}
export const wp = (percentage: number) => { // Added type annotation
return (percentage * deviceWidth) / 100;
}