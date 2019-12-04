export const getImageUrl = (image) => {
    let fileName = "default.jpg";
    if(image) {
        fileName = image;
    }
    return `http://127.0.0.1:8888/uploads/${fileName}`;
}