
const getRandomColor = () => Math.floor(Math.random()*16777215).toString(16);

export const generateGradient = () => {
    let colorOne = getRandomColor();
    let colorTwo = getRandomColor();
    return `linear-gradient(-45deg, #9400D3, #6E31DE)`
}