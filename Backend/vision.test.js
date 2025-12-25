const vision = require("@google-cloud/vision");

async function testVision() {
  try {
    const client = new vision.ImageAnnotatorClient();

    await client.labelDetection(
      "https://cloud.google.com/images/family-fun.jpg"
    );

    console.log("✅ Vision API working");
  } catch (err) {
    console.error("❌ Vision error:", err.message);
  }
}

testVision();
