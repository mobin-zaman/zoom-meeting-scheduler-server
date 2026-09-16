import fs from 'fs';

export const setDestination = (req, file, callback) => {
  const fileDirectory = process.env.FILE_SAVE_DIRECTORY;
  console.log('FIle driector: ', fileDirectory);

  callback(null, fileDirectory);
};
