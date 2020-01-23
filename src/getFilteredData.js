const getFilteredData = async conditionVals => {
  let newData = [];

  const getGunData = async () => {
    const response = await fetch(
      "https://firebasestorage.googleapis.com/v0/b/deckgldatamap.appspot.com/o/gundata.json?alt=media&token=113ee5d6-c816-47d5-8000-fcbf00997f13"
    );
    const data = await response.json();
    return data;
  };

  const gundata = await getGunData();

  newData = gundata.filter(el => {
    if (el.categories === 0) {
      return false;
    }

    const incDrive =
      conditionVals.indexOf("drive-by") !== -1
        ? el.categories.toLowerCase().includes("drive-by")
        : el.categories.toLowerCase().includes("~");
    const incHome =
      conditionVals.indexOf("home invasion") !== -1
        ? el.categories.toLowerCase().includes("home invasion")
        : el.categories.toLowerCase().includes("~");
    const incSuicide =
      conditionVals.indexOf("suicide") !== -1
        ? el.categories.toLowerCase().includes("suicide")
        : el.categories.toLowerCase().includes("~");
    const incDefense =
      conditionVals.indexOf("defensive use") !== -1
        ? el.categories.toLowerCase().includes("defensive use")
        : el.categories.toLowerCase().includes("~");
    const incArmedRob =
      conditionVals.indexOf("armed robbery") !== -1
        ? el.categories.toLowerCase().includes("armed robbery")
        : el.categories.toLowerCase().includes("~");
    const incDrug =
      conditionVals.indexOf("drug involvement") !== -1
        ? el.categories.toLowerCase().includes("drug involvement")
        : el.categories.toLowerCase().includes("~");
    const incGang =
      conditionVals.indexOf("gang involvement") !== -1
        ? el.categories.toLowerCase().includes("gang involvement")
        : el.categories.toLowerCase().includes("~");
    const incOfficer =
      conditionVals.indexOf("officer involved") !== -1
        ? el.categories.toLowerCase().includes("officer involved")
        : el.categories.toLowerCase().includes("~");
    const incMass =
      conditionVals.indexOf("mass shooting") !== -1
        ? el.categories.toLowerCase().includes("mass shooting")
        : el.categories.toLowerCase().includes("~");

    return (
      incDrive ||
      incHome ||
      incSuicide ||
      incDefense ||
      incArmedRob ||
      incDrug ||
      incGang ||
      incOfficer ||
      incMass
    );
  });
  return newData;
};

export default getFilteredData;
