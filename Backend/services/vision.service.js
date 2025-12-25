const vision = require("@google-cloud/vision");
const client = new vision.ImageAnnotatorClient();

async function analyzeImage(imageUrl) {
  const [result] = await client.annotateImage({
    image: { source: { imageUri: imageUrl } },
    features: [
      { type: "LABEL_DETECTION" },
      { type: "OBJECT_LOCALIZATION" },
      { type: "IMAGE_PROPERTIES" },
      { type: "TEXT_DETECTION" }
    ]
  });

  return {
    labels: result.labelAnnotations?.map(l => l.description) || [],
    objects: result.localizedObjectAnnotations?.map(o => o.name) || [],
    colors:
      result.imagePropertiesAnnotation?.dominantColors?.colors
        ?.map(c => `${c.color.red}-${c.color.green}-${c.color.blue}`) || [],
    text: result.textAnnotations?.slice(1).map(t => t.description) || []
  };
}

module.exports = { analyzeImage };
