import React, { useEffect, useState } from "react";
import ScreenFour from "./ScreenFour";
import ScreenOne from "./ScreenOne";
import ScreenThree from "./ScreenThree";
import ScreenTwo from "./ScreenTwo";

const StandbyScreen = () => {
  const [screens] = useState([
    <ScreenOne />,
    <ScreenTwo />,
    <ScreenThree />,
    <ScreenFour />,
    <ScreenFour />,
  ]);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timeOutScreen = setTimeout(() => {
      if (screens[index]) {
        setIndex(index + 1);
      }
    }, 3300);

    return () => {
      clearTimeout(timeOutScreen);
    }
  }, [index]);

  return (
    <>{screens[index]}</>
  );
};

export default StandbyScreen;;