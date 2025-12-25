const axios = require("axios");

async function getImageEmbedding(imageUrl) {
  const res = await axios.post("http://localhost:8000/embed", {
    image_url: imageUrl
  });
  return res.data;
}

module.exports = { getImageEmbedding };
