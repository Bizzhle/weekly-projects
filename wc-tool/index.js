import * as fs from "fs";

function main() {
  const args = process.argv.slice(2);

  switch (args[0]) {
    case "-c":
      // prints the number of bytes in the file
      CountByBytes(args.slice(1));
      break;
    case "-l":
      // prints the number of lines in the file
      CountLine(args.slice(1));
      break;
    case "-m":
      // prints the number of lines in the file
      CountCharacters(args.slice(1));
      break;
    case "-w":
      // prints the number of lines in the file
      countWords(args.slice(1));
      break;
    default:
      break;
  }
}

function CountByBytes(filePaths) {
  if (filePaths.length < 1) {
    console.log("No files to read");
    return;
  }

  let totalCount = 0;
  for (const filePath of filePaths) {
    if (!fs.existsSync(filePath)) {
      console.error("No such file or directory");
      continue;
    }

    let byteCount = fs.statSync(filePath).size;
    console.log(`${byteCount} ${filePath}`);
    totalCount += byteCount;
  }

  if (filePaths.length > 1) {
    console.log(`${totalCount} total`);
  }
}

// function countLines(filePath) {
//   try {
//     // Read the file asynchronously
//     fs.readFile(filePath, "utf-8", (err, data) => {
//       if (err) {
//         console.error("Error reading file:", err);
//         return;
//       }
//       // Split the data into lines and count them
//       const lines = data.split("\n").length;
//       console.log(`Number of lines in ${filePath}:`, lines);
//     });
//   } catch (err) {
//     console.error("Error:", err);
//   }
// }

function getLineCount(fileContent) {
  let count = 0,
    isline = false;

  for (const content of fileContent) {
    const char = content;

    //check for line endings
    if (char === "\n" || char === "\r\n") {
      isline = false;
    } else if (!isline) {
      isline = true;
      count++;
    }
  }
  return count;
}

function CountLine(filePath) {
  if (filePath.length < 1) {
    return;
  }

  CountItems(filePath, getLineCount);
}

function getCharCount(fileContent) {
  return fileContent.length;
}

function CountCharacters(filePath) {
  if (filePath.length < 1) {
    return;
  }

  CountItems(filePath, getCharCount);
}

function CountItems(filePath, getCount) {
  let totalCount = 0;

  for (const path of filePath) {
    if (!fs.existsSync(path)) {
      console.error("No such file");
    }

    let fileContent = fs.readFileSync(path, "utf-8");
    totalCount = getCount(fileContent);

    console.table(`${totalCount} ${path}`);
  }
}

function getCountWords(fileContent) {
  let count = 0,
    isWord = false;

  for (const content of fileContent) {
    const char = content;

    if (char === " " || char === "\n" || char === "\t" || char === "\r") {
      isWord = false;
    } else if (!isWord) {
      isWord = true;
      count++;
    }
  }
  return count;
}

function countWords(filePath) {
  if (filePath.length < 1) {
    return;
  }

  CountItems(filePath, getCountWords);
}

main();
