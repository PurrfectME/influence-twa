export const truncateAddress = (
    fullStr= '',
    middleStr= '...',
  ) => {
    if (fullStr.length <= 13) return fullStr;
    const midLen = middleStr.length;
    const charsToShow = 13 - midLen;
    const frontChars = Math.ceil(charsToShow / 2);
    const backChars = Math.floor(charsToShow / 2);
    return (
      fullStr.substr(0, frontChars) +
      middleStr+
      fullStr.substr(fullStr.length - backChars)
    );
  };