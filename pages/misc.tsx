import React from "react";

const misc = () => {
  const localStorageData = false;
  const data = false;

  localStorageData
    ? data
      ? console.log("Firestore data!")
      : console.log("localStorage data!")
    : console.log("No Data!");

  // if (localStorageData) {
  //   if (data) {
  //     console.log("Firestore data!");
  //   } else {
  //     console.log("localStorage data!");
  //   }
  // } else {
  //   console.log("No data!");
  // }

  return <div>misc</div>;
};

export default misc;
