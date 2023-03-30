const Tesseract = require('tesseract.js');
const fs = require('fs');
const { createWorker } = Tesseract;

 

 
// Define the path to your image file
const imagePath = 'C:/Users/durgesh_thakur/Downloads/adhar.jpg';


// Create a new worker
const worker = createWorker({
    logger: m => console.log(m)
  });

// Read the image file
const image = fs.readFileSync(imagePath);

(async () => {
  // Initialize the worker
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');

  // Extract text from the image
  const { data } = await worker.recognize(image);
  const extractedText = data.text;

  // Parse the extracted text and extract the details
  const details = parseExtractedText(extractedText);

  // Output the details in JSON format
  console.log(JSON.stringify(details, null, 2));

  // Terminate the worker
  await worker.terminate();
})();

function parseExtractedText(text) {
  const details = {};

  // Aadhaar Card
  if (text.match(/aadhaar card/i)) {
    const aadhaarRegex = /(\d{4}\s?){3}\d{4}/g;
    const aadhaarNumber = text.match(aadhaarRegex);
    if (aadhaarNumber) {
      details.aadhaarNumber = aadhaarNumber[0].replace(/\s/g, '');
    }
  }

  // PAN Card
  if (text.match(/permanent account number/i)) {
    const panRegex = /[a-z]{5}\d{4}[a-z]{1}/i;
    const panNumber = text.match(panRegex);
    if (panNumber) {
      details.panNumber = panNumber[0].toUpperCase();
    }
  }

  // Driving License
  if (text.match(/driving licence/i)) {
    const dlRegex = /[a-z]{2}-\d{13}/i;
    const dlNumber = text.match(dlRegex);
    if (dlNumber) {
      details.drivingLicenseNumber = dlNumber[0].toUpperCase();
    }
  }

  return details;
}
