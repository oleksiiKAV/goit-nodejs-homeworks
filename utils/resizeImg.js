const Jimp = require("jimp")

const resizeImg = async({img, size: {width, height}}) => {
    const image = await Jimp.read(img);
    return image.resize(width, height).write(img);
}

module.exports = resizeImg;