import moment from "moment";

export  const parseAndFormatTime = (inputTime: string): string => {
    const parsedTime = moment(inputTime, "HH:mm");
    const formattedTimeString = parsedTime.format("HH:mm:ss");
    return String(formattedTimeString);
  };