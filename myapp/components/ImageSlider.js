import { useState, useEffect } from "react";
import { View, Image, Text } from "react-native";

const images = [
  { img: require("../assets/images/forest.jpg"), text: "Forest Monitoring" },
  { img: require("../assets/images/logging.jpg"), text: "Illegal Logging" },
  { img: require("../assets/images/fire.jpg"), text: "Fire Alert" }
];

export default function ImageSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(t);
  }, []);

  return (
    <View>
      <Image
        source={images[index].img}
        style={{ width: "100%", height: 200 }}
      />
      <Text>{images[index].text}</Text>
    </View>
  );
}