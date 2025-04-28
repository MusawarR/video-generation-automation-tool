export const convertToBase64 = (imageFile) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.readAsDataURL(imageFile)
        
        fileReader.onload = () => resolve(fileReader.result)
        fileReader.onerror = (err) => reject(err)
    })
}